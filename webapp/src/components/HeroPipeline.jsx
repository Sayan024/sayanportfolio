import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileCode2, FileSpreadsheet, Server, Zap, HardDrive, Box, Layers, LayoutDashboard, Activity } from 'lucide-react';
import './HeroPipeline.css';

const PipelineNode = ({ icon: Icon, label, delay = 0, active = false, className = "" }) => (
  <motion.div 
    className={`pipeline-node glass-card ${active ? 'active-node' : ''} ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <div className="node-icon-wrapper">
      <Icon size={18} className="node-icon" />
      {active && <span className="node-pulse"></span>}
    </div>
    <span className="node-label">{label}</span>
    <div className="node-glow"></div>
  </motion.div>
);

const MetricCard = ({ title, value, top, left, right, bottom, delay }) => (
  <motion.div 
    className="metric-floating-card glass-card"
    style={{ top, left, right, bottom }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="metric-value">{value}</div>
    <div className="metric-title">{title}</div>
  </motion.div>
);

const ParticleFlow = ({ d, delay = 0, duration = 3 }) => (
  <>
    <motion.path
      d={d}
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
    <motion.path
      d={d}
      fill="none"
      stroke="var(--accent-color)"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0, 1, 0] }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay
      }}
    />
    <motion.circle
      r="4"
      fill="var(--accent-color)"
      style={{ filter: "drop-shadow(0 0 5px var(--accent-color))" }}
      initial={{ offsetDistance: "0%", opacity: 0 }}
      animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay
      }}
    />
  </>
);

const HeroPipeline = () => {
  return (
    <div className="hero-pipeline-wrapper">
      {/* Background ambient glows */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      {/* Floating Metrics */}
      <MetricCard title="Faster Pipelines" value="+40%" top="5%" left="-5%" delay={0.2} />
      <MetricCard title="Rows Processed" value="15M+" top="45%" right="-10%" delay={0.4} />
      <MetricCard title="Analytics" value="Enterprise" bottom="20%" left="-10%" delay={0.6} />
      <MetricCard title="Reporting" value="Real-Time" bottom="-5%" right="5%" delay={0.8} />

      {/* SVG Connectors (Desktop view absolute positioning) */}
      <svg className="pipeline-connectors hidden-mobile" viewBox="0 0 400 500" preserveAspectRatio="none">
        <ParticleFlow d="M 80,50 L 200,120" delay={0} />
        <ParticleFlow d="M 200,50 L 200,120" delay={0.5} />
        <ParticleFlow d="M 320,50 L 200,120" delay={1} />
        
        <ParticleFlow d="M 200,180 L 200,250" delay={1.5} />
        
        <ParticleFlow d="M 200,310 L 140,380" delay={2} />
        <ParticleFlow d="M 200,310 L 260,380" delay={2.2} />
        
        <ParticleFlow d="M 140,440 L 200,480" delay={2.5} />
        <ParticleFlow d="M 260,440 L 200,480" delay={2.7} />
      </svg>

      <div className="pipeline-stages">
        {/* Stage 1: Sources */}
        <div className="stage-group sources-stage">
          <div className="stage-title">Data Sources</div>
          <div className="nodes-row">
            <PipelineNode icon={Database} label="SQL DB" delay={0.1} />
            <PipelineNode icon={FileCode2} label="APIs" delay={0.2} />
            <PipelineNode icon={FileSpreadsheet} label="CSV/Excel" delay={0.3} />
          </div>
        </div>

        {/* Vertical connector for mobile */}
        <div className="mobile-connector"><motion.div className="mobile-particle" animate={{ y: [0, 30] }} transition={{ repeat: Infinity, duration: 1 }} /></div>

        {/* Stage 2: Ingestion & ETL */}
        <div className="stage-group etl-stage">
          <div className="stage-title">Orchestration & ETL</div>
          <div className="nodes-row">
            <PipelineNode icon={Activity} label="Data Factory" delay={0.4} active={true} className="featured-node" />
            <PipelineNode icon={Zap} label="PySpark" delay={0.5} />
          </div>
        </div>

        <div className="mobile-connector"><motion.div className="mobile-particle" animate={{ y: [0, 30] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} /></div>

        {/* Stage 3: Storage */}
        <div className="stage-group storage-stage">
          <div className="stage-title">Fabric Storage Layer</div>
          <div className="nodes-row">
            <PipelineNode icon={HardDrive} label="Lakehouse" delay={0.6} />
            <PipelineNode icon={Server} label="Warehouse" delay={0.7} />
          </div>
        </div>

        <div className="mobile-connector"><motion.div className="mobile-particle" animate={{ y: [0, 30] }} transition={{ repeat: Infinity, duration: 1, delay: 0.6 }} /></div>

        {/* Stage 4: Analytics */}
        <div className="stage-group analytics-stage">
          <div className="stage-title">Business Insights</div>
          <div className="nodes-row">
            <PipelineNode icon={Layers} label="Semantic Model" delay={0.8} />
            <PipelineNode icon={LayoutDashboard} label="Power BI" delay={0.9} active={true} className="featured-node" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPipeline;
