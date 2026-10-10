import { motion } from 'framer-motion';
import { GraduationCap, Award, MapPin, Calendar, Building } from 'lucide-react';
import './Education.css';

const Education = () => {
  const educations = [
    {
      id: 1,
      degree: "MCA (Master of Computer Applications)",
      institution: "Techno India University",
      duration: "2022 – 2024",
      scoreLabel: "CGPA",
      score: "8.87 / 10"
    },
    {
      id: 2,
      degree: "BSc Computer Science",
      institution: "THK Jain College",
      duration: "2019 – 2022",
      scoreLabel: "CGPA",
      score: "7.916 / 10"
    },
    {
      id: 3,
      degree: "Class XII",
      institution: "Indira Gandhi Memorial High School",
      duration: "2018 – 2019",
      board: "CBSE Board",
      location: "Kolkata, West Bengal",
      scoreLabel: "Score",
      score: "69%"
    },
    {
      id: 4,
      degree: "Class X",
      institution: "Bhavan’s Netaji Subhash Chandra Bose Vidyaniketan",
      duration: "2016 – 2017",
      board: "CBSE Board",
      location: "Haldia, West Bengal",
      scoreLabel: "CGPA",
      score: "9 / 10"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1, x: 0,
      transition: { duration: 0.5, type: "spring", stiffness: 100 }
    }
  };

  return (
    <section id="education" className="section education-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title">Academic <span>Journey</span></h2>
        </motion.div>

        <div className="edu-timeline-container">
          <motion.div
            className="edu-timeline-items"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Glowing Left Line */}
            <div className="edu-timeline-line" aria-hidden="true"></div>

            {educations.map((edu, index) => {
              const isEven = index % 2 !== 0; // matching work experience logic
              return (
              <motion.div key={edu.id} className={`edu-timeline-item ${isEven ? 'right' : 'left'}`} variants={itemVariants}>

                {/* Timeline Node */}
                <div className="edu-timeline-node" aria-hidden="true">
                  <GraduationCap size={18} aria-hidden="true" />
                </div>

                {/* Content Card */}
                <div className="edu-card glass-card">
                  <h3 className="edu-degree">{edu.degree}</h3>
                  <p className="edu-institution">{edu.institution}</p>

                  <div className="edu-meta-flex">
                    <span className="edu-duration">
                      <Calendar size={14} className="meta-icon" aria-hidden="true" /> {edu.duration}
                    </span>

                    {edu.board && (
                      <>
                        <span className="edu-meta-divider" aria-hidden="true">|</span>
                        <span className="edu-board">
                          <Building size={14} className="meta-icon" aria-hidden="true" /> {edu.board}
                        </span>
                      </>
                    )}

                    {edu.location && (
                      <>
                        <span className="edu-meta-divider" aria-hidden="true">|</span>
                        <span className="edu-location">
                          <MapPin size={14} className="meta-icon" aria-hidden="true" /> {edu.location}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="edu-score-container">
                    <span className="edu-score-badge">
                      <Award size={15} aria-hidden="true" /> {edu.scoreLabel}: {edu.score}
                    </span>
                  </div>
                </div>

              </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;
