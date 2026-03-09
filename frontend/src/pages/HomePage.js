// HomePage.js replaces existing raw css inline styles with tailwind css utility classes

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import ProductCard from '../components/ui/ProductCard';
import QuickViewModal from '../components/ui/QuickViewModal';
import Loader from '../components/ui/Loader';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// ── MARQUEE DATA ──────────────────────────────────────────────
const MARQUEE_ITEMS = [
  '✦ Handcrafted Excellence',
  '✦ Free Shipping over $500',
  '✦ Authenticity Guaranteed',
  '✦ 30-Day Returns',
  '✦ Exclusive Luxury Pieces',
  '✦ Curated for the Discerning',
  '✦ Swiss Craftsmanship',
  '✦ Italian Leather',
  '✦ Award-Winning Design',
  '✦ Premium Members Club',
];

// ── FAQ DATA ──────────────────────────────────────────────────
const FAQ = [
  { q: 'Are all Aurelia Luxe products authentic?', a: 'Absolutely. Every product undergoes rigorous quality and authenticity verification before being listed on our platform. We partner exclusively with certified artisans and heritage maisons.' },
  { q: 'What is your return policy?', a: 'We offer a generous 30-day return window for all unworn, undamaged items in their original packaging. Simply initiate a return from your Orders page and we\'ll arrange a complimentary pickup.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available at checkout. All orders are insured and shipped in our signature Aurelia Luxe packaging.' },
  { q: 'Do you offer international shipping?', a: 'Yes, we ship to over 85 countries worldwide. Duties and taxes may apply depending on your country of residence. We partner with DHL Express for secure international delivery.' },
  { q: 'Can I customise or engrave products?', a: 'Select watches and jewellery pieces are available for personalisation. Look for the "Personalise" option on the product page, or contact our concierge team at hello@aurelia.com.' },
  { q: 'How do I become a Aurelia Luxe member?', a: 'Simply register an account to access our member benefits, including early access to new collections, exclusive sale events, and personalised style recommendations from our team.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: products, loading } = useSelector((s) => s.products);
  const [openFaq, setOpenFaq] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const pageRef = useRef(null);

  // ── IntersectionObserver for scroll animations ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = pageRef.current?.querySelectorAll(
      '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale'
    );
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => { dispatch(fetchProducts({ featured: 'true' })); }, [dispatch]);

  const featured = products.filter(p => p.featured).slice(0, 8);
  const marqueeDbl = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="bg-cream min-h-screen" ref={pageRef}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-70px)] flex items-center overflow-hidden bg-[#fdfbf7] pt-16 md:pt-0">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-[url('https://luxe-showcase-hub.lovable.app/assets/hero-bg-7iGSsb9J.jpg')] bg-cover bg-center opacity-100" />

          {/* A smooth natural gradient that softly fades from solid cream on the left to totally clear on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7]/100 via-[#fdfbf7]/75 to-transparent sm:via-[#fdfbf7]/50" />

          {/* A soft bottom-up fade on mobile only, just to ensure text is readable if it wraps, without blocking the main image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7]/80 via-transparent to-transparent md:hidden" />
        </div>

        {/* Geometric accent */}
        <div className="hidden lg:block absolute right-[5%] top-[10%] w-[480px] h-[480px] border border-gold/40 rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="hidden lg:block absolute right-[7%] top-[12%] w-[420px] h-[420px] border border-gold/20 rounded-full pointer-events-none z-0 mix-blend-overlay" />

        <div className="relative z-10 px-6 md:px-20 max-w-[800px] mx-auto lg:ml-[10%] text-left">
          <div className="fade-in-up flex items-center gap-2 mb-5">
            <div className="w-8 h-[1px] bg-gold" />
            <span className="text-[0.65rem] md:text-[0.72rem] font-bold tracking-[4px] text-gold uppercase">Premium Marketplace</span>
          </div>
          <h1 className="fade-in-up delay-1 font-playfair text-4xl md:text-6xl lg:text-[4rem] leading-[1.1] font-bold text-charcoal mb-5">
            Where Luxury<br />
            <span className="text-gold italic">Finds</span> a Home.
          </h1>
          <p className="fade-in-up delay-2 text-sm md:text-base text-[#5a5147] leading-relaxed mb-10 max-w-[480px]">
            Discover an unparalleled edit of the world's finest watches, bags, shoes and apparel — curated for those who demand nothing short of extraordinary.
          </p>
          <div className="fade-in-up delay-3 flex flex-col sm:flex-row gap-4">
            <button className="btn-gold flex items-center justify-center gap-2 text-sm md:text-[0.92rem] px-8 py-4" onClick={() => navigate('/shop')}>
              Explore Collection <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </button>
            <button onClick={() => navigate('/about')}
              className="bg-white border-[1.5px] border-gold text-charcoal font-inter text-sm md:text-[0.92rem] font-semibold px-7 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-charcoal hover:text-white hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center justify-center">
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* ── MARQUEE / VOICE OF AURELIA ────────────────── */}
      <div className="bg-charcoal py-3 overflow-hidden whitespace-nowrap">
        <div className="marquee-track inline-flex">
          {marqueeDbl.map((item, i) => (
            <span key={i} className={`inline-block px-8 text-[0.75rem] md:text-[0.78rem] font-semibold tracking-widest uppercase ${i % 2 === 0 ? 'text-gold' : 'text-white'}`}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── VALUE PROPS ──────────────────────────────── */}
      <section className="bg-white py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { Icon: LocalShippingOutlinedIcon, title: 'Free Shipping', desc: 'Complimentary on all orders over $500' },
            { Icon: VerifiedOutlinedIcon, title: 'Authenticity', desc: 'Every piece verified by our experts' },
            { Icon: DiamondOutlinedIcon, title: 'Premium Quality', desc: 'Only the finest materials and craft' },
            { Icon: SupportAgentIcon, title: '24/7 Concierge', desc: 'White-glove support at every step' },
          ].map(({ Icon, title, desc }, i) => (
            <div key={i} className={`scroll-animate delay-${i + 1} text-center px-4 py-6 md:p-7 rounded-2xl border border-gold/10 bg-cream transition-all duration-300 hover:bg-white hover:shadow-[0_8px_32px_rgba(207,160,82,0.12)] hover:border-gold/30`}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CFA052] to-[#E8C97A] flex items-center justify-center mx-auto mb-4">
                <Icon sx={{ fontSize: 24, color: '#fff' }} />
              </div>
              <div className="font-playfair text-base md:text-[1rem] font-semibold mb-2 text-charcoal">{title}</div>
              <div className="text-[0.8rem] md:text-[0.82rem] text-gray-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED COLLECTION ──────────────────────── */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-cream">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="scroll-animate text-[0.65rem] md:text-[0.72rem] font-bold tracking-[4px] text-gold uppercase block mb-2">Featured</span>
            <h2 className="scroll-animate delay-1 font-playfair text-3xl md:text-5xl font-bold text-charcoal mb-4">Curated for You</h2>
            <p className="scroll-animate delay-2 text-sm md:text-[0.92rem] text-gray-500 max-w-[440px] mx-auto">An exquisite selection of our finest pieces, handpicked by our in-house curators.</p>
          </div>
          {loading ? <Loader /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />)}
            </div>
          )}
          <div className="text-center mt-12 md:mt-16">
            <button className="btn-gold inline-flex items-center gap-2" onClick={() => navigate('/shop')}>
              View Full Collection <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="bg-[#fdfbf7] py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1100px] mx-auto text-center mb-10 md:mb-12 px-6">
          <span className="scroll-animate text-[0.65rem] md:text-[0.72rem] font-bold tracking-[4px] text-gold uppercase">Testimonials</span>
          <h2 className="scroll-animate delay-1 font-playfair text-3xl md:text-4xl font-bold text-charcoal mt-3">Voice of Aurelia</h2>
        </div>
        <div className="marquee-testimonials-container mt-4">
          <div className="marquee-testimonials-track">
            {[
              { name: 'Priya Sharma', role: 'Fashion Blogger, Mumbai', text: '"The quality of Aurelia Luxe\'s fabrics is absolutely unmatched. Every piece feels like it was crafted specifically for me. Luxury done right."', initials: 'PS' },
              { name: 'Sunita Agarwal', role: 'Business Owner, Jaipur', text: '"The kurta set for my daughter\'s birthday was absolutely gorgeous. She felt like a princess. Aurelia Luxe never, ever disappoints."', initials: 'SA' },
              { name: 'Shalini Verma', role: 'Journalist', text: '"The wrap dress I ordered received so many compliments at the wedding. The chiffon drapes beautifully and the fit is just perfect."', initials: 'SV' },
              { name: 'Megha D.', role: 'Creative Director', text: '"Their rare collection is unmatched. I secured a limited edition piece that I had been hunting for years. The unboxing experience itself is pure luxury."', initials: 'MD' },
              { name: 'Priya Sharma', role: 'Fashion Blogger, Mumbai', text: '"The quality of Aurelia Luxe\'s fabrics is absolutely unmatched. Every piece feels like it was crafted specifically for me. Luxury done right."', initials: 'PS' },
              { name: 'Sunita Agarwal', role: 'Business Owner, Jaipur', text: '"The kurta set for my daughter\'s birthday was absolutely gorgeous. She felt like a princess. Aurelia Luxe never, ever disappoints."', initials: 'SA' },
              { name: 'Shalini Verma', role: 'Journalist', text: '"The wrap dress I ordered received so many compliments at the wedding. The chiffon drapes beautifully and the fit is just perfect."', initials: 'SV' },
              { name: 'Megha D.', role: 'Creative Director', text: '"Their rare collection is unmatched. I secured a limited edition piece that I had been hunting for years. The unboxing experience itself is pure luxury."', initials: 'MD' },
            ].map((t, i) => (
              <div key={i} className="light-testimonial-card testimonial-item w-[320px] md:w-[400px]">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-gold text-sm md:text-base mb-4 tracking-[4px]">★★★★★</div>
                  <p className="text-sm md:text-base text-[#5a5147] leading-relaxed mb-8 grow font-inter">{t.text}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#b8a691] text-white flex items-center justify-center text-xs font-bold">{t.initials}</div>
                    <div>
                      <div className="font-semibold text-charcoal text-[0.85rem] md:text-[0.95rem]">{t.name}</div>
                      <div className="text-[0.75rem] md:text-[0.85rem] text-gray-400 mt-1">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────── */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-[780px] mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="scroll-animate text-[0.65rem] md:text-[0.72rem] font-bold tracking-[4px] text-gold uppercase block mb-3">Support</span>
            <h2 className="scroll-animate delay-1 font-playfair text-3xl md:text-4xl font-bold text-charcoal">Frequently Asked Questions</h2>
          </div>
          {FAQ.map((item, i) => (
            <div key={i} className={`scroll-animate delay-${i % 4 + 1} border-b border-[#f0ebe3] overflow-hidden`}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full bg-transparent border-none flex items-center justify-between py-5 cursor-pointer text-left focus:outline-none">
                <span className="font-playfair text-[0.95rem] md:text-base font-semibold text-charcoal pr-5">{item.q}</span>
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === i ? 'bg-gold' : 'bg-[#f5f0e8]'}`}>
                  {openFaq === i ? <RemoveIcon sx={{ fontSize: 14, color: '#fff' }} /> : <AddIcon sx={{ fontSize: 14, color: '#CFA052' }} />}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-400 ease-in-out ${openFaq === i ? 'max-h-[200px]' : 'max-h-0'}`}>
                <p className="text-[0.85rem] md:text-[0.9rem] text-gray-500 leading-relaxed pb-5 pt-1">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
