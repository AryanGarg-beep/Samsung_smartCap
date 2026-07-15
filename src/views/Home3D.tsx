import { Moon, Sun } from 'lucide-react';
import type { Appliance } from '../types';

interface Home3DProps {
  appliances: Appliance[];
  isNightMode: boolean;
  onToggleNightMode: () => void;
  onSelectAppliance: (appliance: Appliance) => void;
}

function getGlow(app: Appliance): string {
  if (app.status !== 'ON') return '';
  if (app.type === 'Air Conditioner') return 'glow-blue';
  if (app.type === 'Smart TV') return 'glow-green';
  if (app.type === 'Lighting') return 'glow-yellow';
  if (app.type === 'Water Heater') return 'glow-red';
  return 'glow-blue';
}

export function Home3D({ appliances, isNightMode, onToggleNightMode, onSelectAppliance }: Home3DProps) {
  return (
    <div className={`space-y-6 animate-fade-in ${isNightMode ? 'night-mode' : ''} transition-colors duration-1000`}>
      <header className="flex justify-between items-center pt-4">
        <div className="inline-block bg-[#2D3436] border-4 border-[#2D3436] rounded-2xl px-6 py-2 shadow-[0_6px_0_0_rgba(0,0,0,0.2)]">
          <h1 className="text-2xl font-black text-white tracking-wider uppercase">3D Live Overview</h1>
        </div>

        <button
          onClick={onToggleNightMode}
          className="w-14 h-14 bg-white border-4 border-[#2D3436] rounded-full flex items-center justify-center shadow-[0_6px_0_0_#2D3436] hover:translate-y-1 hover:shadow-[0_4px_0_0_#2D3436] active:translate-y-2 active:shadow-none transition-all"
        >
          {isNightMode ? <Sun className="w-6 h-6 text-[#F1C40F]" /> : <Moon className="w-6 h-6 text-[#3498DB]" />}
        </button>
      </header>

      {/* 3D Map Container */}
      <div className="relative w-full h-[500px] md:h-[600px] bg-slate-200 rounded-[32px] border-4 border-[#2D3436] shadow-inner overflow-hidden flex items-center justify-center transition-colors duration-1000 iso-container">
        {/* Night mode dark overlay */}
        <div
          className={`absolute inset-0 bg-[#1e272e] pointer-events-none transition-opacity duration-1000 ${
            isNightMode ? 'opacity-90' : 'opacity-0 z-0'
          }`}
        ></div>

        <div className="iso-room relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
          {/* The Floor Plan */}
          <div className="iso-floor absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-2">
            <div className="border-4 border-slate-300 rounded-xl flex items-center justify-center relative">
              <span className="absolute bottom-2 right-2 text-xs font-black text-slate-300 transform -rotate-45">LIVING</span>
            </div>
            <div className="border-4 border-slate-300 rounded-xl flex items-center justify-center relative">
              <span className="absolute bottom-2 right-2 text-xs font-black text-slate-300 transform -rotate-45">KITCHEN</span>
            </div>
            <div className="border-4 border-slate-300 rounded-xl flex items-center justify-center relative">
              <span className="absolute bottom-2 right-2 text-xs font-black text-slate-300 transform -rotate-45">BATH</span>
            </div>
            <div className="border-4 border-slate-300 rounded-xl flex items-center justify-center relative">
              <span className="absolute bottom-2 right-2 text-xs font-black text-slate-300 transform -rotate-45">LAUNDRY</span>
            </div>
          </div>

          {/* SVG Energy Flow Layer (Matches isometric perspective) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ transform: 'translateZ(10px)' }}>
            {/* Main Panel Box */}
            <rect x="45%" y="45%" width="10%" height="10%" fill="#2D3436" rx="4" />

            {/* Draw lines to ON appliances */}
            {appliances.map((app) => {
              if (app.status !== 'ON') return null;
              const destX = app.pos.left;
              const destY = app.pos.top;
              return (
                <line
                  key={`line-${app.id}`}
                  x1="50%"
                  y1="50%"
                  x2={destX}
                  y2={destY}
                  stroke="#2ECC71"
                  strokeWidth="3"
                  className="energy-path"
                />
              );
            })}
          </svg>

          {/* Appliance Nodes */}
          {appliances.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={`node-${app.id}`}
                onClick={() => onSelectAppliance(app)}
                className={`absolute iso-node w-12 h-12 md:w-14 md:h-14 bg-white border-4 border-[#2D3436] rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#2D3436] ${getGlow(
                  app
                )} ${app.status === 'OFF' ? 'opacity-50' : 'opacity-100'}`}
                style={{ top: app.pos.top, left: app.pos.left, marginTop: '-24px', marginLeft: '-24px' }}
              >
                <Icon className="w-6 h-6" style={{ color: app.status === 'ON' ? app.accent : '#A4B0BE' }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-4 border-[#2D3436] rounded-2xl p-4 shadow-[0_6px_0_0_#2D3436] flex justify-center gap-6 text-sm font-black uppercase text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#2ECC71] animate-pulse"></div> Active Flow
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-300"></div> Standby
        </div>
      </div>
    </div>
  );
}
