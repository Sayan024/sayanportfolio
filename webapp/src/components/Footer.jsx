import { Mail } from 'lucide-react';
import { Github, Linkedin } from './SocialIcons';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-content">
      <a href="#landing" className="footer-logo" aria-label="Sayan Banerjee, back to top">SB</a>
      <p className="tagline">Building scalable data foundations.</p>
      <div className="footer-socials">
        <a href="https://github.com/sayan024" target="_blank" rel="noopener noreferrer" className="btn btn--ghost" aria-label="GitHub profile"><Github size={20} /></a>
        <a href="https://linkedin.com/in/sayanbanerjee24" target="_blank" rel="noopener noreferrer" className="btn btn--ghost" aria-label="LinkedIn profile"><Linkedin size={20} /></a>
        <a href="mailto:sayanbanerjee024@gmail.com" className="btn btn--ghost" aria-label="Email Sayan"><Mail size={20} aria-hidden="true" /></a>
      </div>
    </div>
  </footer>
);

export default Footer;
