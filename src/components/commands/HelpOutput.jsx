import React from 'react';
import Typewriter from '../Typewriter';

const HelpOutput = () => {
  const commands = [
    { cmd: 'help', cat: 'System', desc: 'Displays usable commands', color: 'color-green' },
    { cmd: 'clear', cat: 'System', desc: 'Clears the terminal', color: 'color-green' },
    { cmd: 'cv', cat: 'About', desc: "Milan Toohey's CV", color: 'color-green' },
    { cmd: 'projects', cat: 'About', desc: "A repository of Milan's projects", color: 'color-green' },
    { cmd: 'contact', cat: 'About', desc: 'How to contact Milan', color: 'color-green' },
    { cmd: 'whoami', cat: 'Tools', desc: 'Who am I? Who are you?', color: 'color-green' },
    { cmd: 'speedtest', cat: 'Tools', desc: 'Tests your internet upload/download speed', color: 'color-green' },
    { cmd: 'weather [city]', cat: 'Tools', desc: 'Real-time atmospheric telemetry', color: 'color-cyan' },
    { cmd: 'tetris', cat: 'Misc', desc: "Well ... it's tetris", color: 'color-orange' },
    { cmd: 'tetris --rank', cat: 'Misc', desc: 'View the tetris leaderboard', color: 'color-orange' },
    { cmd: 'starwars', cat: 'Misc', desc: 'An absolute classic', color: 'color-orange' },
    { cmd: 'donut', cat: 'Misc', desc: 'Wow, look at it go', color: 'color-orange' }
  ];

  const topBorder    = "╭────────────────┬──────────┬─────────────────────────────────────────────────────╮";
  const midBorder    = "├────────────────┼──────────┼─────────────────────────────────────────────────────┤";
  const bottomBorder = "╰────────────────┴──────────┴─────────────────────────────────────────────────────╯";

  const lines = [
    <div key="h0" className="dim" style={{ whiteSpace: 'pre' }}>{topBorder}</div>,
    <div key="h1" className="dim" style={{ whiteSpace: 'pre' }}>│ Command        │ Category │ Description                                         │</div>,
    <div key="h2" className="dim" style={{ whiteSpace: 'pre' }}>{midBorder}</div>
  ];

  let lastCat = null;

  commands.forEach((item, i) => {
    const cmdPad = item.cmd.padEnd(14, ' ');
    const catPad = item.cat.padEnd(8, ' ');
    const descPad = item.desc.padEnd(51, ' ');

    if (lastCat && lastCat !== item.cat) {
       lines.push(
         <div key={`spacer-${i}`} className="dim" style={{ whiteSpace: 'pre' }}>
           {midBorder}
         </div>
       );
    }
    lastCat = item.cat;

    lines.push(
      <div key={`cmd-${i}`} style={{ whiteSpace: 'pre' }}>
         <span className="dim">│ </span>
         <span className={item.color}>{cmdPad}</span>
         <span className="dim"> │ </span>
         <span className="color-yellow">{catPad}</span>
         <span className="dim"> │ </span>
         <span>{descPad}</span>
         <span className="dim"> │</span>
      </div>
    );
  });

  lines.push(
    <div key="footer" className="dim" style={{ whiteSpace: 'pre', marginTop: '0' }}>
      {bottomBorder}
    </div>
  );

  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>
      <Typewriter lines={lines} delay={20} />
    </div>
  );
};

export default HelpOutput;
