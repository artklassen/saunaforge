import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Thermometer, Clock, Droplets, Heart, TrendingUp, Settings, User, Book } from 'lucide-react';

// Add custom CSS for animations
const styles = `
  @keyframes steam {
    0% {
      transform: translateY(100px) translateX(0px) scale(0.8) rotate(0deg);
      opacity: 0.6;
    }
    25% {
      transform: translateY(60px) translateX(15px) scale(0.9) rotate(5deg);
      opacity: 0.5;
    }
    50% {
      transform: translateY(20px) translateX(-10px) scale(1) rotate(-3deg);
      opacity: 0.4;
    }
    75% {
      transform: translateY(-20px) translateX(20px) scale(0.8) rotate(8deg);
      opacity: 0.3;
    }
    100% {
      transform: translateY(-100px) translateX(-5px) scale(0.6) rotate(-2deg);
      opacity: 0;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-20px) translateX(10px);
      opacity: 0.6;
    }
  }
  
  @keyframes dropletForm {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
  }
  
  @keyframes dropletSlide {
    0% {
      transform: translateY(0px) translateX(0px) rotate(0deg);
      opacity: 0.6;
    }
    100% {
      transform: translateY(var(--slide-distance, 100px)) translateX(calc(var(--slide-distance, 100px) * tan(var(--slide-angle, 0deg)) * 0.1)) rotate(var(--slide-angle, 0deg));
      opacity: 0;
    }
  }
  
  @keyframes condensation {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }
  
  .animate-steam {
    animation: steam linear infinite;
  }
  
  .animate-float {
    animation: float ease-in-out infinite;
  }
  
  .animate-droplet-form {
    animation: dropletForm 2s ease-out forwards;
  }
  
  .animate-droplet-slide {
    animation: dropletSlide 3s ease-in forwards;
  }
  
  .animate-condensation {
    animation: condensation 4s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

// Mock data storage (in production, this would connect to Supabase)
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

// Water Droplets Component
const WaterDroplets = ({ isActive }) => {
  const [droplets, setDroplets] = useState([]);
  
  useEffect(() => {
    if (!isActive) {
      setDroplets([]);
      return;
    }
    
    const interval = setInterval(() => {
      const newDroplet = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 10,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 5,
        slideDelay: Math.random() * 4,
        slideDistance: 80 + Math.random() * 120,
        slideAngle: -10 + Math.random() * 20,
      };
      
      setDroplets(prev => [...prev.slice(-18), newDroplet]);
    }, 400 + Math.random() * 1200);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
      {droplets.map((droplet) => (
        <div 
          key={droplet.id} 
          className="absolute"
          style={{
            left: `${droplet.x}%`,
            top: `${droplet.y}%`,
            width: '20px',
            height: '20px',
          }}
        >
          <div
            className="absolute animate-condensation"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${0.8 + Math.random() * 0.4}) rotate(${Math.random() * 360}deg)`,
              animationDelay: `${droplet.delay}s`,
            }}
          >
            <div 
              className="bg-white/40 rounded-full blur-sm"
              style={{
                width: `${droplet.size * 4}px`,
                height: `${droplet.size * 3}px`,
              }}
            />
          </div>
          
          <div
            className="absolute animate-droplet-form"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animationDelay: `${droplet.delay}s`,
            }}
          >
            <div
              className="animate-droplet-slide"
              style={{
                animationDelay: `${droplet.slideDelay}s`,
                animationDuration: `${droplet.duration}s`,
                '--slide-distance': `${droplet.slideDistance}px`,
                '--slide-angle': `${droplet.slideAngle}deg`,
              }}
            >
              <div 
                className="bg-gradient-to-b from-white/70 to-white/90 rounded-full shadow-lg border border-white/20"
                style={{
                  width: `${droplet.size * 1.5}px`,
                  height: `${droplet.size * 2.5}px`,
                  filter: 'blur(0.3px)',
                  transform: `rotate(${Math.random() * 15 - 7.5}deg)`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Heat Glow Effect Component
const HeatGlow = ({ isActive, intensity = 1 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-2000 ${
          isActive ? 'animate-pulse' : ''
        }`}
        style={{
          background: `radial-gradient(circle, 
            rgba(255, 107, 0, ${0.1 * intensity}) 0%, 
            rgba(255, 69, 0, ${0.05 * intensity}) 40%, 
            transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
      
      <div 
        className={`absolute inset-8 rounded-full transition-all duration-1000 ${
          isActive ? 'animate-pulse' : ''
        }`}
        style={{
          background: `radial-gradient(circle, 
            transparent 60%, 
            rgba(255, 140, 0, ${0.2 * intensity}) 80%, 
            transparent 100%)`,
          animationDelay: '0.5s',
        }}
      />
    </div>
  );
};

// Timer component
const SessionTimer = ({ onSessionComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [settings, setSettings] = useState({
    rounds: 3,
    heatDuration: 15,
    coldDuration: 3,
    restDuration: 5,
    includeRest: true,
    heatTemp: 80,
    coldTemp: 12,
    coldMethod: 'shower',
    endingType: 'cold',
    experienceLevel: 'intermediate'
  });
  const [phase, setPhase] = useState('heat');
  const [phaseTimeElapsed, setPhaseTimeElapsed] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const intervalRef = useRef(null);

  const getCurrentPhaseDuration = () => {
    switch (phase) {
      case 'heat': return settings.heatDuration * 60;
      case 'cold': return settings.coldDuration * 60;
      case 'rest': return settings.restDuration * 60;
      default: return settings.heatDuration * 60;
    }
  };

  const getNextPhase = () => {
    const isLastRound = currentRound === settings.rounds;
    
    switch (phase) {
      case 'heat':
        return 'cold';
      case 'cold':
        if (isLastRound) {
          return settings.endingType === 'cold' ? 'complete' : 'heat';
        }
        return settings.includeRest ? 'rest' : 'heat';
      case 'rest':
        return 'heat';
      default:
        return 'heat';
    }
  };

  const handlePhaseTransition = () => {
    const nextPhase = getNextPhase();
    
    if (nextPhase === 'complete') {
      setSessionComplete(true);
      setIsRunning(false);
      const sessionData = {
        duration: Math.floor(timeElapsed / 60),
        rounds: currentRound,
        heatTemp: settings.heatTemp,
        coldTemp: settings.coldTemp,
        coldMethod: settings.coldMethod,
        endingType: settings.endingType,
        completedAt: new Date().toISOString()
      };
      onSessionComplete(sessionData);
      return;
    }
    
    if (nextPhase === 'heat' && phase !== 'heat') {
      setCurrentRound(prev => prev + 1);
    }
    
    setPhase(nextPhase);
    setPhaseTimeElapsed(0);
  };

  useEffect(() => {
    if (isRunning && !sessionComplete) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setPhaseTimeElapsed(prev => {
          const newPhaseTime = prev + 1;
          
          if (newPhaseTime >= getCurrentPhaseDuration()) {
            handlePhaseTransition();
            return 0;
          }
          
          return newPhaseTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, sessionComplete, phase, currentRound, settings]);

  const progress = (phaseTimeElapsed / getCurrentPhaseDuration()) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setSessionComplete(false);
  };
  
  const handlePause = () => setIsRunning(false);
  
  const handleStop = () => {
    setIsRunning(false);
    setSessionComplete(true);
    const sessionData = {
      duration: Math.floor(timeElapsed / 60),
      rounds: currentRound,
      heatTemp: settings.heatTemp,
      coldTemp: settings.coldTemp,
      coldMethod: settings.coldMethod,
      endingType: settings.endingType,
      completedAt: new Date().toISOString(),
      completed: false
    };
    onSessionComplete(sessionData);
    setTimeElapsed(0);
    setPhaseTimeElapsed(0);
    setCurrentRound(1);
    setPhase('heat');
    setSessionComplete(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    setPhaseTimeElapsed(0);
    setCurrentRound(1);
    setPhase('heat');
    setSessionComplete(false);
  };

  const getPhaseStyles = () => {
    switch (phase) {
      case 'heat':
        return {
          bgClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-orange-800',
          ringGradient: 'heatGradient',
          icon: '🔥'
        };
      case 'cold':
        return {
          bgClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-800',
          ringGradient: 'coldGradient',
          icon: '❄️'
        };
      case 'rest':
        return {
          bgClass: 'bg-gradient-to-br from-green-900 via-emerald-900 to-green-800',
          ringGradient: 'restGradient',
          icon: '🧘'
        };
      default:
        return {
          bgClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-orange-800',
          ringGradient: 'heatGradient',
          icon: '🔥'
        };
    }
  };

  const phaseStyles = getPhaseStyles();
  const heatIntensity = isRunning && phase === 'heat' ? Math.min(1, phaseTimeElapsed / 300) : 0;

  return (
    <div className={`${phaseStyles.bgClass} rounded-2xl p-8 text-white relative overflow-hidden transition-all duration-2000`}>
      <div className="absolute inset-0 opacity-20">
        <WaterDroplets isActive={isRunning && phase === 'heat'} />
        <div className={`w-full h-full bg-gradient-to-t from-transparent via-orange-400/10 to-yellow-400/20 ${isRunning ? 'animate-pulse' : ''}`} />
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">Contrast Therapy</h2>
          <p className="text-white/80">Round {currentRound} of {settings.rounds}</p>
          <p className="text-sm text-white/70 capitalize flex items-center justify-center gap-2">
            {phaseStyles.icon} {phase} Phase
          </p>
          {phase === 'heat' && (
            <p className="text-xs text-white/60 mt-1">{settings.heatTemp}°C</p>
          )}
          {phase === 'cold' && (
            <p className="text-xs text-white/60 mt-1">{settings.coldTemp}°C • {settings.coldMethod}</p>
          )}
        </div>

        <div className="relative w-48 h-48 mx-auto mb-8">
          {phase === 'heat' && <HeatGlow isActive={isRunning} intensity={heatIntensity} />}
          
          <svg className="transform -rotate-90 w-48 h-48 relative z-20">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke={`url(#${phaseStyles.ringGradient})`}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className="transition-all duration-1000 drop-shadow-sm"
              style={{
                filter: isRunning ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none'
              }}
            />
            <defs>
              <linearGradient id="heatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#ff6b35', stopOpacity: 1}} />
                <stop offset="50%" style={{stopColor: '#f7931e', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="coldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#00bcd4', stopOpacity: 1}} />
                <stop offset="50%" style={{stopColor: '#26c6da', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#4dd0e1', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="restGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#4caf50', stopOpacity: 1}} />
                <stop offset="50%" style={{stopColor: '#66bb6a', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#81c784', stopOpacity: 1}} />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center">
              <div className={`text-4xl font-mono font-bold transition-all duration-300 ${
                isRunning ? 'drop-shadow-lg scale-105' : ''
              }`}>
                {formatTime(phaseTimeElapsed)}
              </div>
              <div className="text-sm text-white/70">
                {formatTime(getCurrentPhaseDuration() - phaseTimeElapsed)} remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6 relative z-10">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            disabled={sessionComplete}
          >
            <Play size={20} />
            <span className="font-semibold">Start Session</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Pause size={20} />
            <span className="font-semibold">Pause</span>
          </button>
        )}
        <button
          onClick={handleStop}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Square size={20} />
          <span className="font-semibold">Stop</span>
        </button>
        {(timeElapsed > 0 || sessionComplete) && (
          <button
            onClick={handleReset}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-6 py-4 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="font-semibold">Reset</span>
          </button>
        )}
      </div>

      <div className="space-y-4 relative z-10">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <label className="block text-white/80 mb-2 font-medium">Rounds</label>
            <input
              type="number"
              min="1"
              max="5"
              value={settings.rounds}
              onChange={(e) => setSettings(prev => ({ ...prev, rounds: parseInt(e.target.value) }))}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-white/50 focus:outline-none transition-colors"
              disabled={isRunning}
            />
          </div>
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <label className="block text-white/80 mb-2 font-medium">Heat (min)</label>
            <input
              type="number"
              min="10"
              max="20"
              value={settings.heatDuration}
              onChange={(e) => setSettings(prev => ({ ...prev, heatDuration: parseInt(e.target.value) }))}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-white/50 focus:outline-none transition-colors"
              disabled={isRunning}
            />
          </div>
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <label className="block text-white/80 mb-2 font-medium">Cold (min)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={settings.coldDuration}
              onChange={(e) => setSettings(prev => ({ ...prev, coldDuration: parseInt(e.target.value) }))}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-white/50 focus:outline-none transition-colors"
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <label className="block text-white/80 mb-2 font-medium">Heat Temp (°C)</label>
            <input
              type="number"
              min="70"
              max="100"
              value={settings.heatTemp}
              onChange={(e) => setSettings(prev => ({ ...prev, heatTemp: parseInt(e.target.value) }))}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-white/50 focus:outline-none transition-colors"
              disabled={isRunning}
            />
          </div>
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <label className="block text-white/80 mb-2 font-medium">Cold Temp (°C)</label>
            <input
              type="number"
              min="5"
              max="15"
              value={settings.coldTemp}
              onChange={(e) => setSettings(prev => ({ ...prev, coldTemp: parseInt(e.target.value) }))}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-white/50 focus:outline-none transition-colors"
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <label className="block text-white/80 mb-2 font-medium">Cold Method</label>
            <select
              value={settings.coldMethod}
              onChange={(e) => setSettings(prev => ({ ...prev, coldMethod: e.target.value }))}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white focus:border-white/50 focus:outline-none transition-colors"
              disabled={isRunning}
            >
              <option value="shower" className="bg-gray-800">Cold Shower</option>
              <option value="plunge" className="bg-gray-800">Ice Plunge</option>
            </select>
          </div>
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <label className="block text-white/80 mb-2 font-medium">End On</label>
            <select
              value={settings.endingType}
              onChange={(e) => setSettings(prev => ({ ...prev, endingType: e.target.value }))}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white focus:border-white/50 focus:outline-none transition-colors"
              disabled={isRunning}
            >
              <option value="cold" className="bg-gray-800">Cold (Recovery)</option>
              <option value="warm" className="bg-gray-800">Warm (Relaxation)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified App for deployment
function App() {
  const [sessions, setSessions] = useState([]);

  const handleSessionComplete = (sessionData) => {
    setSessions(prev => [...prev, sessionData]);
    console.log('Session completed:', sessionData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">SaunaForge</h1>
          <div className="flex items-center gap-2">
            <User size={20} />
            <span className="text-sm">Contrast Therapy</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <SessionTimer onSessionComplete={handleSessionComplete} />
      </main>
    </div>
  );
}

export default App;