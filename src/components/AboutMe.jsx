import React from 'react';

const AboutMe = ({ onClose }) => {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <button 
        onClick={onClose} 
        style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '2rem', cursor: 'pointer' }}
      >
        &times;
      </button>
      <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--accent)', paddingBottom: '1rem' }}>
        Curriculum Vitae
      </h2>
      
      <section style={{ marginBottom: '2.5rem' }}>
        <h3>Summary</h3>
        <p>
          I am a software engineer and mathematician fascinated by structure, geometry, and algorithms. 
          I specialize in building performant, modern web applications that blend clean architecture with dynamic, engaging user interfaces.
        </p>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h3>Experience</h3>
        <div style={{ marginBottom: '1.5rem' }}>
          <h4>Senior Web Developer</h4>
          <span className="mono" style={{ color: 'var(--accent)' }}>Tech Innovators Inc. (2022 - Present)</span>
          <p style={{ marginTop: '0.5rem' }}>Architected and deployed highly interactive frontend systems. Optimized render performance and introduced a comprehensive design system utilizing modern React patterns and vanilla CSS variables.</p>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h4>Frontend Engineer</h4>
          <span className="mono" style={{ color: 'var(--accent)' }}>Data Flow Dynamics (2019 - 2022)</span>
          <p style={{ marginTop: '0.5rem' }}>Built data-heavy dashboards for mathematical modeling tools. Implemented performant data grids and interactive WebGL charts.</p>
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h3>Education</h3>
        <div>
          <h4>B.S. in Mathematics & Computer Science</h4>
          <span className="mono" style={{ color: 'var(--accent)' }}>University of Technology (2015 - 2019)</span>
          <p style={{ marginTop: '0.5rem' }}>Focus on Discrete Mathematics, Graph Theory, and Systems Programming.</p>
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h3>Core Skills</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {['JavaScript (ES6+)', 'React', 'Vite', 'CSS3', 'WebGL', 'Node.js', 'Python', 'Mathematics', 'Algorithms'].map(skill => (
            <span key={skill} style={{ border: '1px solid var(--accent)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem', color: 'var(--text-active)' }}>
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutMe;
