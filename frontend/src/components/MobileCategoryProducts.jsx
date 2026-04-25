import React, { useMemo, useState } from 'react';

const products = [
  { id: 1, name: 'Classic Oxford Shirt', price: 89, category: 'Men', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Leather Chelsea Boots', price: 210, category: 'Men', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Tailored Wool Coat', price: 340, category: 'Men', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Minimal Chronograph', price: 420, category: 'Men', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Premium Runner', price: 150, category: 'Men', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Suede Bomber Jacket', price: 260, category: 'Men', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Silk Evening Blouse', price: 120, category: 'Women', image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=600&auto=format&fit=crop&q=80' },
  { id: 8, name: 'Quilted Shoulder Bag', price: 290, category: 'Women', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&auto=format&fit=crop&q=80' },
  { id: 9, name: 'Cashmere Wrap Coat', price: 390, category: 'Women', image: 'https://images.unsplash.com/photo-1539533377285-a41cc0568fc6?w=600&auto=format&fit=crop&q=80' },
  { id: 10, name: 'Rose Gold Watch', price: 480, category: 'Women', image: 'https://images.unsplash.com/photo-1508685096489-77a5ad2ba674?w=600&auto=format&fit=crop&q=80' },
  { id: 11, name: 'Platform Sneaker', price: 165, category: 'Women', image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&auto=format&fit=crop&q=80' },
  { id: 12, name: 'Structured Satchel', price: 310, category: 'Women', image: 'https://images.unsplash.com/photo-1591348113527-71631b32ba3a?w=600&auto=format&fit=crop&q=80' },
];

export default function MobileCategoryProducts() {
  const [activeCategory, setActiveCategory] = useState('Men');

  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [activeCategory]
  );

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-5 sm:px-6 md:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Category Toggle */}
        <div className="sticky top-0 z-10 bg-[#fafafa]/95 pb-4 pt-1 backdrop-blur">
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            {['Men', 'Women'].map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-[#1a1a1a] text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)]'
                      : 'bg-transparent text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#1a1a1a]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div
          key={activeCategory}
          className="mt-6 grid grid-cols-2 gap-4 transition-all duration-300 ease-out sm:grid-cols-3 md:grid-cols-4"
        >
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            >
              {/* Image Container with Fixed Aspect Ratio */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f3f4f6]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Wishlist Button */}
                <button className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:bg-white active:scale-90">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4.5 w-4.5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col p-3.5">
                <span className="text-[0.6rem] font-bold uppercase tracking-[2px] text-[#CFA052] mb-1">
                  {product.category}
                </span>
                <h3 className="line-clamp-2 font-playfair text-[0.9rem] font-semibold leading-snug text-[#1a1a1a]">
                  {product.name}
                </h3>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-[1rem] font-bold text-[#1a1a1a]">
                    ${product.price}
                  </span>
                  
                  <button
                    type="button"
                    className="flex h-8 px-3 items-center gap-1 rounded-lg bg-[#CFA052] text-white text-[0.7rem] font-bold shadow-md shadow-[#CFA052]/30 transition-all hover:bg-[#b88e46] active:scale-95"
                  >
                    <span>Add</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}