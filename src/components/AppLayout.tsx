import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Menu, X, Phone, Mail, ArrowRight, Building2, Hammer, HardHat, Award, Users, Globe, Star, ChevronLeft, ChevronRight, CheckCircle2, MapPin, Send, Clock, MessageCircle, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';

const BRAND = {
  name: 'Nickztech Construction Co Ltd',
  shortName: 'Nickztech Construction',
  tagline: 'Solid foundation for brighter future',
  logo: 'https://d64gsuwffb70l.cloudfront.net/69ca78dfad904d4aa71cee1d_1774877477854_94d2876c.jpeg',
  email: 'construction77@gmail.com',
  phone1: '+237 659820956',
  phone2: '+237 683063959',
  whatsapp: '237659820956',
  facebook: 'https://web.facebook.com/profile.php?id=100091741041856',
  instagram: 'https://instagram.com/nickztechconstruction',
  address: 'Douala, Cameroon',
};

const HERO_IMG = 'https://d64gsuwffb70l.cloudfront.net/69ca7bf49143ce3e243961ac_1774878226858_65cadb51.jpg';
const TEAM_IMG = 'https://d64gsuwffb70l.cloudfront.net/69ca7bf49143ce3e243961ac_1774878449953_aab02641.jpg';

const AppLayout: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentReview, setCurrentReview] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [sRes, pRes, rRes] = await Promise.all([
        supabase.from('services').select('*').order('sort_order').limit(6),
        supabase.from('projects').select('*').eq('is_featured', true).limit(4),
        supabase.from('reviews').select('*').eq('is_approved', true).limit(6),
      ]);
      if (sRes.data) setServices(sRes.data);
      if (pRes.data) setProjects(pRes.data);
      if (rRes.data) setReviews(rRes.data);
    };
    fetchData();
  }, []);

  const nextReview = () => setCurrentReview(prev => (prev + 1) % Math.max(reviews.length, 1));
  const prevReview = () => setCurrentReview(prev => (prev - 1 + reviews.length) % Math.max(reviews.length, 1));

  const stats = [
    { icon: Building2, value: '200+', label: 'Projects Completed' },
    { icon: Users, value: '150+', label: 'Happy Clients' },
    { icon: HardHat, value: '15+', label: 'Years Experience' },
    { icon: Globe, value: '5+', label: 'Countries Served' },
  ];

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="hidden md:block bg-[#1F2F8F] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`mailto:${BRAND.email}`} className="flex items-center gap-1.5 hover:text-[#F5A623] transition-colors">
              <Mail className="w-3.5 h-3.5" /> {BRAND.email}
            </a>
            <a href={`tel:${BRAND.phone1}`} className="flex items-center gap-1.5 hover:text-[#F5A623] transition-colors">
              <Phone className="w-3.5 h-3.5" /> {BRAND.phone1}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#F5A623] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#F5A623] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-3">
              <img src={BRAND.logo} alt={BRAND.name} className="h-10 md:h-14 w-auto rounded" />
              <div className="hidden sm:block">
                <h1 className="text-[#1F2F8F] font-bold text-sm md:text-base leading-tight">NICKZTECH</h1>
                <p className="text-[#F5A623] text-[10px] md:text-xs font-medium">CONSTRUCTION</p>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${link.path === '/' ? 'bg-[#1F2F8F] text-white' : 'text-gray-700 hover:bg-[#1F2F8F]/10 hover:text-[#1F2F8F]'}`}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/contact" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-semibold text-sm rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5">
                Get a Quote
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Toggle menu">
                {mobileOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
              </button>
            </div>
          </div>
        </div>
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-4 pb-4 space-y-1 bg-white border-t">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={HERO_IMG} alt="Construction site" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1F2F8F]/90 via-[#1F2F8F]/70 to-transparent" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <div className="w-2 h-2 bg-[#F5A623] rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-medium">Cameroon's Premier Construction Company</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Building the Future,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] to-[#FF8C00]">One Foundation at a Time</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
                {BRAND.tagline}. From residential homes to commercial complexes and infrastructure projects, we deliver excellence across Cameroon and beyond.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="px-8 py-4 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-bold rounded-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                  Get a Free Quote <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/portfolio" className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                  View Our Projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white -mt-16 relative z-10 max-w-6xl mx-auto rounded-2xl shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map((stat, i) => (
              <div key={i} className="p-6 md:p-8 text-center">
                <stat.icon className="w-8 h-8 text-[#F5A623] mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-[#1F2F8F]">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-[#F4F4F4]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">What We Do</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2 mb-4">Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">We offer a comprehensive range of construction services to meet your every need.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link key={service.id} to={`/services/${service.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-full">
                  <div className="h-48 overflow-hidden">
                    <img src={service.image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#1F2F8F] mb-2 group-hover:text-[#F5A623] transition-colors">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.short_description}</p>
                    <div className="mt-4 flex items-center gap-2 text-[#F5A623] font-semibold text-sm">
                      Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/services" className="inline-flex items-center gap-2 px-8 py-3 bg-[#1F2F8F] text-white font-semibold rounded-lg hover:bg-[#2E3FBF] transition-colors">
                View All Services <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Our Work</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2 mb-4">Featured Projects</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Explore our portfolio of completed projects showcasing our commitment to excellence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Link key={project.id} to={`/portfolio/${project.slug}`} className="group relative rounded-xl overflow-hidden h-72 md:h-80 block">
                  <img src={project.images?.[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2F8F]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 bg-[#F5A623] text-white text-xs font-semibold rounded-full mb-3">{project.category}</span>
                    <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                    <p className="text-white/70 text-sm">{project.location}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/portfolio" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                View All Projects <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-br from-[#1F2F8F] to-[#0D1B4A] text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Building Excellence Since Day One</h2>
                <p className="text-blue-200 mb-8 leading-relaxed">At Nickztech Construction, we combine years of industry experience with innovative techniques to deliver projects that exceed expectations.</p>
                <div className="space-y-4">
                  {['Experienced team of certified professionals', 'Premium quality materials and modern equipment', 'On-time project delivery guarantee', 'Transparent communication throughout', 'Competitive pricing without compromising quality', 'Post-completion support and warranty'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#F5A623] flex-shrink-0" />
                      <span className="text-blue-100">{item}</span>
                    </div>
                  ))}
                </div>
                <Link to="/about" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#F5A623] text-white font-semibold rounded-lg hover:bg-[#FF8C00] transition-colors">
                  Learn More About Us <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative">
                <img src={TEAM_IMG} alt="Our team" className="rounded-xl shadow-2xl w-full" />
                <div className="absolute -bottom-6 -left-6 bg-[#F5A623] text-white p-6 rounded-xl shadow-xl">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {reviews.length > 0 && (
          <section className="py-20 bg-[#F4F4F4]">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-14">
                <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2 mb-4">What Our Clients Say</h2>
              </div>
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg relative">
                  <svg className="w-12 h-12 text-[#F5A623]/20 absolute top-6 left-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                  <div className="flex items-center gap-1 mb-4 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < (reviews[currentReview]?.rating || 5) ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed text-center mb-6 italic">"{reviews[currentReview]?.review_text}"</p>
                  <div className="text-center">
                    <p className="font-bold text-[#1F2F8F]">{reviews[currentReview]?.client_name}</p>
                    {reviews[currentReview]?.company && <p className="text-sm text-gray-500">{reviews[currentReview]?.company}</p>}
                    {reviews[currentReview]?.location && <p className="text-xs text-gray-400 mt-1">{reviews[currentReview]?.location}</p>}
                  </div>
                  <div className="flex justify-center gap-4 mt-8">
                    <button onClick={prevReview} className="w-10 h-10 rounded-full border-2 border-[#1F2F8F]/20 flex items-center justify-center hover:bg-[#1F2F8F] hover:text-white hover:border-[#1F2F8F] transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      {reviews.map((_, i) => (
                        <button key={i} onClick={() => setCurrentReview(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentReview ? 'bg-[#F5A623] w-6' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                    <button onClick={nextReview} className="w-10 h-10 rounded-full border-2 border-[#1F2F8F]/20 flex items-center justify-center hover:bg-[#1F2F8F] hover:text-white hover:border-[#1F2F8F] transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0D1B4A] text-white">
        <div className="bg-gradient-to-r from-[#1F2F8F] to-[#2E3FBF]">
          <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to Build Your Dream Project?</h3>
              <p className="text-blue-200">Let's discuss your construction needs and bring your vision to life.</p>
            </div>
            <div className="flex gap-4">
              <Link to="/contact" className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-semibold rounded-lg hover:shadow-lg transition-all whitespace-nowrap">Get a Free Quote</Link>
              <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all whitespace-nowrap">WhatsApp Us</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-4">
                <img src={BRAND.logo} alt={BRAND.name} className="h-12 w-auto rounded" />
                <div><h3 className="font-bold text-lg">NICKZTECH</h3><p className="text-[#F5A623] text-xs">CONSTRUCTION</p></div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Building excellence across Cameroon and beyond. With years of experience, we deliver world-class construction services.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#F5A623]">Quick Links</h4>
              <ul className="space-y-3">
                {navLinks.map(link => (
                  <li key={link.path}><Link to={link.path} className="text-gray-400 hover:text-[#F5A623] transition-colors flex items-center gap-2 text-sm"><ArrowRight className="w-3 h-3" />{link.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#F5A623]">Our Services</h4>
              <ul className="space-y-3">
                {['General Construction', 'Road Construction', 'Building Design', 'Renovation', 'Interior Finishing', 'Plumbing & Electrical', 'Landscaping', 'Consulting'].map(s => (
                  <li key={s}><Link to="/services" className="text-gray-400 hover:text-[#F5A623] transition-colors flex items-center gap-2 text-sm"><ArrowRight className="w-3 h-3" />{s}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#F5A623]">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" /><p className="text-gray-400 text-sm">{BRAND.address}</p></div>
                <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" /><div className="text-gray-400 text-sm"><a href={`tel:${BRAND.phone1}`} className="block hover:text-[#F5A623]">{BRAND.phone1}</a><a href={`tel:${BRAND.phone2}`} className="block hover:text-[#F5A623]">{BRAND.phone2}</a></div></div>
                <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" /><a href={`mailto:${BRAND.email}`} className="text-gray-400 text-sm hover:text-[#F5A623]">{BRAND.email}</a></div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
            <Link to="/admin" className="text-gray-500 hover:text-[#F5A623] text-sm">Admin</Link>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <a href={`https://wa.me/${BRAND.whatsapp}?text=Hello%20Nickztech%20Construction!`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      </div>
    </div>
  );
};

export default AppLayout;
