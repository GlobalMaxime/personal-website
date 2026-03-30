import React, { useEffect, useState } from 'react';

const AboutYou = ({ onClose }) => {
  const [data, setData] = useState({
    browser: '',
    os: '',
    battery: 'Checking...',
    networkDownlink: 'Checking...',
    networkType: 'Checking...',
    ip: 'Fetching...',
  });

  useEffect(() => {
    // Basic User Agent Parsing
    const ua = navigator.userAgent;
    let browser = "Unknown Browser";
    if (ua.includes("Firefox")) browser = "Mozilla Firefox";
    else if (ua.includes("SamsungBrowser")) browser = "Samsung Internet";
    else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
    else if (ua.includes("Edg")) browser = "Microsoft Edge";
    else if (ua.includes("Chrome")) browser = "Google Chrome";
    else if (ua.includes("Safari")) browser = "Apple Safari";
    
    let os = "Unknown OS";
    if (ua.includes("Win")) os = "Windows";
    else if (ua.includes("Mac")) os = "MacOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("like Mac")) os = "iOS";

    // Hardware/Network APIs
    let batteryStatus = 'API not supported';
    if ('getBattery' in navigator) {
      navigator.getBattery().then(bat => {
        batteryStatus = `${Math.round(bat.level * 100)}% ${bat.charging ? '(Charging ⚡)' : '(Discharging)'}`;
        updateState({ battery: batteryStatus });
      }).catch(() => {});
    }

    let networkDownlink = 'API not supported';
    let networkType = 'API not supported';
    if ('connection' in navigator) {
      const conn = navigator.connection;
      networkDownlink = `${conn.downlink} Mbps`;
      networkType = conn.effectiveType || 'Unknown';
    }

    // IP Address fetching
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(resData => updateState({ ip: resData.ip }))
      .catch(() => updateState({ ip: 'Blocked or unavailable' }));

    setData(prev => ({
      ...prev,
      browser,
      os,
      battery: batteryStatus,
      networkDownlink,
      networkType,
    }));

  }, []);

  const updateState = (newFields) => {
    setData(prev => ({ ...prev, ...newFields }));
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <button 
        onClick={onClose} 
        style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '2rem', cursor: 'pointer' }}
      >
        &times;
      </button>
      <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--accent)', paddingBottom: '1rem', color: '#ff6b6b' }}>
        A Little Bit About You
      </h2>
      
      <p style={{ marginBottom: '2rem' }}>
        Since you wanted to know about me, I thought it'd be fair to see what I know about you. 
        Here's a glimpse of the digital footprint you leave behind.
      </p>

      <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', padding: '1.5rem', fontFamily: 'var(--font-mono)' }}>
        <DataRow label="Operating System" value={data.os} />
        <DataRow label="Browser" value={data.browser} />
        <DataRow label="Battery Percentage" value={data.battery} />
        <DataRow label="Approximate Downlink" value={data.networkDownlink} />
        <DataRow label="Network Type" value={data.networkType} />
        <DataRow label="IP Address" value={data.ip} />
      </div>

      <p className="disclaimer">
        ⚠️ <strong>Disclaimer:</strong> None of this information is stored, logged, or sent anywhere other than this local page render. It is exclusively present for your eyes.
      </p>
    </div>
  );
};

const DataRow = ({ label, value }) => (
  <div className="data-row">
    <span className="data-label">{label}:</span>
    <span className="data-value">{value}</span>
  </div>
);

export default AboutYou;
