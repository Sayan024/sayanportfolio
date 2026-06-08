import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import './Contact.css';

const Github = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const Linkedin = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:sayanbanerjee024@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent("Name: " + formData.name + "\n\n" + formData.message)}`;
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <motion.div 
          className="section-header center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title">Let's Build Something <span>Great</span></h2>
          <p className="section-subtitle">Have a data challenge? Let's talk about it.</p>
        </motion.div>
        
        <div className="contact-grid">
          <motion.div 
            className="contact-info-wrapper"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="contact-info-card glass-card">
              <div className="info-badge">
                <MessageSquare size={24} />
              </div>
              <h3>Contact Information</h3>
              <p className="contact-desc">I'm currently available for full-time opportunities or freelance consulting. Feel free to reach out.</p>
              
              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon"><Mail size={20} /></div>
                  <div className="info-text">
                    <span className="info-label">Email</span>
                    <a href="mailto:sayanbanerjee024@gmail.com" className="info-value">sayanbanerjee024@gmail.com</a>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon"><MapPin size={20} /></div>
                  <div className="info-text">
                    <span className="info-label">Location</span>
                    <span className="info-value">Kolkata, India</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon"><Linkedin size={20} /></div>
                  <div className="info-text">
                    <span className="info-label">LinkedIn</span>
                    <a href="https://linkedin.com/in/sayanbanerjee24" target="_blank" rel="noreferrer" className="info-value">in/sayanbanerjee24</a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="contact-form-wrapper"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="contact-form-card glass-card">
              <h3>Send a Message</h3>
              <form onSubmit={handleSubmit} className="premium-form">
                <div className="form-row">
                  <div className={`form-group ${focusedField === 'name' || formData.name ? 'active' : ''}`}>
                    <label>Full Name</label>
                    <input 
                      type="text" name="name" value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <div className="focus-border"></div>
                  </div>
                  
                  <div className={`form-group ${focusedField === 'email' || formData.email ? 'active' : ''}`}>
                    <label>Email Address</label>
                    <input 
                      type="email" name="email" value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <div className="focus-border"></div>
                  </div>
                </div>
                
                <div className={`form-group ${focusedField === 'subject' || formData.subject ? 'active' : ''}`}>
                  <label>Subject</label>
                  <input 
                    type="text" name="subject" value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <div className="focus-border"></div>
                </div>
                
                <div className={`form-group textarea-group ${focusedField === 'message' || formData.message ? 'active' : ''}`}>
                  <label>Message</label>
                  <textarea 
                    name="message" value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows="4" required
                  ></textarea>
                  <div className="focus-border"></div>
                </div>

                <button type="submit" className="submit-btn">
                  <span>Send Message</span>
                  <Send size={18} />
                  <div className="btn-sweep"></div>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="footer glass-card">
        <div className="container footer-content">
          <div className="footer-logo">SB</div>
          <p className="tagline">Building scalable data foundations.</p>
          <div className="footer-socials">
            <a href="https://github.com/sayan024" target="_blank" rel="noreferrer"><Github size={20} /></a>
            <a href="https://linkedin.com/in/sayanbanerjee24" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
            <a href="mailto:sayanbanerjee024@gmail.com"><Mail size={20} /></a>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
