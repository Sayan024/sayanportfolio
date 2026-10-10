import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileCode2, FileSpreadsheet, Server, Zap, HardDrive, Layers, LayoutDashboard, Activity } from 'lucide-react';
import './HeroPipeline.css';

const stages = [
  {
    title: 'Data Sources',
    nodes: [
      { icon: Database, label: 'SQL DB' },
      { icon: FileCode2, label: 'APIs' },
      { icon: FileSpreadsheet, label: 'CSV/Excel' }
    ]
  },
  {
    title: 'Orchestration & ETL',
    nodes: [
      { icon: Activity, label: 'Data Factory', featured: true },
      { icon: Zap, label: 'PySpark' }
    ]
  },
  {
    title: 'Fabric Storage Layer',
    nodes: [
      { icon: HardDrive, label: 'Lakehouse' },
      { icon: Server, label: 'Warehouse' }
    ]
  },
  {
    title: 'Business Insights',
    nodes: [
      { icon: Layers, label: 'Semantic Model' },
      { icon: LayoutDashboard, label: 'Power BI', featured: true }
    ]
  }
];

// Outcomes taken from the résumé's experience section
const metrics = [
  { value: '40%', title: 'Less manual processing' },
  { value: '45%', title: 'Lower pipeline latency' },
  { value: '3x', title: 'Faster executive queries' },
  { value: '99.9%', title: 'Data reliability' }
];

const PipelineNode = ({ icon: Icon, label, featured }) => (
  <div className={`pipeline-node ${featured ? 'active-node' : ''}`}>
    <Icon size={18} className="node-icon" aria-hidden="true" />
    <span className="node-label">{label}</span>
  </div>
);

const HeroPipeline = () => {
  return (
    <motion.div
      className="hero-pipeline-wrapper"
      role="img"
      aria-label="Data pipeline: SQL databases, APIs and CSV or Excel files flow through Azure Data Factory and PySpark into a Fabric Lakehouse and Warehouse, then into semantic models and Power BI."
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      {/* Background ambient glow */}
      <div className="ambient-glow" aria-hidden="true"></div>

      {/* Stages stack in normal flow, so nodes, connectors and metrics can never overlap */}
      <div className="pipeline-stages" aria-hidden="true">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.title}>
            {index > 0 && (
              <div className="pipeline-connector">
                <span className="pipeline-particle" style={{ animationDelay: `${index * 0.4}s` }}></span>
              </div>
            )}
            <div className="stage-group">
              <div className="stage-title">{stage.title}</div>
              <div className="nodes-row">
                {stage.nodes.map((node) => (
                  <PipelineNode key={node.label} {...node} />
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Metrics sit in their own row below the diagram */}
      <dl className="pipeline-metrics" aria-hidden="true">
        {metrics.map((metric) => (
          <div key={metric.title} className="pipeline-metric">
            <dd className="metric-value">{metric.value}</dd>
            <dt className="metric-title">{metric.title}</dt>
          </div>
        ))}
      </dl>
    </motion.div>
  );
};

export default HeroPipeline;
