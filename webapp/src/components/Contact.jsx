import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { Github, Linkedin } from './SocialIcons';
import './Contact.css';

const CONTACT_EMAIL = 'sayanbanerjee024@gmail.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fields = [
  { name: 'name', label: 'Full Name', type: 'text', autoComplete: 'name', half: true },
  { name: 'email', label: 'Email Address', type: 'email', autoComplete: 'email', half: true },
  { name: 'subject', label: 'Subject', type: 'text', autoComplete: 'off' },
  { name: 'message', label: 'Message', multiline: true }
];

const validate = (data) => {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Please enter your name.';
  if (!data.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(data.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!data.subject.trim()) errors.subject = 'Please add a subject.';
  if (!data.message.trim()) errors.message = 'Please write a message.';
  return errors;
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  // There is no mail server behind this form: it hands the message to the visitor's own email app
  const handleSubmit = (e) => {
    e.preventDefault();
    const foundErrors = validate(formData);
    setErrors(foundErrors);

    const firstInvalid = Object.keys(foundErrors)[0];
    if (firstInvalid) {
      setStatus('Please fix the highlighted fields.');
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    const body = `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\n${formData.message.trim()}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(formData.subject.trim())}&body=${encodeURIComponent(body)}`;
    setStatus(`Your email app should now open with this message ready to send. If it doesn't, email ${CONTACT_EMAIL} directly.`);
  };

  const renderField = (field) => {
    const id = `contact-${field.name}`;
    const error = errors[field.name];
    const isActive = focusedField === field.name || formData[field.name];
    const sharedProps = {
      id,
      name: field.name,
      value: formData[field.name],
      onChange: handleChange,
      onFocus: () => setFocusedField(field.name),
      onBlur: () => setFocusedField(null),
      required: true,
      'aria-invalid': error ? 'true' : undefined,
      'aria-describedby': error ? `${id}-error` : undefined
    };

    return (
      <div key={field.name} className={`form-group ${isActive ? 'active' : ''} ${error ? 'has-error' : ''}`}>
        <label htmlFor={id}>{field.label}</label>
        {field.multiline ? (
          <textarea rows="4" {...sharedProps}></textarea>
        ) : (
          <input type={field.type} autoComplete={field.autoComplete} {...sharedProps} />
        )}
        {error && <p className="form-error" id={`${id}-error`}>{error}</p>}
      </div>
    );
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title">Let's Build Something <span>Great</span></h2>
          <p className="section-subtitle">Have a data challenge? Let's talk about it.</p>
        </motion.div>

        <div className="contact-grid">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="contact-info-card glass-card">
              <div className="icon-box">
                <MessageSquare size={24} aria-hidden="true" />
              </div>
              <h3>Contact Information</h3>
              <p className="contact-desc">I'm currently available for full-time opportunities or freelance consulting. Feel free to reach out.</p>

              <ul className="info-list">
                <li className="info-item">
                  <div className="info-icon"><Mail size={20} aria-hidden="true" /></div>
                  <div className="info-text">
                    <span className="info-label">Email</span>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="info-value">{CONTACT_EMAIL}</a>
                  </div>
                </li>

                <li className="info-item">
                  <div className="info-icon"><MapPin size={20} aria-hidden="true" /></div>
                  <div className="info-text">
                    <span className="info-label">Location</span>
                    <span className="info-value">Kolkata, India</span>
                  </div>
                </li>

                <li className="info-item">
                  <div className="info-icon"><Linkedin size={20} /></div>
                  <div className="info-text">
                    <span className="info-label">LinkedIn</span>
                    <a href="https://linkedin.com/in/sayanbanerjee24" target="_blank" rel="noopener noreferrer" className="info-value">in/sayanbanerjee24</a>
                  </div>
                </li>

                <li className="info-item">
                  <div className="info-icon"><Github size={20} /></div>
                  <div className="info-text">
                    <span className="info-label">GitHub</span>
                    <a href="https://github.com/sayan024" target="_blank" rel="noopener noreferrer" className="info-value">github.com/sayan024</a>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="contact-form-card glass-card">
              <h3>Send a Message</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  {fields.filter((field) => field.half).map(renderField)}
                </div>
                {fields.filter((field) => !field.half).map(renderField)}

                <button type="submit" className="btn btn--primary btn--lg btn--block">
                  <span>Send Message</span>
                  <Send size={18} aria-hidden="true" />
                </button>
                <p className="form-note">This opens your email app with the message filled in.</p>
                <p className="form-status" role="status" aria-live="polite">{status}</p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
