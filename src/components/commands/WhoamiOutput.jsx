import React, { useState, useEffect } from 'react';
import Typewriter from '../Typewriter';

const WhoamiOutput = () => {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    let active = true;
    const gatherData = async () => {
      const data = {};

      // 1. Logical Cores & RAM
      if (navigator.hardwareConcurrency) data['Logical Processors'] = navigator.hardwareConcurrency;
      if (navigator.deviceMemory) data['Est. System RAM'] = `${navigator.deviceMemory} GB`;

      // 2. Display & Environment
      if (window.screen) {
        data['Screen Resolution'] = `${window.screen.width}x${window.screen.height}`;
        data['Color Depth'] = `${window.screen.colorDepth}-bit`;
      }
      try {
        data['Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch(e){}

      // 3. System Platform / Browser
      data['User Agent'] = navigator.userAgent;
      data['System Language'] = navigator.language;
      data['Do Not Track'] = navigator.doNotTrack === "1" ? "Enabled (Ignored)" : "Disabled";

      // 4. Hardware (WebGL GPU)
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            data['GPU Renderer'] = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      } catch(e) {}

      // 5. Network Connection
      if (navigator.connection) {
        if (navigator.connection.effectiveType) data['Network Type'] = navigator.connection.effectiveType.toUpperCase();
        if (navigator.connection.downlink) data['Est. Downlink'] = `${navigator.connection.downlink} Mbps`;
      }

      // 6. Battery (Wait for promise if available)
      if (navigator.getBattery) {
        try {
          const bat = await navigator.getBattery();
          const level = Math.round(bat.level * 100);
          data['Battery Status'] = `${level}% (${bat.charging ? 'Charging' : 'Discharging'})`;
        } catch(e) {}
      }

      // 7. IP Address (via ifconfig.me) - Async
      try {
        const ipRes = await fetch('https://ifconfig.me/all.json', { signal: AbortSignal.timeout(3000) });
        if (ipRes.ok) {
           const ipJson = await ipRes.json();
           data['IPv4/v6 Address'] = ipJson.ip_addr;
           if (ipJson.remote_host) data['Remote Host'] = ipJson.remote_host;

           // Geolocation mapping from IP
           try {
              const geoRes = await fetch(`https://ipapi.co/${ipJson.ip_addr}/json/`, { signal: AbortSignal.timeout(3000) });
              if (geoRes.ok) {
                const geoJson = await geoRes.json();
                if (geoJson.city && geoJson.country_name) {
                  data['Geo-Location'] = `${geoJson.city}, ${geoJson.region}, ${geoJson.country_name}`;
                }
                if (geoJson.org) data['ISP / ASN'] = geoJson.org;
              }
           } catch(e){}
        }
      } catch(e) {}

      if (active) setTelemetry(data);
    };

    gatherData();
    return () => { active = false; };
  }, []);

  if (!telemetry) {
    return <div className="dim blink" style={{ padding: '10px 0' }}>[initiating telemetry scrape sequence...]</div>;
  }

  let maxKey = "Metric".length;
  let maxVal = "Identification Payload".length;

  for (const [k, v] of Object.entries(telemetry)) {
    if (k.length > maxKey) maxKey = k.length;
    let vStr = String(v);
    if (vStr.length > maxVal) maxVal = vStr.length;
  }

  if (maxVal > 65) maxVal = 65; // Cap value width to structural integrity

  const pad = (str, len) => {
     let s = String(str);
     if (s.length > len) s = s.substring(0, len-3) + '...';
     return s.padEnd(len, ' ');
  };

  const topBorder = `╭─${'─'.repeat(maxKey)}─┬─${'─'.repeat(maxVal)}─╮`;
  const midBorder = `├─${'─'.repeat(maxKey)}─┼─${'─'.repeat(maxVal)}─┤`;
  const botBorder = `╰─${'─'.repeat(maxKey)}─┴─${'─'.repeat(maxVal)}─╯`;

  const lines = [
    <div key="w0" className="dim">Harvesting bypass payload telemetry...</div>,
    <br key="w1"/>,
    <div key="w_top" className="dim" style={{ whiteSpace: 'pre' }}>{topBorder}</div>,
    <div key="w2" className="dim" style={{ whiteSpace: 'pre' }}>│ {pad("Metric", maxKey)} │ {pad("Identification Payload", maxVal)} │</div>,
    <div key="w3" className="dim" style={{ whiteSpace: 'pre' }}>{midBorder}</div>
  ];
  
  Object.entries(telemetry).forEach(([k, v], idx) => {
    lines.push(
      <div key={`w4-${idx}`} style={{ whiteSpace: 'pre' }}>
         <span className="dim">│ </span><span className="color-yellow">{pad(k, maxKey)}</span><span className="dim"> │ </span><span className="color-cyan">{pad(v, maxVal)}</span><span className="dim"> │</span>
      </div>
    );
  });
  
  lines.push(<div key="w5" className="dim" style={{ whiteSpace: 'pre' }}>{botBorder}</div>);
  lines.push(<br key="w6"/>);
  lines.push(<div key="w7" className="dim">Local device mapping complete. Origin identified.</div>);

  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>
      <Typewriter lines={lines} delay={20} />
      <style>{`
        .blink { animation: blink 1s linear infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};

export default WhoamiOutput;
