import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cloud, Layers, LineChart } from 'lucide-react';
import './Skills.css';

// --- Animated Visual Components ---

const DataEngineeringVisual = () => (
  <div className="cap-visual visual-de">
    <div className="de-node"><Database size={18}/></div>
    <div className="de-line"><div className="de-flow"></div></div>
    <div className="de-node"><Layers size={18}/></div>
    <div className="de-line"><div className="de-flow delay-1"></div></div>
    <div className="de-node"><Database size={18}/></div>
  </div>
);

const AnalyticsVisual = () => (
  <div className="cap-visual visual-bi">
    <div className="bi-dash">
      <div className="bi-card"><div className="bi-bar b1"></div></div>
      <div className="bi-card"><div className="bi-bar b2"></div></div>
      <div className="bi-card"><div className="bi-bar b3"></div></div>
      <div className="bi-card bi-wide">
        <LineChart size={22} className="bi-chart-icon" />
      </div>
    </div>
  </div>
);

const DataModelingVisual = () => (
  <div className="cap-visual visual-dm">
    <div className="dm-center"><Database size={26}/></div>
    <div className="dm-orbit">
       <div className="dm-sat sat-1"><Database size={12}/></div>
       <div className="dm-sat sat-2"><Database size={12}/></div>
       <div className="dm-sat sat-3"><Database size={12}/></div>
    </div>
  </div>
);

const CloudVisual = () => (
  <div className="cap-visual visual-cloud">
    <div className="cloud-center"><Cloud size={30}/></div>
    <div className="cloud-ring r1"></div>
    <div className="cloud-ring r2"></div>
    <div className="cloud-nodes">
       <div className="cn n1"></div>
       <div className="cn n2"></div>
       <div className="cn n3"></div>
    </div>
  </div>
);

const ProgrammingVisual = () => (
  <div className="cap-visual visual-code">
    <div className="code-window">
      <div className="code-header">
        <span></span><span></span><span></span>
      </div>
      <div className="code-body">
        <div className="c-line w-40"></div>
        <div className="c-line w-60 indent"></div>
        <div className="c-line w-80 indent highlight"></div>
        <div className="c-line w-30"></div>
      </div>
    </div>
  </div>
);

// --- Main Capabilities Component ---

const Skills = () => {
  const capabilities = [
    {
      id: "data-engineering",
      title: "DATA ENGINEERING",
      description: "Building scalable ingestion, transformation, and storage pipelines.",
      technologies: ["Microsoft Fabric", "Azure Data Factory", "PySpark", "Azure Databricks", "Lakehouse", "Warehouse", "Delta Tables", "Parquet", "Data Pipelines", "Notebook Engineering", "Pipeline Orchestration"],
      visual: <DataEngineeringVisual />
    },
    {
      id: "analytics",
      title: "ANALYTICS & BUSINESS INTELLIGENCE",
      description: "Creating business insights, dashboards, and reporting systems.",
      technologies: ["Power BI", "DAX", "Semantic Models", "Power Query", "Data Modeling", "Star Schema", "KPI Development", "Dashboard Design", "Row Level Security"],
      visual: <AnalyticsVisual />
    },
    {
      id: "modeling",
      title: "DATA MODELING & DATABASES",
      description: "Structuring enterprise datasets for analytics consumption.",
      technologies: ["SQL", "Stored Procedures", "Relationships", "Cardinality", "Aggregations", "Optimization", "Control Tables", "Database Design"],
      visual: <DataModelingVisual />
    },
    {
      id: "cloud",
      title: "CLOUD & PLATFORM SERVICES",
      description: "Working with enterprise cloud infrastructure and services.",
      technologies: ["Azure", "Resource Groups", "Fabric Capacity", "Gateway Configuration", "Linked Services", "Workspace Management", "Deployment"],
      visual: <CloudVisual />
    },
    {
      id: "programming",
      title: "PROGRAMMING & AUTOMATION",
      description: "Developing reusable transformations and automated workflows.",
      technologies: ["Python", "Notebook Development", "Dynamic Pipelines", "Automation Logic", "ETL Development"],
      visual: <ProgrammingVisual />
    }
  ];

  return (
    <section id="skills" className="section capabilities-section">
      <div className="container">
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title">Technical <span>Stack & Capabilities</span></h2>
          <p className="section-subtitle">Technologies used across analytics, reporting, and enterprise data engineering projects.</p>
        </motion.div>
        
        <div className="capabilities-grid">
          {capabilities.map((cap, index) => (
            <motion.div 
              key={cap.id} 
              className="cap-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="cap-visual-wrapper">
                {cap.visual}
              </div>
              <div className="cap-content">
                <h3 className="cap-title">{cap.title}</h3>
                <p className="cap-desc">{cap.description}</p>
                <div className="cap-tech-chips">
                  {cap.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-chip">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
