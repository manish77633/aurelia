import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import PublicIcon from '@mui/icons-material/Public';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CodeIcon from '@mui/icons-material/Code';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const navigate = useNavigate();
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

  const values = [
    { Icon: DiamondOutlinedIcon, title: 'Uncompromising Quality', desc: 'Every product on our platform is hand-vetted by our team of luxury experts. We accept nothing less than perfection.' },
    { Icon: VerifiedOutlinedIcon, title: 'Authentic Always', desc: 'Complete provenance documentation for every item. Our zero-tolerance policy on counterfeits is unwavering.' },
    { Icon: PublicIcon, title: 'Global Curation', desc: "We partner with the world's finest ateliers, from Milan to Tokyo, to bring you truly exclusive pieces." },
    { Icon: FavoriteBorderIcon, title: 'Client Devotion', desc: 'Our white-glove concierge service goes beyond purchase — we build lifelong relationships with every client.' },
  ];

  const milestones = [
    { year: '2022', event: 'Aurelia Luxe founded — a vision to democratise ultra-luxury retail' },
    { year: '2023', event: 'First 500 curated products. Partnership with 12 European ateliers.' },
    { year: '2024', event: 'Launched our Members Club. 10,000+ discerning customers served.' },
    { year: '2025', event: 'Expanded to watches, bags, shoes & apparel. Now shipping to 85+ countries.' },
  ];

  const projects = [
    {
      id: 1,
      title: "Velour - Premium E-commerce",
      description: "A high-end fashion e-commerce platform featuring a sleek UI, secure Razorpay payment integration, and Google OAuth. Includes a functional admin dashboard and real-time cart.",
      technologies: ["React", "Node.js", "MongoDB", "Express", "Redux Toolkit", "Tailwind CSS"],
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
      githubUrl: "https://github.com/manish77633/Velour-",
      liveUrl: "https://velour-virid.vercel.app"
    },
    {
      id: 2,
      title: "Wanderlust",
      description: "A full-stack Airbnb-inspired accommodation booking platform. Features include listing creation, map integration, user auth, and booking management.",
      technologies: ["MongoDB", "Express", "React", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop",
      githubUrl: "https://github.com/manish77633/wanderlust",
      liveUrl: "https://wanderlust-k2io.onrender.com/listings"
    },
    {
      id: 3,
      title: "Zerodha Clone (onworking)",
      description: "A comprehensive stock trading platform clone featuring a professional landing page and functional trading dashboard with real-time data visualization.",
      technologies: ["React", "Node.js", "Tailwind CSS", "Axios"],
      imageUrl: "https://zerodha.com/static/images/products-kite.png",
      githubUrl: "https://github.com/manish77633/Zerodha",
      liveUrl: "https://zerodha-375eo5zg1-manishs-projects-e32ba696.vercel.app/"
    },
    {
      id: 4,
      title: "Arihant Marble House",
      description: "A professional business website designed for a marble and granite supplier. Developed using WordPress with custom HTML/CSS/JS for specific interactive elements.",
      technologies: ["WordPress", "HTML", "CSS", "JavaScript"],
      imageUrl: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop",
      githubUrl: "https://github.com/manish77633",
      liveUrl: "https://arihantmarblehouse.com/"
    }
  ];

  return (
    <div className="bg-[#FAFAFA]" ref={pageRef}>

      {/* ── HERO BANNER ─────────────────────────────── */}
      <section className="relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#2d2620]" style={{ minHeight: 420 }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.18]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(207,160,82,0.08) 0%, transparent 70%)' }} />
        {/* decorative rings */}
        <div className="absolute w-[500px] h-[500px] rounded-full border border-[rgba(207,160,82,0.12)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden sm:block" />
        <div className="absolute w-[350px] h-[350px] rounded-full border border-[rgba(207,160,82,0.18)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden sm:block" />
        <div className="relative z-10 text-center px-6 py-16">
          <div className="fade-in-up flex justify-center mb-4">
            <DiamondOutlinedIcon sx={{ fontSize: 36, color: '#CFA052' }} />
          </div>
          <h1 className="fade-in-up delay-1 font-playfair font-bold text-white mb-4 leading-tight" style={{ fontSize: 'clamp(2.2rem,5vw,4.2rem)' }}>
            The House of<br /><span style={{ color: '#CFA052', fontStyle: 'italic' }}>Aurelia Luxe</span>
          </h1>
          <p className="fade-in-up delay-2 text-[rgba(255,255,255,0.6)] max-w-md mx-auto leading-relaxed text-sm sm:text-base">
            Where technology meets tradition. Where craft meets commerce.
          </p>
        </div>
      </section>

      {/* ── BRAND STORY ──────────────────────────────── */}
      <section className="py-16 md:py-20 px-5 sm:px-8 md:px-12 bg-white">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <span className="scroll-animate text-[0.7rem] font-bold tracking-[4px] text-[#CFA052] uppercase block mb-3">Our Story</span>
            <h2 className="scroll-animate delay-1 font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-6 leading-tight">
              Born from a Passion<br className="hidden sm:block" />for the Extraordinary
            </h2>
            <p className="scroll-animate delay-2 text-[0.95rem] text-[#6B7280] leading-[1.9] mb-4">
              Aurelia Luxe was born from a simple belief: that the most extraordinary things in the world should be accessible to those who truly appreciate them. We are not merely a marketplace — we are curators of culture, stewards of craftsmanship, and passionate advocates for the timeless art of luxury.
            </p>
            <p className="scroll-animate delay-3 text-[0.95rem] text-[#6B7280] leading-[1.9] mb-4">
              Every watch we list has been wound by master horologists. Every bag bears the fingerprints of artisans who have dedicated their lives to their craft. Every garment carries with it a legacy of textile excellence spanning generations.
            </p>
            <p className="scroll-animate delay-4 text-[0.95rem] text-[#6B7280] leading-[1.9]">
              We built Aurelia Luxe to be the bridge between these rare creations and the people who deserve them — delivering not just products, but experiences, stories, and pieces of history.
            </p>
          </div>
          <div className="scroll-animate-right delay-2 relative mt-4 md:mt-0">
            <div className="rounded-[20px] overflow-hidden group" style={{ aspectRatio: '4/5' }}>
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85" alt="Luxury Watch" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            {/* floating badges */}
            <div className="float-badge absolute bottom-4 sm:bottom-7 left-0 sm:-left-6 bg-[#1A1A1A] rounded-2xl px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
              <div className="font-playfair text-2xl font-bold text-[#CFA052]">85+</div>
              <div className="text-[0.75rem] text-[rgba(255,255,255,0.7)] mt-0.5">Countries Served</div>
            </div>
            <div className="float-badge-delay absolute top-4 sm:top-7 right-0 sm:-right-5 bg-[#CFA052] rounded-2xl px-5 py-4 shadow-[0_12px_40px_rgba(207,160,82,0.4)]">
              <div className="font-playfair text-2xl font-bold text-white">10K+</div>
              <div className="text-[0.75rem] text-[rgba(255,255,255,0.85)] mt-0.5">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────── */}
      <section className="py-16 md:py-20 px-5 sm:px-8 md:px-12 bg-[#FAFAFA]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <span className="scroll-animate text-[0.7rem] font-bold tracking-[4px] text-[#CFA052] uppercase block mb-3">What We Stand For</span>
            <h2 className="scroll-animate delay-1 font-playfair text-3xl sm:text-[2.2rem] font-bold text-[#1A1A1A]">The Aurelia Promise</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className={`scroll-animate delay-${i + 1} glow-hover bg-white rounded-2xl p-7 text-center border border-[rgba(207,160,82,0.1)] cursor-default`}
              >
                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-[#CFA052] to-[#E8C97A] flex items-center justify-center mx-auto mb-5 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                  <Icon sx={{ fontSize: 26, color: '#fff' }} />
                </div>
                <div className="font-playfair text-[1.05rem] font-bold mb-2.5 text-[#1A1A1A]">{title}</div>
                <div className="text-[0.85rem] text-[#6B7280] leading-[1.7]">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MILESTONES ───────────────────────────────── */}
      <section className="py-16 md:py-20 px-5 sm:px-8 md:px-12 bg-[#1A1A1A]">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <span className="scroll-animate text-[0.7rem] font-bold tracking-[4px] text-[#CFA052] uppercase block mb-3">Our Journey</span>
            <h2 className="scroll-animate delay-1 font-playfair text-3xl sm:text-[2.2rem] font-bold text-white">Milestones</h2>
          </div>

          {/* Mobile: stacked list */}
          <div className="flex flex-col gap-4 md:hidden">
            {milestones.map((m, i) => (
              <div key={i} className={`scroll-animate delay-${i + 1} flex gap-4 items-start bg-[rgba(255,255,255,0.04)] border border-[rgba(207,160,82,0.15)] rounded-2xl p-5 transition-all duration-300 hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(207,160,82,0.3)]`}>
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#CFA052] mt-2 pulse-dot" />
                <div>
                  <div className="font-playfair text-xl font-bold text-[#CFA052] mb-1">{m.year}</div>
                  <div className="text-[0.88rem] text-[rgba(255,255,255,0.65)] leading-[1.7]">{m.event}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: alternating timeline */}
          <div className="relative hidden md:block">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[rgba(207,160,82,0.25)] -translate-x-1/2" />
            {milestones.map((m, i) => (
              <div key={i} className={`scroll-animate delay-${i + 1} flex mb-10 relative ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                {/* center dot */}
                <div className="absolute left-1/2 top-5 w-3 h-3 rounded-full bg-[#CFA052] -translate-x-1/2 pulse-dot" />
                <div className="w-[44%] bg-[rgba(255,255,255,0.04)] border border-[rgba(207,160,82,0.15)] rounded-2xl p-6 transition-all duration-300 hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(207,160,82,0.35)] hover:-translate-y-1">
                  <div className="font-playfair text-[1.4rem] font-bold text-[#CFA052] mb-2">{m.year}</div>
                  <div className="text-[0.88rem] text-[rgba(255,255,255,0.65)] leading-[1.7]">{m.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET THE FOUNDER ─────────────────────────── */}
      <section className="py-16 md:py-20 px-5 sm:px-8 md:px-12 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-12">
            <span className="scroll-animate text-[0.7rem] font-bold tracking-[4px] text-[#CFA052] uppercase block mb-3">The Visionary</span>
            <h2 className="scroll-animate delay-1 font-playfair text-3xl sm:text-[2.2rem] font-bold text-[#1A1A1A]">Meet the Founder</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10 md:gap-14 items-center">
            {/* Photo */}
            <div className="scroll-animate-left delay-2 relative mx-auto w-full max-w-[300px] md:max-w-none">
              <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#f5ede0] to-[#e8d5b8] group" style={{ aspectRatio: '3/4' }}>
                <img src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg" alt="Manish Kumar - Animated 3D Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              {/* code badge */}
              <div className="float-badge absolute bottom-0 right-0 sm:-bottom-4 sm:-right-4 bg-[#CFA052] rounded-xl px-4 py-3 shadow-[0_8px_28px_rgba(207,160,82,0.4)] flex items-center gap-2">
                <CodeIcon sx={{ fontSize: 18, color: '#fff' }} />
                <span className="text-[0.8rem] font-bold text-white">MERN Developer</span>
              </div>
            </div>
            {/* Bio */}
            <div className="scroll-animate-right delay-2 pt-2">
              <h3 className="font-playfair text-3xl sm:text-[2rem] font-bold text-[#1A1A1A] mb-1.5">Manish Kumar</h3>
              <div className="flex items-center gap-1.5 mb-6">
                <AutoAwesomeIcon sx={{ fontSize: 16, color: '#CFA052' }} />
                <span className="text-[0.85rem] text-[#CFA052] font-semibold">Founder & Full-Stack MERN Developer</span>
              </div>
              <p className="scroll-animate delay-3 text-[0.95rem] text-[#6B7280] leading-[1.9] mb-4">
                Manish Kumar is a passionate Full-Stack MERN Developer who dared to dream at the intersection of two worlds that most considered mutually exclusive — cutting-edge technology and ultra-luxury retail. Where others saw a gap, Manish saw an opportunity.
              </p>
              <p className="scroll-animate delay-4 text-[0.95rem] text-[#6B7280] leading-[1.9] mb-4">
                With a deep love for elegant code and an equally deep appreciation for finely crafted things, he set out to build Aurelia Luxe — a platform that would treat every pixel with the same care a master artisan gives to every stitch. His philosophy is simple: a digital luxury experience should feel as premium as the products it showcases.
              </p>
              <p className="scroll-animate delay-5 text-[0.95rem] text-[#6B7280] leading-[1.9] mb-7">
                From the glassmorphism navbar to the gold-accented micro-interactions, every detail of Aurelia Luxe is a reflection of Manish's conviction that great technology is invisible — it simply makes life more beautiful.
              </p>
              {/* Skills */}
              <div className="scroll-animate delay-6 flex flex-wrap gap-2.5">
                {['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Redux Toolkit', 'UI/UX Design', 'Luxury Curation'].map(skill => (
                  <span key={skill} className="skill-tag px-4 py-1.5 bg-[#f5f0e8] rounded-full text-[0.78rem] font-bold text-[#CFA052] border border-[rgba(207,160,82,0.2)] cursor-default">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OTHER PROJECTS BY THE FOUNDER ──────────────── */}
      <section className="py-16 md:py-20 px-5 sm:px-8 md:px-12 bg-[#FAFAFA]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-[0.7rem] font-bold tracking-[4px] text-[#CFA052] uppercase block mb-3"
            >
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-playfair text-3xl sm:text-[2.2rem] font-bold text-[#1A1A1A]"
            >
              Other Projects by the Founder
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((project, i) => {
              const isLarge = i === 0 || i === 3;
              const isReversed = i === 3;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.97, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`group relative flex ${isLarge ? (isReversed ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row') : 'flex-col'} bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[rgba(207,160,82,0.15)] transition-all duration-500 hover:border-[#CFA052] hover:shadow-[0_20px_50px_rgba(207,160,82,0.15)] overflow-hidden ${isLarge ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}`}
                >
                  {/* Image Section */}
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`block relative overflow-hidden cursor-pointer ${isLarge ? 'w-full md:w-[50%] lg:w-[58%] h-60 md:h-auto' : 'w-full h-56'}`}>
                    <div className="absolute inset-0 bg-[#CFA052]/5 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />
                    {isLarge && (
                      <div className="absolute bottom-5 left-5 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[0.7rem] font-bold font-inter tracking-[2px] uppercase border border-white/30">
                          Featured Project
                        </span>
                      </div>
                    )}
                  </a>

                  {/* Content Section */}
                  <div className={`flex flex-col flex-1 relative bg-white z-10 ${isLarge ? 'p-8 md:p-10 md:w-[50%] lg:w-[42%] justify-center' : 'p-7 md:p-8'}`}>
                    <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-[rgba(207,160,82,0.15)] to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="flex justify-between items-start mb-4 gap-4">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#CFA052] transition-colors inline-block z-10">
                        <h3 className={`font-playfair font-bold text-[#1A1A1A] leading-tight ${isLarge ? 'text-2xl lg:text-[1.8rem]' : 'text-xl lg:text-2xl'}`}>
                          {project.title}
                        </h3>
                      </a>

                      <div className="flex items-center gap-2.5 shrink-0 z-10">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1A1A1A] transition-colors hover:scale-110" aria-label="GitHub Repository">
                            <GitHubIcon sx={{ fontSize: 22 }} />
                          </a>
                        )}
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] rounded-full bg-[#fef9ec] border border-[rgba(207,160,82,0.3)] flex items-center justify-center text-[#CFA052] transition-all duration-300 hover:bg-[#CFA052] hover:text-white hover:border-[#CFA052] hover:scale-110 hover:shadow-[0_4px_12px_rgba(207,160,82,0.3)]" aria-label="Live Demo">
                          <LaunchIcon sx={{ fontSize: 13 }} />
                        </a>
                      </div>
                    </div>

                    <p className={`text-[#6B7280] leading-[1.8] flex-1 mb-7 z-10 ${isLarge ? 'text-[0.95rem]' : 'text-[0.9rem]'}`}>
                      {project.description}
                    </p>

                    {/* Technology Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto z-10">
                      {project.technologies.map(tech => (
                        <span key={tech} className="px-3 py-1.5 bg-[#FAFAFA] rounded-md text-[0.75rem] font-bold tracking-wide text-[#927855] border border-[rgba(207,160,82,0.15)] shadow-sm hover:border-[#CFA052] transition-colors duration-300 cursor-default">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-5 sm:px-8 md:px-12 bg-gradient-to-br from-[#f7f2ec] to-[#ede5d8] text-center">
        <div className="max-w-[560px] mx-auto">
          <div className="scroll-animate-scale">
            <EmojiEventsOutlinedIcon sx={{ fontSize: 44, color: '#CFA052', marginBottom: '20px' }} />
          </div>
          <h2 className="scroll-animate delay-1 font-playfair text-3xl sm:text-[2rem] font-bold text-[#1A1A1A] mb-4">
            Experience Luxury, Redefined.
          </h2>
          <p className="scroll-animate delay-2 text-[0.95rem] text-[#6B7280] leading-[1.8] mb-8">
            Join over 10,000 discerning members who trust Aurelia Luxe for the world's finest pieces.
          </p>
          <div className="scroll-animate delay-3">
            <button className="btn-gold inline-flex items-center gap-2 text-[0.95rem] group" onClick={() => navigate('/shop')}>
              Explore the Collection <ArrowForwardIcon sx={{ fontSize: 18 }} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
