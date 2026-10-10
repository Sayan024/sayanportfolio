import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import './Projects.css';

const MAIN_REPO_URL = 'https://github.com/Sayan024/powerbiprojects';

const GithubIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.76.11 3.05.73.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.51 11.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
  </svg>
);

const projects = [
  {
    id: 1,
    title: 'Dine360 Restaurant Sales Analytics',
    tag: 'Power BI',
    image: 'dine360.png',
    url: 'https://github.com/Sayan024/powerbiprojects/tree/Dine360RestuarantAnalysis',
    problem: 'Multi-unit restaurant operators lacked visibility into dining ticket quality and store sales variations.',
    solution: 'Modeled a Star Schema with dynamic DAX time-intelligence (MTD, YTD, YoY) and Category Share % metrics.',
    outcome: 'Helps management optimize menu pricing, reduce food waste, and reallocate store staffing resources.'
  },
  {
    id: 2,
    title: 'Shoperkart Retail Target Performance',
    tag: 'Power BI',
    image: 'shoperkart.png',
    url: 'https://github.com/Sayan024/powerbiprojects/tree/Shoperkart',
    problem: 'Regional sales leaders struggled to evaluate daily transactions against monthly target quotas while unmonitored discounting eroded margins.',
    solution: 'Architected a Galaxy Schema with target-variance metrics and RANKX algorithms.',
    outcome: 'Flags quota deficits early and helps protect gross profit margins.'
  },
  {
    id: 3,
    title: 'Volt Electronic Sales & Logistics Analytics',
    tag: 'Power BI',
    image: 'volt.png',
    url: 'https://github.com/Sayan024/powerbiprojects/tree/VoltSalesDashboard',
    problem: 'Unmonitored product refund surges and shipping delays caused customer churn.',
    solution: 'Built a multi-page Power BI dashboard tracking cohort retention (New vs. Returning) and return logistics metrics.',
    outcome: 'Enables operations teams to isolate defective product batches and courier bottlenecks.'
  }
];

const projectFacts = [
  { key: 'problem', label: 'Problem' },
  { key: 'solution', label: 'Solution' },
  { key: 'outcome', label: 'Value' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, type: 'spring', stiffness: 100 } }
};

const Projects = () => {
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="section-title">Personal Dashboard <span>Projects</span></h2>
          <p className="section-subtitle">
            Power BI dashboards solving real business problems, each built and versioned on its own branch.
          </p>
          <a
            href={MAIN_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--secondary repo-link-btn"
          >
            <GithubIcon size={16} /> Main Repository <ExternalLink size={14} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </motion.div>

        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {projects.map((project) => (
            <motion.article key={project.id} className="project-card glass-card" variants={cardVariants}>
              <div className="project-media">
                <img
                  src={`/projects/${project.image}`}
                  alt={`${project.title} dashboard`}
                  className="project-img"
                  width="1919"
                  height="1011"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="project-body">
                <span className="tag">{project.tag}</span>
                <h3 className="project-title">{project.title}</h3>
                <dl className="project-facts">
                  {projectFacts.map((fact) => (
                    <div key={fact.key} className="project-fact">
                      <dt>{fact.label}</dt>
                      <dd>{project[fact.key]}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--accent project-link"
                >
                  <GithubIcon size={14} /> View Branch <ExternalLink size={12} aria-hidden="true" />
                  <span className="sr-only">for {project.title} (opens in a new tab)</span>
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
