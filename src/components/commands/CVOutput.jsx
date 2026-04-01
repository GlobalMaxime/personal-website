import React from 'react';
import Typewriter from '../Typewriter';

const CVOutput = () => {
  const lines = [
    <span className="highlight">[TECHNICAL SKILLS]</span>,
    <span>• Languages: Python, SQL, VBA/VBS, PowerShell, HTML/CSS.</span>,
    <span>• Data & Optimization: Integer Linear Programming (PuLP), Combinatorial Opt, Pandas, NumPy, SQLite, ETL.</span>,
    <span>• Security: Reverse Engineering, Pen Testing (IDOR, Domain Fronting), Network Arch (VLANs, DNS, DHCP),</span>,
    <span>  Packet Analysis, Cryptography (SAML/OAuth flows).</span>,
    <span>• Tools: Flask, PyQt5, MySQL, Raspberry Pi, REST APIs, Google Cloud Platform (GCP).</span>,
    <br key="br2" />,

    <span className="highlight">[PROFESSIONAL EXPERIENCE]</span>,
    <span><span className="highlight">Faraday Factory Japan</span> | Software Engineer Intern | Zama, Japan | Jun 2025 – Jul 2025</span>,
    <span>  Developed "Overmind," a proprietary software suite to optimize 2G HTS tape assignment.</span>,
    <span>  • Algorithmic Optimization: Formulated an ILP model (using PuLP) to automate segment assignment, </span>,
    <span>    minimizing material scrap (~0.02% waste) and matching client specs with high precision.</span>,
    <span>  • Reverse Engineering: Reverse-engineered proprietary binary output from Theva Tapestar machines </span>,
    <span>    to build custom data processing tools, bypassing expensive vendor software.</span>,
    <span>  • Software Architecture: Built robust GUI using PyQt5/Python for visualizing critical current (Ic) plots.</span>,
    <span>  • Impact: Automated manual workflow, cutting QC processing time by ~60%.</span>,
    <br key="br3" />,

    <span><span className="highlight">Cardinal House Technologies</span> | Co-Creator & Developer | London, UK | May 2024 – Present</span>,
    <span>  Architected "IRIS/RETINA," a hardware-software system for demographic analytics.</span>,
    <span>  • System Architecture: Designed local network intelligence system using Raspberry Pi, VLANs, and custom </span>,
    <span>    DNS/DHCP to route segmented network traffic through a captive portal.</span>,
    <span>  • Advanced Persistence: Devised Font Cache Side-Channel mechanism for persistent user identification. </span>,
    <span>    Python pipeline to generate 128-bit UUID web-fonts, enabling robust browser fingerprinting.</span>,
    <span>  • Backend Engineering: Built "RETINA" SQL backend & "IRIS" Python decision engine for MAC tracking.</span>,
    <br key="br4" />,

    <span className="highlight">[VULNERABILITY RESEARCH & SECURITY]</span>,
    <span>• Marugame Club (Critical IDOR): Discovered & responsibly disclosed IDOR. Reverse-engineered auth logic </span>,
    <span>  to find IDs were predictable MD5 hashes. Scripted enumeration & auth bypass.</span>,
    <span>• HDPiano (Protocol Analysis): Disclosed paywall bypass via video streaming protocols. Reverse-engineered </span>,
    <span>  M3U8 chunk transfer to asynchronously download/reassemble segments. Devised frame scrambling patch.</span>,
    <span>• Zendesk (Domain Fronting): Identified domain fronting vulnerability allowing unapproved file hosting </span>,
    <span>  on critical domains (mit.edu, fcc.gov, nhs.uk) via shared infrastructure.</span>,
    <br key="br5" />,

    <span className="highlight">[AI & ENGINEERING PROJECTS]</span>,
    <span>• Uni Infrastructure Reverse Engineering: Deconstructed SAML/ADFS flow for Royal Holloway's Scientia API. </span>,
    <span>  Built Python client for programmatic booking & ETL pipeline into SQLite for behaviour analysis.</span>,
    <span>• Voice AI Executive Assistant: Developed conversational agent (Twilio/ElevenLabs). Built Flask middleware </span>,
    <span>  to bridge voice intent with GCP Calendar via OAuth 2.0 with Human-in-the-Loop logic.</span>,
    <br key="br6" />,

    <span className="highlight">[EDUCATION]</span>,
    <span>• Royal Holloway, Univ of London | BSc Computer Science | Sep 2025 – Present</span>,
    <span>• Royal Holloway, Univ of London | Academic Rep (1st Year CS) | Sep 2025 – Present</span>,
    <span>• Henley Business School | CertHE in Business Management | 2024 – 2025</span>,
    <span>• Kensington Park School | A Levels: Business, CompSci, Economics, Psychology | 2021 – 2023</span>,
    <br key="br7" />,

    <span className="highlight">[ADDITIONAL EXPERIENCE]</span>,
    <span>• Sony Pictures (Cape Town) | Production Assistant Intern | 02/2024 - 04/2024</span>,
    <span>• Médecins Sans Frontières | Event Fundraiser | 10/2023 - 02/2024</span>,
    
    <br key="br8" />,
    <span className="dim">[EOF]</span>
  ];

  return <Typewriter lines={lines} delay={5} />; // Extremely fast typing for large complete DB
};

export default CVOutput;
