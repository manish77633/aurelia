const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/productModel');
const User = require('./models/userModel');

const products = [
  // ─── MEN ──────────────────────────────────────────────────
  // Men's Shirts (5+)
  { name: "Classic Silk Shirt", description: "Premium silk tailored fit.", price: 150, category: "Apparel", subCategory: "Men Shirt", gender: "Men", colors: ["White", "Black"], image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", countInStock: 20, featured: true },
  { name: "Linen Summer Shirt", description: "Breathable for warm weather.", price: 95, category: "Apparel", subCategory: "Men Shirt", gender: "Men", colors: ["Light Blue"], image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=800&q=80", countInStock: 25 },
  { name: "Oxford Button-Down", description: "Classic preppy style.", price: 110, category: "Apparel", subCategory: "Men Shirt", gender: "Men", colors: ["Blue", "Pink"], image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", countInStock: 15 },
  { name: "Mandarin Collar Shirt", description: "Minimalist modern look.", price: 125, category: "Apparel", subCategory: "Men Shirt", gender: "Men", colors: ["White"], image: "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=800&q=80", countInStock: 10 },
  { name: "Denim Heritage Shirt", description: "Rugged yet refined.", price: 140, category: "Apparel", subCategory: "Men Shirt", gender: "Men", colors: ["Denim"], image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&q=80", countInStock: 12 },

  // Men's T-shirts (5+)
  { name: "Luxe Cotton T-shirt", description: "Egyptian cotton feel.", price: 60, category: "Apparel", subCategory: "Men T-shirt", gender: "Men", colors: ["Black"], image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", countInStock: 50 },
  { name: "Graphic Vintage Tee", description: "Heavyweight cotton print.", price: 85, category: "Apparel", subCategory: "Men T-shirt", gender: "Men", colors: ["Cream"], image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80", countInStock: 40 },
  { name: "Essential V-Neck", description: "Clean lines, soft touch.", price: 55, category: "Apparel", subCategory: "Men T-shirt", gender: "Men", colors: ["White", "Grey"], image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", countInStock: 30 },
  { name: "Pique Polo Shirt", description: "Athletic luxury fit.", price: 90, category: "Apparel", subCategory: "Men T-shirt", gender: "Men", colors: ["Navy"], image: "https://images.unsplash.com/photo-1603252109303-2751441dd15e?w=800&q=80", countInStock: 20 },
  { name: "Henley Long Sleeve", description: "Layering essential.", price: 75, category: "Apparel", subCategory: "Men T-shirt", gender: "Men", colors: ["Charcoal"], image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80", countInStock: 18 },

  // Men's Coats (5+)
  { name: "Wool Trench Coat", description: "Sophisticated wool blend.", price: 450, category: "Apparel", subCategory: "Men Coat", gender: "Men", colors: ["Camel"], image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", countInStock: 10, featured: true },
  { name: "Aviator Leather Jacket", description: "Classic leather wool collar.", price: 550, category: "Apparel", subCategory: "Men Coat", gender: "Men", colors: ["Black"], image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", countInStock: 7 },
  { name: "Quilted Down Parka", description: "Maximum winter warmth.", price: 680, category: "Apparel", subCategory: "Men Coat", gender: "Men", colors: ["Navy"], image: "https://images.unsplash.com/photo-1544923246-77307dd654ca?w=800&q=80", countInStock: 5 },
  { name: "Cashmere Overcoat", description: "The pinnacle of luxury.", price: 1200, category: "Apparel", subCategory: "Men Coat", gender: "Men", colors: ["Grey"], image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80", countInStock: 3 },
  { name: "Bomber Suede Jacket", description: "Casual luxury staple.", price: 380, category: "Apparel", subCategory: "Men Coat", gender: "Men", colors: ["Brown"], image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", countInStock: 8 },

  // Men's Sport Shoes (5+)
  { name: "Performance Trainer", description: "High-performance design.", price: 180, category: "Footwear", subCategory: "Men Sport Shoe", gender: "Men", colors: ["White/Red"], image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", countInStock: 25, featured: true },
  { name: "Cloud Runner Pro", description: "Lightweight cushioning.", price: 210, category: "Footwear", subCategory: "Men Sport Shoe", gender: "Men", colors: ["Black"], image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80", countInStock: 30 },
  { name: "Gym Master Elite", description: "Stability for training.", price: 165, category: "Footwear", subCategory: "Men Sport Shoe", gender: "Men", colors: ["Grey/Neon"], image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80", countInStock: 22 },
  { name: "Retro Court Sneaker", description: "Vintage inspired leather.", price: 195, category: "Footwear", subCategory: "Men Sport Shoe", gender: "Men", colors: ["White"], image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80", countInStock: 15 },
  { name: "Neon Flux Runner", description: "Modern aesthetic performance.", price: 240, category: "Footwear", subCategory: "Men Sport Shoe", gender: "Men", colors: ["Multi"], image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80", countInStock: 10 },

  // Men's Boots (5+)
  { name: "Heritage Chelsea Boots", description: "Handcrafted leather boots.", price: 320, category: "Footwear", subCategory: "Men Boot", gender: "Men", colors: ["Brown"], image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80", countInStock: 15, featured: true },
  { name: "Rugged Work Boot", description: "Built for durability.", price: 280, category: "Footwear", subCategory: "Men Boot", gender: "Men", colors: ["Tan"], image: "https://images.unsplash.com/photo-1520639889313-7313c0afb2ca?w=800&q=80", countInStock: 20 },
  { name: "Ductile Desert Boot", description: "Soft suede comfort.", price: 190, category: "Footwear", subCategory: "Men Boot", gender: "Men", colors: ["Sand"], image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", countInStock: 25 },
  { name: "Combat Strike Boot", description: "Military inspired luxury.", price: 350, category: "Footwear", subCategory: "Men Boot", gender: "Men", colors: ["Black"], image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80", countInStock: 12 },
  { name: "Alpine Hiker Boot", description: "Waterproof mountain luxury.", price: 420, category: "Footwear", subCategory: "Men Boot", gender: "Men", colors: ["Dark Brown"], image: "https://images.unsplash.com/photo-1520639889313-7313c0afb2ca?w=800&q=80", countInStock: 8 },

  // Men's Watches (5+)
  { name: "Executive Chronograph", description: "Sapphire crystal leather strap.", price: 1200, category: "Accessories", subCategory: "Men Watch", gender: "Men", colors: ["Silver"], image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80", countInStock: 8 },
  { name: "Grand Master Automatic", description: "Swiss movement exhibition back.", price: 2800, category: "Accessories", subCategory: "Men Watch", gender: "Men", colors: ["Gold"], image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", countInStock: 5, featured: true },
  { name: "Deep Sea Diver", description: "300m water resistance.", price: 1500, category: "Accessories", subCategory: "Men Watch", gender: "Men", colors: ["Blue"], image: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800&q=80", countInStock: 10 },
  { name: "Modern Minimalist", description: "Clean dial, mesh strap.", price: 450, category: "Accessories", subCategory: "Men Watch", gender: "Men", colors: ["Black"], image: "https://images.unsplash.com/photo-1508685096489-77a5ad2ba674?w=800&q=80", countInStock: 20 },
  { name: "Vintage Pilot", description: "Large numerals, luminous hands.", price: 890, category: "Accessories", subCategory: "Men Watch", gender: "Men", colors: ["Steel"], image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80", countInStock: 14 },

  // ─── WOMEN ────────────────────────────────────────────────
  // Women's Shirts (5+)
  { name: "Satin Evening Blouse", description: "Elegant satin detailing.", price: 130, category: "Apparel", subCategory: "Women Shirt", gender: "Women", colors: ["Emerald"], image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&q=80", countInStock: 18, featured: true },
  { name: "Velvet Cocktail Blouse", description: "Rich velvet evening wear.", price: 180, category: "Apparel", subCategory: "Women Shirt", gender: "Women", colors: ["Royal Blue"], image: "https://images.unsplash.com/photo-1518691340140-512e66ce957b?w=800&q=80", countInStock: 14 },
  { name: "Mulberry Silk Top", description: "Ultra-soft luxury silk.", price: 210, category: "Apparel", subCategory: "Women Shirt", gender: "Women", colors: ["Ivory"], image: "https://images.unsplash.com/photo-1584273143981-43c2910f33cc?w=800&q=80", countInStock: 10 },
  { name: "Floral Chiffon Shirt", description: "Light and airy floral print.", price: 145, category: "Apparel", subCategory: "Women Shirt", gender: "Women", colors: ["Floral"], image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80", countInStock: 22 },
  { name: "Puffed Sleeve Blouse", description: "Victorian inspired modern cut.", price: 165, category: "Apparel", subCategory: "Women Shirt", gender: "Women", colors: ["White"], image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=80", countInStock: 15 },

  // Women's T-shirts (5+)
  { name: "Embroidered Logo Tee", description: "Artisanal embroidery cotton.", price: 75, category: "Apparel", subCategory: "Women T-shirt", gender: "Women", colors: ["White"], image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80", countInStock: 30 },
  { name: "Minimalist Essential Tee", description: "Fine-gauge cotton design.", price: 55, category: "Apparel", subCategory: "Women T-shirt", gender: "Women", colors: ["Black"], image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80", countInStock: 60 },
  { name: "Mercerized Cotton Tee", description: "Lustrous finish, high comfort.", price: 80, category: "Apparel", subCategory: "Women T-shirt", gender: "Women", colors: ["Navy"], image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80", countInStock: 40 },
  { name: "Striped Breton Top", description: "French chic essential.", price: 95, category: "Apparel", subCategory: "Women T-shirt", gender: "Women", colors: ["White/Blue"], image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80", countInStock: 25 },
  { name: "Cap Sleeve Luxury Tee", description: "Pima cotton elegance.", price: 65, category: "Apparel", subCategory: "Women T-shirt", gender: "Women", colors: ["Lavender"], image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80", countInStock: 35 },

  // Women's Coats (5+)
  { name: "Cashmere Wrap Coat", description: "Ultra-luxurious waist belt.", price: 850, category: "Apparel", subCategory: "Women Coat", gender: "Women", colors: ["Cream"], image: "https://images.unsplash.com/photo-1539533377285-a41cc0568fc6?w=800&q=80", countInStock: 5, featured: true },
  { name: "Shearling Winter Parka", description: "Premium shearling lining.", price: 920, category: "Apparel", subCategory: "Women Coat", gender: "Women", colors: ["Olive"], image: "https://images.unsplash.com/photo-1544923246-77307dd654ca?w=800&q=80", countInStock: 4 },
  { name: "Belted Wool Blazer", description: "Structured professional luxury.", price: 420, category: "Apparel", subCategory: "Women Coat", gender: "Women", colors: ["Checkered"], image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", countInStock: 12 },
  { name: "Quilted Silk Puffer", description: "Metallic finish light weight.", price: 580, category: "Apparel", subCategory: "Women Coat", gender: "Women", colors: ["Bronze"], image: "https://images.unsplash.com/photo-1544923246-77307dd654ca?w=800&q=80", countInStock: 8 },
  { name: "Classic Camel Coat", description: "Timeless silhouette wool.", price: 750, category: "Apparel", subCategory: "Women Coat", gender: "Women", colors: ["Camel"], image: "https://images.unsplash.com/photo-1539533377285-a41cc0568fc6?w=800&q=80", countInStock: 6 },

  // Women's Sport Shoes (5+)
  { name: "Nebula Running Shoe", description: "Ergonomic sports design.", price: 160, category: "Footwear", subCategory: "Women Sport Shoe", gender: "Women", colors: ["Lavender"], image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", countInStock: 20, featured: true },
  { name: "Zenith Training Sneaker", description: "Maximum flexibility sole.", price: 175, category: "Footwear", subCategory: "Women Sport Shoe", gender: "Women", colors: ["Mint"], image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&q=80", countInStock: 15 },
  { name: "Platform Sport Luxe", description: "Elevated athletic style.", price: 195, category: "Footwear", subCategory: "Women Sport Shoe", gender: "Women", colors: ["White/Gold"], image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80", countInStock: 12 },
  { name: "Light Speed Racer", description: "Aerodynamic mesh upper.", price: 185, category: "Footwear", subCategory: "Women Sport Shoe", gender: "Women", colors: ["Electric Blue"], image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", countInStock: 18 },
  { name: "Active Aura Sneaker", description: "Breathable comfort tech.", price: 150, category: "Footwear", subCategory: "Women Sport Shoe", gender: "Women", colors: ["Coral"], image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", countInStock: 25 },

  // Women's Boots (5+)
  { name: "Suede Ankle Boots", description: "Comfortable block heel.", price: 280, category: "Footwear", subCategory: "Women Boot", gender: "Women", colors: ["Tan"], image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", countInStock: 12 },
  { name: "Tall Riding Boot", description: "Polished Italian leather.", price: 450, category: "Footwear", subCategory: "Women Boot", gender: "Women", colors: ["Black"], image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80", countInStock: 10, featured: true },
  { name: "Stiletto Sock Boot", description: "Sleek pointed toe silhouette.", price: 320, category: "Footwear", subCategory: "Women Boot", gender: "Women", colors: ["Nude"], image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", countInStock: 8 },
  { name: "Combat Grace Boot", description: "Rugged sole, feminine detail.", price: 290, category: "Footwear", subCategory: "Women Boot", gender: "Women", colors: ["Charcoal"], image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80", countInStock: 14 },
  { name: "Western Flair Boot", description: "Embroidered suede cowboy.", price: 380, category: "Footwear", subCategory: "Women Boot", gender: "Women", colors: ["Cognac"], image: "https://images.unsplash.com/photo-1520639889313-7313c0afb2ca?w=800&q=80", countInStock: 6 },

  // Women's Watches (5+)
  { name: "Diamond Dial Watch", description: "Rose gold diamond markers.", price: 2100, category: "Accessories", subCategory: "Women Watch", gender: "Women", colors: ["Rose Gold"], image: "https://images.unsplash.com/photo-1508685096489-77a5ad2ba674?w=800&q=80", countInStock: 6, featured: true },
  { name: "Petite Pearl Watch", description: "Mother of pearl dial.", price: 1250, category: "Accessories", subCategory: "Women Watch", gender: "Women", colors: ["White Pearl"], image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&q=80", countInStock: 9 },
  { name: "Celestial Charm", description: "Night sky dial, starry strap.", price: 1800, category: "Accessories", subCategory: "Women Watch", gender: "Women", colors: ["Midnight Blue"], image: "https://images.unsplash.com/photo-1508685096489-77a5ad2ba674?w=800&q=80", countInStock: 4 },
  { name: "Grace Bangle Watch", description: "Jewlery and timepiece hybrid.", price: 950, category: "Accessories", subCategory: "Women Watch", gender: "Women", colors: ["Silver"], image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&q=80", countInStock: 12 },
  { name: "The Emerald Heirloom", description: "Emerald cut glass, classic link.", price: 3200, category: "Accessories", subCategory: "Women Watch", gender: "Women", colors: ["Gold/Green"], image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80", countInStock: 2 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Products cleared.');

    // Get or create an admin user to be the seller
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'Manish Kumar',
        email: 'admin@aurelia.com',
        password: 'admin123456',
        role: 'admin',
      });
      console.log('Admin user created: admin@aurelia.com / admin123456');
    }

    // Attach seller id to all products
    const productsWithSeller = products.map((p) => ({ ...p, seller: admin._id }));
    await Product.insertMany(productsWithSeller);
    console.log(`✅ ${products.length} products seeded successfully!`);
    console.log('\n─────────────────────────────────────');
    console.log('Admin Login → admin@aurelia.com');
    console.log('Password   → admin123456');
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeder Error:', error);
    process.exit(1);
  }
};

seedDB();
