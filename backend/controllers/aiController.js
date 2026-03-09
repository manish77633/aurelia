const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/productModel');

const getModel = () => {
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
	return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

// @desc  Generate product description
// @route POST /api/admin/generate-description
const generateDescription = asyncHandler(async (req, res) => {
	const { productName, category } = req.body;
	if (!productName || !category) {
		res.status(400);
		throw new Error('productName and category are required');
	}

	const model = getModel();
	const prompt = `You are a luxury e-commerce copywriter for Aurelia Luxe, a premium marketplace.
Write a compelling, SEO-friendly product description for the following item.

Product Name: ${productName}
Category: ${category}

Rules:
- Exactly 3 sentences (no bullet points, no headings)
- Tone: Sophisticated, aspirational, premium  
- Highlight craftsmanship, materials, and exclusivity
- End with a subtle call-to-action feeling
- Max 80 words total

Return ONLY the description text, nothing else.`;

	const result = await model.generateContent(prompt);
	const text = result.response.text().trim();
	res.json({ description: text });
});

// In-memory chat sessions (productionised would use Redis/DB)
const sessions = new Map();

// @desc  AI Shopping Assistant chat
// @route POST /api/chat
const chat = asyncHandler(async (req, res) => {
	const { message, sessionId } = req.body;
	if (!message?.trim()) {
		res.status(400);
		throw new Error('Message is required');
	}

	const model = getModel();

	// Fetch up to 50 products for context
	const products = await Product.find({}).select('name category price _id').limit(50);
	const productContext = products.map(p => `- ${p.name} (${p.category}) - $${p.price} [Link](/product/${p._id})`).join('\n');

	const SYSTEM_PROMPT = `You are Lumi ✨, the AI Shopping Assistant for Aurelia Luxe — a premium luxury e-commerce platform selling Luxury Watches, Designer Bags, Premium Shoes, and Exclusive Apparel.

Your personality & Language:
- Friendly, sophisticated, and helpful
- ALWAYS respond in a friendly conversational 'Hinglish' (a mix of Hindi and English) just like a modern Indian assistant. Example: "Main aapki kaise help kar sakti hu?", "Yeh watch aapko bahut suit karegi!", "Bilkul, humare paas latest collection hai."
- Short and focused replies (2-4 sentences max)
- Use light emojis (💎 ✨ 👜 ⌚) sparingly.

Our Inventory:
${productContext}

Instructions:
- If the user asks for products, recommendations, or something like "watches", look at Our Inventory and suggest 1-3 highly relevant items.
- STRICT RULE: When suggesting a product from Our Inventory, YOU MUST provide its link exactly in this format: [Product Name](Link). For example: [Rolex Submariner](/product/65e9f9...)
- ONLY suggest products that are listed in Our Inventory! Do not make up products.
- If asked about orders/returns, guide them to check their Orders page or contact support.
- Don't discuss unrelated topics — gently redirect to shopping.`;

	// Build or resume chat history
	const historyKey = sessionId || 'default';
	if (!sessions.has(historyKey)) {
		sessions.set(historyKey, []);
	}
	const history = sessions.get(historyKey);

	// Start chat with history
	const chatSession = model.startChat({
		history: [
			{
				role: 'user',
				parts: [{ text: SYSTEM_PROMPT }],
			},
			{
				role: 'model',
				parts: [{ text: "Hello! I'm Lumi ✨, your personal shopping assistant at Aurelia Luxe. Whether you're searching for the perfect luxury watch, a designer bag, or exclusive apparel — I'm here to help. How can I assist you today?" }],
			},
			...history,
		],
	});

	const result = await chatSession.sendMessage(message);
	const reply = result.response.text().trim();

	// Save to history
	history.push({ role: 'user', parts: [{ text: message }] });
	history.push({ role: 'model', parts: [{ text: reply }] });
	// Trim history to last 20 exchanges to avoid token bloat
	if (history.length > 40) history.splice(0, history.length - 40);

	res.json({ reply, sessionId: historyKey });
});

module.exports = { generateDescription, chat };
