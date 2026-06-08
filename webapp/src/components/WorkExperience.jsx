import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Building2, Calendar, CheckCircle2, ChevronRight, BarChart3, Database, Cloud } from 'lucide-react';
import './WorkExperience.css';

const WorkExperience = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const currentRole = {
    role: "Associate Technical Consultant – AI & Data Analytics",
    company: "Embee Software Pvt Ltd",
    type: "Full-Time",
    location: "India",
    duration: "Dec 2024 – Present",
    responsibilities: [
      "Developed enterprise reporting and analytics solutions using Microsoft Fabric, Power BI, Azure Data Factory, SQL, and PySpark.",
      "Designed and built scalable ETL pipelines for ingesting, transforming, and loading data from multiple source systems into Fabric Lakehouse and Warehouse environments.",
      "Created interactive Power BI dashboards and semantic models for business stakeholders, focusing on data visualization, KPI tracking, and decision support.",
      "Performed data transformation and modeling using Power Query, DAX, and star schema principles to create optimized analytical models.",
      "Implemented Medallion Architecture (Raw, Bronze, Silver, Gold) to build structured and scalable data platforms.",
      "Worked closely with client teams to understand business requirements, translate them into technical solutions, and deliver analytics-driven outcomes."
    ],
    achievements: [
      "Successfully worked on client-facing projects within financial and portfolio management domains, gaining exposure to enterprise analytics environments.",
      "Built automated data ingestion and transformation pipelines that reduced manual intervention and improved reporting efficiency.",
      "Developed reusable data models, notebooks, and pipeline frameworks to improve scalability and maintainability.",
      "Contributed to building business-ready datasets and dashboards enabling faster decision-making through centralized reporting.",
      "Expanded expertise beyond reporting into cloud infrastructure, data engineering, and enterprise analytics architecture."
    ]
  };

  const phases = [
    {
      id: "01",
      title: "Foundation & Analytics Training",
      subtitle: "Learning Business Intelligence Fundamentals",
      colorClass: "accent-blue",
      icon: <BarChart3 size={24} />,
      workedOn: [
        "Learned Microsoft Power BI fundamentals and reporting concepts",
        "Created HR analytics dashboards using employee datasets",
        "Built DAX measures including employee count, attrition analysis, averages, and KPIs",
        "Transformed raw datasets into business insights"
      ],
      outcomes: [
        "Built strong reporting and data analytics foundation",
        "Developed understanding of business metrics and HR analytics"
      ]
    },
    {
      id: "02",
      title: "Power BI Development & Reporting",
      subtitle: "Building Business Intelligence Solutions",
      colorClass: "accent-amber",
      icon: <Database size={24} />,
      workedOn: [
        "Built interactive Power BI dashboards for business stakeholders",
        "Developed DAX calculations using CALCULATE, FILTER, DISTINCTCOUNT, Time Intelligence functions",
        "Designed star schema models and optimized relationships",
        "Created drill-through pages, bookmarks, RLS, gateways, and deployment workflows",
        "Performed Power Query transformations including merge, append, pivot, unpivot, and grouping"
      ],
      outcomes: [
        "Delivered management-level dashboards",
        "Improved report performance using optimized modeling techniques",
        "Built reusable semantic models for reporting"
      ]
    },
    {
      id: "03",
      title: "Client Delivery & Data Engineering",
      subtitle: "From Reporting to Scalable Data Platforms",
      colorClass: "accent-green",
      icon: <Cloud size={24} />,
      workedOn: [
        "Worked directly with financial clients during client deployment projects",
        "Created Azure Resource Groups and configured Microsoft Fabric capacities",
        "Built Azure Data Factory pipelines for ingestion and orchestration",
        "Developed Lakehouse and Warehouse architectures using Delta and Parquet tables",
        "Implemented Medallion Architecture (Raw → Bronze → Silver → Gold)",
        "Built notebooks, dynamic pipelines, stored procedures, and transformation workflows"
      ],
      outcomes: [
        "Expanded from BI development into Data Engineering",
        "Delivered scalable cloud-based analytics solutions",
        "Gained enterprise client communication and delivery experience"
      ]
    }
  ];

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title">Career Growth <span>Journey</span></h2>
          <p className="section-subtitle">My professional progression and learning phases at Embee Software.</p>
        </motion.div>
        
        {/* Main Company Card */}
        <motion.div 
          className="main-role-card glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="exp-header">
            <div className="exp-company-info">
              <div className="company-logo-ph accent-glow">
                <Building2 size={28} />
              </div>
              <div>
                <h3 className="exp-role">{currentRole.role}</h3>
                <h4 className="exp-company">{currentRole.company}</h4>
              </div>
            </div>
            <div className="exp-meta">
              <span className="badge type-badge">{currentRole.type}</span>
              <span className="date-badge"><Calendar size={14}/> {currentRole.duration}</span>
            </div>
          </div>

          <div className="exp-body main-card-body">
            <div className="resp-col">
              <h5 className="sub-heading">Key Responsibilities</h5>
              <ul className="custom-list">
                {currentRole.responsibilities.map((resp, idx) => (
                  <li key={idx}>
                    <ChevronRight className="list-icon" size={16} />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="achieve-col">
              <h5 className="sub-heading highlight-heading">Impact & Achievements</h5>
              <ul className="custom-list highlight-list">
                {currentRole.achievements.map((ach, idx) => (
                  <li key={idx}>
                    <CheckCircle2 className="list-icon-highlight" size={18} />
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Growth Phases Timeline */}
        <div className="growth-timeline-wrapper" ref={containerRef}>
          <div className="timeline-track">
            <motion.div className="timeline-progress" style={{ height: lineHeight }} />
          </div>

          <div className="phases-container">
            {phases.map((phase, index) => {
              const isEven = index % 2 !== 0;
              return (
                <div key={phase.id} className={`phase-row ${isEven ? 'row-even' : 'row-odd'}`}>
                  
                  {/* Left Side */}
                  <div className="phase-half phase-left">
                    {!isEven && (
                      <PhaseCard phase={phase} direction={-50} />
                    )}
                  </div>

                  {/* Center Node */}
                  <div className="phase-node-container">
                    <motion.div 
                      className={`phase-node ${phase.colorClass}`}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    >
                      {phase.icon}
                    </motion.div>
                  </div>

                  {/* Right Side */}
                  <div className="phase-half phase-right">
                    {isEven && (
                      <PhaseCard phase={phase} direction={50} />
                    )}
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const PhaseCard = ({ phase, direction }) => {
  return (
    <motion.div 
      className={`phase-card glass-card ${phase.colorClass}-border`}
      initial={{ opacity: 0, x: direction }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="phase-card-header">
        <span className={`phase-id ${phase.colorClass}-text`}>PHASE {phase.id}</span>
        <h4 className="phase-title">{phase.title}</h4>
        <p className="phase-subtitle">{phase.subtitle}</p>
      </div>

      <div className="phase-card-body">
        <div className="phase-section">
          <h5 className="phase-subheading">What I Worked On:</h5>
          <ul className="phase-list default-list">
            {phase.workedOn.map((item, idx) => (
              <li key={idx}>
                <span className={`bullet ${phase.colorClass}-bg`}></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="phase-section outcomes-section">
          <h5 className="phase-subheading">Key Outcomes:</h5>
          <ul className="phase-list outcome-list">
            {phase.outcomes.map((item, idx) => (
              <li key={idx}>
                <CheckCircle2 size={16} className={`${phase.colorClass}-text flex-shrink-0 mt-1`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkExperience;
