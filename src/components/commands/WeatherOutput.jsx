import React, { useState, useEffect } from 'react';
import Typewriter from '../Typewriter';

const WeatherOutput = ({ city = 'London' }) => {
  const [weatherLines, setWeatherLines] = useState([]);
  const [status, setStatus] = useState('LOADING'); // LOADING, SUCCESS, ERROR, NOT_FOUND

  useEffect(() => {
    let isMounted = true;
    
    const fetchWeather = async () => {
      try {
        // 1. Geocode the city string
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
          if (isMounted) setStatus('NOT_FOUND');
          return;
        }
        
        const loc = geoData.results[0];
        const { latitude, longitude, name, country } = loc;

        // 2. Fetch Forecast Data natively
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
        const weatherData = await weatherRes.json();
        
        if (!weatherData.current || !weatherData.daily) {
           throw new Error("Invalid Weather Payload");
        }

        const current = weatherData.current;
        const daily = weatherData.daily;
        const code = current.weather_code;
        
        const tempMax = Math.round(daily.temperature_2m_max[0]);
        const tempMin = Math.round(daily.temperature_2m_min[0]);
        const rainProb = daily.precipitation_probability_max[0];
        
        // Define WMO codes to massive ASCII Art structures
        let weatherArt = [];
        let conditionStr = "";
        
        if (code === 0 || code === 1) {
            weatherArt = [
              <span className="color-yellow" key="w1">    \\  /    </span>,
              <span className="color-yellow" key="w2">  _ /"".\\ _ </span>,
              <span className="color-yellow" key="w3">    \\__(/   </span>,
              <span className="color-yellow" key="w4">    /  \\    </span>
            ];
            conditionStr = code === 0 ? "Clear Skies" : "Mostly Clear";
        } else if (code === 2 || code === 3) {
            weatherArt = [
              <span className="color-cyan" key="w1">      .--.   </span>,
              <span className="color-cyan" key="w2">   .-(    ). </span>,
              <span className="color-cyan" key="w3">  (___.__)__)</span>,
              <span className="color-cyan" key="w4">             </span>
            ];
            conditionStr = code === 2 ? "Partly Cloudy" : "Overcast";
        } else if (code >= 50 && code <= 69) {
            weatherArt = [
              <span className="dim" key="w1">      .--.   </span>,
              <span className="dim" key="w2">   .-(    ). </span>,
              <span className="dim" key="w3">  (___.__)__)</span>,
              <span className="color-cyan" key="w4">   ʻ ʻ ʻ ʻ   </span>
            ];
            conditionStr = "Rain";
        } else if (code >= 70 && code <= 79) {
             weatherArt = [
              <span className="dim" key="w1">      .--.   </span>,
              <span className="dim" key="w2">   .-(    ). </span>,
              <span className="dim" key="w3">  (___.__)__)</span>,
              <span className="color-fg" key="w4">   *  *  *   </span>
            ];
            conditionStr = "Snow";
        } else if (code >= 95) {
             weatherArt = [
              <span className="dim" key="w1">      .--.   </span>,
              <span className="dim" key="w2">   .-(    ). </span>,
              <span className="dim" key="w3">  (___.__)__)</span>,
              <span className="color-yellow" key="w4">   ⚡ ⚡ ⚡  </span>
            ];
            conditionStr = "Thunderstorm";
        } else {
             weatherArt = [
              <span className="dim" key="w1">      .--.   </span>,
              <span className="dim" key="w2">   .-(    ). </span>,
              <span className="dim" key="w3">  (___.__)__)</span>,
              <span className="dim" key="w4">             </span>
            ];
            conditionStr = "Fog / Unclear";
        }

        const lines = [
          <br key="br1" />,
          <div key="l1" style={{ display: 'flex' }}>
             <pre style={{ margin: 0, paddingRight: '20px', lineHeight: '1.2' }}>{weatherArt[0]}</pre>
             <span className="color-green" style={{ fontWeight: 'bold' }}>{name}, {country}</span>
          </div>,
          <div key="l2" style={{ display: 'flex' }}>
             <pre style={{ margin: 0, paddingRight: '20px', lineHeight: '1.2' }}>{weatherArt[1]}</pre>
             <span className="color-cyan">{conditionStr}</span>
          </div>,
          <div key="l3" style={{ display: 'flex' }}>
             <pre style={{ margin: 0, paddingRight: '20px', lineHeight: '1.2' }}>{weatherArt[2]}</pre>
             <span>{Math.round(current.temperature_2m)} °C</span>
          </div>,
          <div key="l4" style={{ display: 'flex' }}>
             <pre style={{ margin: 0, paddingRight: '20px', lineHeight: '1.2' }}>{weatherArt[3]}</pre>
             <span className="dim">Wind: {current.wind_speed_10m} km/h | Hum: {current.relative_humidity_2m}%</span>
          </div>,
          <div key="l5" style={{ display: 'flex', marginTop: '6px' }}>
             <pre style={{ margin: 0, paddingRight: '20px', lineHeight: '1.2' }}>             </pre>
             <span className="color-yellow">Forecast: {tempMin}°C - {tempMax}°C | {rainProb}% Rain Risk</span>
          </div>,
          <br key="br2" />
        ];
        
        if (isMounted) {
          setWeatherLines(lines);
          setStatus('SUCCESS');
        }

      } catch (err) {
        console.error("Weather fetch failed:", err);
        if (isMounted) setStatus('ERROR');
      }
    };

    fetchWeather();
    
    return () => { isMounted = false; };
  }, [city]);

  if (status === 'LOADING') {
    return <div className="color-yellow" style={{ animation: 'blink 1s linear infinite' }}>[!] Contacting Open-Meteo Atmospheric Satellite for [{city}]...</div>;
  }
  
  if (status === 'NOT_FOUND') {
    return <div className="color-red">[X] ERROR: Location [{city}] could not be resolved by Geocoding API.</div>;
  }
  
  if (status === 'ERROR') {
    return <div className="color-red">[X] ERROR: Terminal failed to establish secure connection to Open-Meteo infrastructure.</div>;
  }

  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
      <Typewriter lines={weatherLines} delay={30} />
    </div>
  );
};

export default WeatherOutput;
