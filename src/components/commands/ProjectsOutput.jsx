import React from 'react';
import Typewriter from '../Typewriter';

const ProjectsOutput = () => {
  // Using wider table ~95 chars
  const tableBorder = <span className="dim">+------------------------------------------------+-------------------------+-------------+</span>;
  const tableHeader = <span className="highlight">| Project Title                                  | Domain                  | References  |</span>;

  const formatRow = (title, domain, link) => (
    <span>
      <span className="dim">|</span> {title.padEnd(46, ' ')} <span className="dim">|</span> {domain.padEnd(23, ' ')} <span className="dim">|</span> {link} <span className="dim">|</span>
    </span>
  );

  const row1 = formatRow('Marugame Club (Critical IDOR)', 'Vulnerability Research', <a href="#" className="term-link">[PDF]      </a>);
  const row2 = formatRow('HDPiano Protocol Bypass',       'Vulnerability Research', <a href="#" className="term-link">[PDF]      </a>);
  const row3 = formatRow('Zendesk Domain Fronting',       'Vulnerability Research', <a href="#" className="term-link">[PDF]      </a>);
  const row4 = formatRow('University API & AD ETL',       'Data Engineering',       <a href="#" className="term-link">[Repo]     </a>);
  const row5 = formatRow('Voice AI Executive Assistant',  'AI / Architecture',      <a href="#" className="term-link">[Repo]     </a>);
  const row6 = formatRow('IRIS/RETINA Hardware System',   'System Architecture',    <a href="#" className="term-link">[Demo]     </a>);
  const row7 = formatRow('Overmind (2G HTS ILP Model)',   'Algorithm Optimization', <a href="#" className="term-link">[Demo]     </a>);

  const lines = [
    <span className="dim" style={{ display: 'block', marginBottom: '16px' }}>Fetching project repositories... done.</span>,
    tableBorder,
    tableHeader,
    tableBorder,
    row1,
    row2,
    row3,
    tableBorder,
    row4,
    row5,
    row6,
    row7,
    tableBorder,
    <span className="dim" style={{ display: 'block', marginTop: '16px' }}>7 records returned.</span>
  ];

  return <Typewriter lines={lines} delay={20} />;
};

export default ProjectsOutput;
