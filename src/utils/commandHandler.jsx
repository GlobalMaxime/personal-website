import React from 'react';
import CVOutput from '../components/commands/CVOutput';
import HelpOutput from '../components/commands/HelpOutput';
import ProjectsOutput from '../components/commands/ProjectsOutput';
import ContactOutput from '../components/commands/ContactOutput';
import WhoamiOutput from '../components/commands/WhoamiOutput';
import DonutOutput from '../components/commands/DonutOutput';
import SpeedTestOutput from '../components/commands/SpeedTestOutput';
import WeatherOutput from '../components/commands/WeatherOutput';

export const handleCommand = (cmdStr, clearFn, startAppFn) => {
  if (!cmdStr.trim()) return null;

  const parts = cmdStr.trim().split(/\s+/);
  const baseCmd = parts[0].toLowerCase();
  const flags = parts.slice(1).map(f => f.toLowerCase());

  switch (baseCmd) {
    case 'help':
      return <HelpOutput />;
    case 'cv':
      return <CVOutput />;
    case 'projects':
      return <ProjectsOutput />;
    case 'contact':
      return <ContactOutput />;
    case 'whoami':
      return <WhoamiOutput />;
    case 'speedtest':
      return <SpeedTestOutput />;
    case 'donut':
      return <DonutOutput />;
    case 'weather':
      const rawCity = cmdStr.trim().split(/\s+/).slice(1).join(' ');
      return <WeatherOutput city={rawCity || 'London'} />;
    case 'starwars':
      startAppFn('starwars');
      return <div className="color-cyan">Loading holocron link...</div>;
    case 'tetris':
    case 'play':
    case 'game':
      if (flags.includes('--rank') || flags.includes('-r')) {
        startAppFn('tetris', { mode: 'LEADERBOARD' });
        return <div className="color-cyan">Querying global scoreboard telemetry...</div>;
      }
      startAppFn('tetris');
      return <div className="color-cyan">Loading tetris module...</div>;
    case 'clear':
      // Clear handled at the Terminal component level before evaluation
      return null;
    default:
      return (
        <div>
          <span className="color-red">milan-cli: command not found: {cmdStr}</span>
          <br/>
          <span>Type <span className="color-yellow">help</span> to see available commands.</span>
        </div>
      );
  }
};
