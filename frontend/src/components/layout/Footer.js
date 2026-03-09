import React from 'react';
import { Link } from 'react-router-dom';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export default function Footer() {
  const col = '#D4A853';
  const muted = 'rgba(255,255,255,0.45)';

  return (
    <footer className="bg-[#0F0E0C] pt-14 pb-8 px-6 md:px-12 border-t border-gold/10">
      <div className="max-w-[1200px] mx-auto">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-12 mb-14">

          {/* Brand + newsletter */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <DiamondOutlinedIcon sx={{ color: col, fontSize: 20 }} />
              <span className="font-playfair text-[1.3rem] font-bold text-white">
                Aurelia <span style={{ color: col }}>Luxe</span>
              </span>
            </div>
            <p className="text-[0.85rem] leading-relaxed mb-6 max-w-[280px]" style={{ color: muted }}>
              The world's most discerning luxury marketplace. Curated for those who appreciate the extraordinary.
            </p>
            {/* Newsletter */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <EmailOutlinedIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: muted }} />
                <input
                  placeholder="Your email"
                  className="w-full py-2.5 pl-8 pr-3 bg-white/5 border border-white/10 rounded-lg text-white font-inter text-[0.82rem] outline-none"
                />
              </div>
              <button
                className="px-4 py-2.5 border-none rounded-lg text-white font-inter text-[0.82rem] font-bold cursor-pointer whitespace-nowrap"
                style={{ background: `linear-gradient(135deg,${col},#E8C97A)` }}>
                Subscribe
              </button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <div className="text-[0.65rem] font-bold tracking-[3px] uppercase mb-5" style={{ color: col }}>Shop</div>
            {[['Luxury Watches', '/shop?category=Accessories&subCategory=Women Watch'], ['Designer Bags', '/shop?category=Accessories&subCategory=Women Bag'], ['Premium Shoes', '/shop?category=Footwear'], ['Exclusive Apparel', '/shop?category=Apparel'], ['New Arrivals', '/shop'], ['Featured', '/shop?featured=true']].map(([l, h]) => (
              <Link key={l} to={h} className="block text-[0.85rem] mb-2.5 no-underline transition-colors hover:text-white/75" style={{ color: muted }}>{l}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <div className="text-[0.65rem] font-bold tracking-[3px] uppercase mb-5" style={{ color: col }}>Company</div>
            {[['About Us', '/about'], ['Our Story', '/about'], ['Careers', '/about'], ['Press', '/about'], ['Sustainability', '/about']].map(([l, h]) => (
              <Link key={l} to={h} className="block text-[0.85rem] mb-2.5 no-underline transition-colors hover:text-white/75" style={{ color: muted }}>{l}</Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <div className="text-[0.65rem] font-bold tracking-[3px] uppercase mb-5" style={{ color: col }}>Support</div>
            {[['My Orders', '/orders'], ['My Wishlist', '/wishlist'], ['My Profile', '/profile'], ['Contact Us', '/about'], ['Returns', '/about'], ['Size Guide', '/about']].map(([l, h]) => (
              <Link key={l} to={h} className="block text-[0.85rem] mb-2.5 no-underline transition-colors hover:text-white/75" style={{ color: muted }}>{l}</Link>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/5 pt-7 flex flex-col sm:flex-row justify-between items-center gap-5">
          <span className="text-[0.8rem] text-center sm:text-left" style={{ color: muted }}>
            © {new Date().getFullYear()} Aurelia Luxe. All rights reserved. Crafted by Manish Kumar.
          </span>
          <div className="flex gap-2.5">
            {[InstagramIcon, TwitterIcon, FacebookIcon, YouTubeIcon].map((Icon, i) => (
              <button
                key={i}
                className="w-9 h-9 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer bg-transparent transition-all duration-200 hover:border-gold/40 hover:bg-gold/10">
                <Icon sx={{ fontSize: 16, color: muted }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
