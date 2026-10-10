import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

const menuVariants = {
  closed: { opacity: 0, y: -16, transition: { duration: 0.2, ease: "easeInOut" } },
  open: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight the link of the section currently crossing the middle of the viewport
  useEffect(() => {
    const sections = ['#landing', ...navLinks.map((link) => link.href)]
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // No link is highlighted while the hero is on screen
          setActiveSection(entry.target.id === 'landing' ? '' : `#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // While the mobile menu is open: Escape closes it and the page behind doesn't scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const closeOnDesktop = window.matchMedia('(min-width: 901px)');
    const handleResize = (e) => {
      if (e.matches) setMobileMenuOpen(false);
    };

    document.body.classList.add('no-scroll');
    window.addEventListener('keydown', handleKeyDown);
    closeOnDesktop.addEventListener('change', handleResize);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', handleKeyDown);
      closeOnDesktop.removeEventListener('change', handleResize);
    };
  }, [mobileMenuOpen]);

  return (
    <header>
      <nav className={`navbar ${scrolled || mobileMenuOpen ? 'scrolled' : ''}`} aria-label="Main">
        <div className="navbar-container container">
          <a href="#landing" className="logo" aria-label="Sayan Banerjee, back to top">
            SB
          </a>

          {/* Desktop Nav */}
          <ul className="nav-links desktop-nav">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`nav-link ${activeSection === link.href ? 'active' : ''}`}
                  aria-current={activeSection === link.href ? 'true' : undefined}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-drawer"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <ul className="mobile-nav-links">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`mobile-nav-link ${activeSection === link.href ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
