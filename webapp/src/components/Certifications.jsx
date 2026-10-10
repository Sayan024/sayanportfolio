import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Eye } from 'lucide-react';
import './Certifications.css';

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

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 100 } }
};

// Every certificate sits in the same frame, shown whole; a placeholder covers a missing image
const CertificateImage = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className="cert-media">
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          className="cert-img"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="cert-media-fallback">
          <Award size={32} aria-hidden="true" />
          <span>Certificate image unavailable</span>
        </div>
      )}
    </div>
  );
};

const CertificateCard = ({ cert }) => {
  const imageUrl = cert.image ? `/certificates/${cert.image}` : null;

  return (
    <motion.article className="cert-card glass-card" variants={cardVariants}>
      <CertificateImage src={imageUrl} alt={`${cert.title} certificate`} />

      <div className="cert-content">
        <div className="cert-meta">
          <span className={`tag provider-${cert.provider.toLowerCase().replace(/\s+/g, '-')}`}>
            {cert.provider}
          </span>
          {cert.code && (
            <span className="tag">{cert.code}</span>
          )}
        </div>

        <h3 className="cert-title">{cert.title}</h3>

        <div className="cert-actions">
          {cert.url ? (
            <a
              className="btn btn--accent"
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify Credential <ExternalLink size={14} aria-hidden="true" />
              <span className="sr-only">for {cert.title} (opens in a new tab)</span>
            </a>
          ) : (
            <span className="btn btn--accent" aria-disabled="true">Verification unavailable</span>
          )}
          {imageUrl && (
            <a
              className="btn btn--secondary"
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Certificate <Eye size={14} aria-hidden="true" />
              <span className="sr-only">for {cert.title} (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const Certifications = () => {
  return (
    <section id="certifications" className="section cert-section">
      <div className="container">
        <motion.div
          className="section-header"
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
