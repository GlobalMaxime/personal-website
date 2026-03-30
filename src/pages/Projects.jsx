import React from 'react';
import { projects } from '../data/projectsData';

const Projects = () => {
  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.5s ease forwards' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', borderBottom: '2px solid rgba(102, 252, 241, 0.2)', paddingBottom: '1rem' }}>
        Side Projects
      </h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        A collection of my recent experiments, tools, and open-source contributions.
      </p>
      
      <div className="projects-grid">
        {projects.map((proj) => (
          <div key={proj.id} className="glass-panel project-card">
            <h3>{proj.title}</h3>
            <span className="mono" style={{ color: 'var(--accent)', marginBottom: '1rem', display: 'block' }}>{proj.date}</span>
            <p>{proj.description}</p>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {proj.tags.map(tag => (
                <span key={tag} style={{ backgroundColor: 'rgba(69, 162, 158, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-active)' }}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="project-links">
              <a href={proj.repoLink} className="project-link" target="_blank" rel="noreferrer">GitHub Base &rsaquo;</a>
              <a href={proj.demoLink} className="project-link" target="_blank" rel="noreferrer">Live Demo &rsaquo;</a>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Projects;
