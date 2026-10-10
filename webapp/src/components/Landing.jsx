import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Database, Terminal, BarChart2 } from 'lucide-react';
import HeroPipeline from './HeroPipeline';
import { Github, Linkedin } from './SocialIcons';
import './Landing.css';

const TechPill = ({ icon: Icon, name }) => (
  <li className="tech-pill">
    <Icon size={14} className="pill-icon" aria-hidden="true" />
    <span>{name}</span>
  </li>
);

const leftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Landing = () => {
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);

  // Mouse-following light: desktop pointers only, and written straight to CSS so the hero doesn't re-render
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const handleMouseMove = (e) => {
      const container = containerRef.current;
      const spotlight = spotlightRef.current;
      if (!container || !spotlight) return;
      const { left, top, width, height } = container.getBoundingClientRect();
      spotlight.style.setProperty('--spot-x', `${((e.clientX - left) / width) * 100}%`);
      spotlight.style.setProperty('--spot-y', `${((e.clientY - top) / height) * 100}%`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section id="landing" className="landing-section" ref={containerRef}>
      {/* Animated Grid Background */}
      <div className="grid-bg" aria-hidden="true"></div>

      {/* Dynamic Spotlight */}
      <div className="spotlight" ref={spotlightRef} aria-hidden="true" />

      <motion.div
        className="container landing-split-container"
        style={{ y: y1, opacity }}
      >
        {/* Left Side: Content */}
        <motion.div
          className="landing-content"
          variants={leftVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="status-badge">
            <span className="pulse-dot" aria-hidden="true"></span>
            Available for new opportunities
          </motion.div>

          <motion.h1 variants={itemVariants} className="name-heading">
            Sayan Banerjee
          </motion.h1>

          <motion.p variants={itemVariants} className="designations">
            Data Engineer & Analytics Architect
          </motion.p>

          <motion.p variants={itemVariants} className="impact-statement">
            Architecting high-performance enterprise data platforms and semantic models to turn raw data into measurable business impact.
          </motion.p>

          <motion.ul variants={itemVariants} className="tech-pills-container" aria-label="Core technologies">
            <TechPill icon={Database} name="Microsoft Fabric" />
            <TechPill icon={Terminal} name="Databricks" />
            <TechPill icon={BarChart2} name="Power BI" />
          </motion.ul>

          <motion.div variants={itemVariants} className="cta-container">
            <a href="#about" className="btn btn--primary btn--lg hero-cta">
              Explore My Work
            </a>
            <div className="social-links-mini">
              <a href="https://github.com/sayan024" target="_blank" rel="noopener noreferrer" className="btn btn--ghost" aria-label="GitHub profile"><Github className="icon-sm" /></a>
              <a href="https://linkedin.com/in/sayanbanerjee24" target="_blank" rel="noopener noreferrer" className="btn btn--ghost" aria-label="LinkedIn profile"><Linkedin className="icon-sm" /></a>
              <a href="mailto:sayanbanerjee024@gmail.com" className="btn btn--ghost" aria-label="Email Sayan"><Mail className="icon-sm" aria-hidden="true" /></a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Visuals */}
        <div className="landing-visuals">
          <HeroPipeline />
        </div>
      </motion.div>
    </section>
  );
};

export default Landing;
