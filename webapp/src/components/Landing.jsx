import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Database, Terminal, BarChart2 } from 'lucide-react';
import HeroPipeline from './HeroPipeline';
import './Landing.css';

const Github = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const Linkedin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const TechPill = ({ icon: Icon, name, delay }) => (
  <motion.div 
    className="tech-pill glass-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    whileHover={{ y: -5, scale: 1.05, borderColor: "var(--accent-color)" }}
  >
    <Icon size={14} className="pill-icon" />
    <span>{name}</span>
  </motion.div>
);

const FloatingCard = ({ children, className, yOffset = 0, delay = 0 }) => {
  return (
    <motion.div
      className={`floating-widget glass-card ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      animate={{
        y: [0, yOffset, 0],
      }}
      transition={{
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.5
        }
      }}
    >
      {children}
    </motion.div>
  );
};

const Landing = () => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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

  return (
    <section id="landing" className="section landing-section" ref={containerRef}>
      {/* Animated Grid Background */}
      <div className="grid-bg"></div>
      
      {/* Dynamic Spotlight */}
      <div 
        className="spotlight" 
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(251, 191, 36, 0.12) 0%, transparent 40%)`
        }}
      />

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
          <motion.div variants={itemVariants} className="status-badge glass-card">
            <span className="pulse-dot"></span>
            Available for new opportunities
          </motion.div>

          <motion.h1 variants={itemVariants} className="name-heading">
            Sayan Banerjee
          </motion.h1>
          
          <motion.h2 variants={itemVariants} className="designations">
            Data Engineer & Analytics Architect
          </motion.h2>

          <motion.p variants={itemVariants} className="impact-statement">
            Architecting high-performance enterprise data platforms and semantic models to turn raw data into measurable business impact.
          </motion.p>

          <motion.div variants={itemVariants} className="tech-pills-container">
            <TechPill icon={Database} name="Microsoft Fabric" delay={0.4} />
            <TechPill icon={Terminal} name="Databricks" delay={0.5} />
            <TechPill icon={BarChart2} name="Power BI" delay={0.6} />
          </motion.div>

          <motion.div variants={itemVariants} className="cta-container">
            <a href="#about" className="cta-btn primary-btn">
              Explore My Work
              <div className="btn-glow"></div>
            </a>
            <div className="social-links-mini">
              <a href="https://github.com/sayan024" target="_blank" rel="noreferrer"><Github className="icon-sm" /></a>
              <a href="https://linkedin.com/in/sayanbanerjee24" target="_blank" rel="noreferrer"><Linkedin className="icon-sm" /></a>
              <a href="mailto:sayanbanerjee024@gmail.com"><Mail className="icon-sm" /></a>
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
