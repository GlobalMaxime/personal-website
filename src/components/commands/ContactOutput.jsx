import React from 'react';
import Typewriter from '../Typewriter';

const ContactOutput = () => {
    const lines = [
        <div key="c0" className="dim">Establishing secure comms channel...</div>,
        <br key="b1"/>,
        <div key="c1" className="dim">| Method          | Data                                              |</div>,
        <div key="c2" className="dim">|-----------------|---------------------------------------------------|</div>,
        <div key="c3" style={{ whiteSpace: 'pre' }}>
            <span className="dim">|</span><span className="color-green"> Email           </span><span className="dim">|</span><a href="mailto:Milanluther@gmail.com" style={{ textDecoration: 'none', color: 'var(--term-cyan)' }} className="hover-underline"> Milanluther@gmail.com                               </a><span className="dim">|</span>
        </div>,
        <div key="c4" style={{ whiteSpace: 'pre' }}>
            <span className="dim">|</span><span className="color-blue"> LinkedIn        </span><span className="dim">|</span><a href="https://www.linkedin.com/in/milan-luther" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--term-cyan)' }} className="hover-underline"> linkedin.com/in/milan-luther                        </a><span className="dim">|</span>
        </div>,
        <div key="c5" style={{ whiteSpace: 'pre' }}>
            <span className="dim">|</span><span style={{ color: '#f0f0f0' }}> GitHub          </span><span className="dim">|</span><a href="https://github.com/GlobalMaxime" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--term-cyan)' }} className="hover-underline"> github.com/GlobalMaxime                             </a><span className="dim">|</span>
        </div>,
        <div key="c6" className="dim">|-----------------|---------------------------------------------------|</div>,
        <br key="b2"/>,
        <div key="c7" className="dim">Transmission complete.</div>
    ];

    return (
        <div style={{ fontFamily: 'var(--font-mono)' }}>
            <Typewriter lines={lines} delay={20} />
            <style>{`
                .hover-underline:hover {
                    text-decoration: underline dashed !important;
                }
            `}</style>
        </div>
    );
};

export default ContactOutput;
