import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Code, Star, Award } from 'lucide-react';
import './AboutMe.css';

const AboutMe = () => {
  const imageVariants = {
    hidden: { x: -40, opacity: 0, boxShadow: "0 0 0 rgba(245, 158, 11, 0)" },
    visible: { 
      x: 0, 
      opacity: 1, 
      boxShadow: "0 0 32px rgba(245, 158, 11, 0.18)",
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (custom) => ({
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        delay: custom * 0.2, 
        type: "spring", 
        stiffness: 100 
      }
    })
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  };

  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const workLinks = [
    { name: 'Work Experience', href: '#experience', icon: Briefcase },
    { name: 'Education', href: '#education', icon: GraduationCap },
    { name: 'Skills', href: '#skills', icon: Code },
    { name: 'Certifications', href: '#certifications', icon: Award }
  ];

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">About <span>Me</span></h2>
        </div>
        
        <div className="about-content">
          <div className="about-left">
            <motion.div 
              className="profile-image-container"
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <img src="/profile.png" alt="Portrait of Sayan Banerjee" className="profile-img" width="340" height="340" loading="lazy" decoding="async" />
            </motion.div>

            <motion.div 
              className="view-work-container"
              variants={buttonContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="view-work-title">View My Work</h3>
              <div className="view-work-buttons">
                {workLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.a 
                      key={link.name}
                      href={link.href} 
                      className="work-btn"
                      variants={buttonVariants}
                    >
                      <Icon className="work-icon" aria-hidden="true" />
                      <span>{link.name}</span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <div className="about-right">
            <motion.p 
              className="professional-summary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              I currently work as a Technical Consultant focused on Data Engineering, Analytics, and AI-driven reporting solutions. My expertise spans Microsoft Fabric, Azure Databricks, Power BI, SQL, PySpark, and enterprise cloud ecosystems. I design scalable ETL pipelines, semantic models, reporting systems, and analytics architectures that support business-critical decisions. I enjoy solving complex data problems and turning disconnected datasets into meaningful business stories.
            </motion.p>

            <div className="mission-vision-container">
              <motion.div 
                className="glass-card mv-card"
                variants={cardVariants}
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="icon-box"><Star aria-hidden="true" /></div>
                <h3>Mission</h3>
                <p>To build scalable analytics systems that simplify decision-making and transform data into measurable business value.</p>
              </motion.div>

              <motion.div 
                className="glass-card mv-card"
                variants={cardVariants}
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="icon-box"><Award aria-hidden="true" /></div>
                <h3>Vision</h3>
                <p>To become a leading Data Engineering and Analytics professional creating intelligent enterprise solutions at scale.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
