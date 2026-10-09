import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Eye } from 'lucide-react';
import './Certifications.css';

const CertificateCard = ({ cert }) => {
  const handleCardClick = () => {
    const targetUrl = cert.url || (cert.image ? `/certificates/${cert.image}` : '#');
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleActionClick = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="cert-card glass-card"
      onClick={handleCardClick}
      variants={{
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 100 } }
      }}
    >
      <div className="cert-media">
        {cert.image && (
          <img src={`/certificates/${cert.image}`} alt={cert.title} className="cert-img" />
        )}
        
        {cert.badge && cert.image && (
          <img src={`/certificates/${cert.badge}`} alt="Badge" className="cert-badge-overlay" />
        )}
        
        {!cert.image && cert.badge && (
          <div className="cert-badge-centered">
            <div className="badge-glow"></div>
            <img src={`/certificates/${cert.badge}`} alt="Badge" className="cert-badge-solo" />
          </div>
        )}
      </div>

      <div className="cert-content">
        <div className="cert-meta">
          <span className={`provider-chip provider-${cert.provider.toLowerCase().replace(/\s+/g, '-')}`}>
            {cert.provider}
          </span>
          {cert.code && (
            <span className="code-chip">{cert.code}</span>
          )}
        </div>
        
        <h3 className="cert-title">{cert.title}</h3>
        
        <div className="cert-actions">
          {cert.url && (
            <button 
              className="btn-primary" 
              onClick={(e) => handleActionClick(e, cert.url)}
            >
              Verify Credential <ExternalLink size={14} />
            </button>
          )}
          {cert.image && (
            <button 
              className="btn-secondary" 
              onClick={(e) => handleActionClick(e, `/certificates/${cert.image}`)}
            >
              View Certificate <Eye size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Certifications = () => {
  const certs = [
    {
      id: 1,
      title: "Databricks Certified Data Engineer Associate",
      provider: "Databricks",
      code: "Associate",
      image: "Databricks Certified Data Engineer Associate.png",
      url: "https://credentials.databricks.com/fd8b180d-776d-4bf4-a377-cd97b8e59479"
    },
    {
      id: 2,
      title: "Databricks Certified Generative AI Engineer Associate",
      provider: "Databricks",
      code: "Associate",
      image: "Databricks Certified Generative AI Engineer Associate.png",
      url: "https://credentials.databricks.com/bc45681e-226c-491e-858a-1cd3e6d4406a"
    },
    {
      id: 3,
      title: "Fabric Data Engineer Associate",
      provider: "Microsoft",
      code: "DP-700",
      image: "Microsoft Certified Fabric Data Engineer Associate.png",
      url: "https://learn.microsoft.com/api/credentials/share/en-in/SayanBanerjee-3854/2BD18E16EC520850?sharingId=4A16B92B473CC26C"
    },
    {
      id: 4,
      title: "Fabric Analytics Engineer Associate",
      provider: "Microsoft",
      code: "DP-600",
      image: "Microsoft Certified Fabric Analytics Engineer Associate.png",
      url: "https://learn.microsoft.com/api/credentials/share/en-in/SayanBanerjee-3854/73189B7510B02DC2?sharingId=4A16B92B473CC26C"
    },
    {
      id: 5,
      title: "Power BI Data Analyst Associate",
      provider: "Microsoft",
      code: "PL-300",
      image: "Microsoft Certified Power BI Data Analyst Associate.png",
      url: "https://learn.microsoft.com/api/credentials/share/en-us/SayanBanerjee-3854/78F1D0BA46D6F08D?sharingId=4A16B92B473CC26C"
    },
    {
      id: 6,
      title: "SQL AI Developer Associate",
      provider: "Microsoft",
      code: "Associate",
      image: "Microsoft Certified SQL AI Developer Associate.png",
      url: "https://learn.microsoft.com/api/credentials/share/en-in/SayanBanerjee-3854/6583783B2D1E1214?sharingId=4A16B92B473CC26C"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section id="certifications" className="section cert-section">
      <div className="container">
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title">Credentials & <span>Certifications</span></h2>
          <p className="section-subtitle">Verified industry certifications across Data Engineering, Analytics, Cloud, and Business Intelligence.</p>
        </motion.div>
        
        <motion.div 
          className="cert-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {certs.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
