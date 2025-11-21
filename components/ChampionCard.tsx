import React from 'react';
import { ChampionData, Lane } from '../types';
import { getLoadingArtUrl } from '../services/riotService';

interface ChampionCardProps {
  champion: ChampionData | null;
  lane: Lane;
  delay: number;
}

const ChampionCard: React.FC<ChampionCardProps> = ({ champion, lane, delay }) => {
  // Map lane to display name
  const laneLabels: Record<Lane, string> = {
    [Lane.TOP]: 'TOP LANE',
    [Lane.JUNGLE]: 'JUNGLE',
    [Lane.MID]: 'MID LANE',
    [Lane.BOT]: 'BOTTOM',
    [Lane.SUPPORT]: 'SUPPORT'
  };

  const laneIcons: Record<Lane, string> = {
    [Lane.TOP]: '🛡️',
    [Lane.JUNGLE]: '⚔️',
    [Lane.MID]: '🔮',
    [Lane.BOT]: '🏹',
    [Lane.SUPPORT]: '❤️'
  };

  if (!champion) {
    return (
      <div className="w-full md:w-1/5 p-1 md:p-2">
        <div className="h-[120px] md:h-[400px] border-2 md:border-4 border-double border-gray-700 bg-gray-900 flex flex-row md:flex-col items-center justify-center text-gray-500 animate-pulse gap-4 md:gap-0">
          <span className="text-2xl mb-0 md:mb-2">{laneIcons[lane]}</span>
          <div className="flex flex-col items-center md:items-center">
            <span className="font-pixel text-[10px] md:text-xs">{laneLabels[lane]}</span>
            <span className="mt-0 md:mt-4 text-xs md:text-sm font-pixel">WAITING...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full md:w-1/5 p-1 md:p-2 animate-fade-in-up" 
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="relative h-[280px] md:h-[400px] group overflow-hidden border-2 md:border-4 border-indigo-500 bg-black shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)] transition-all duration-300 transform hover:-translate-y-2">
        
        {/* Background Image */}
        <img 
          src={getLoadingArtUrl(champion.id)} 
          alt={champion.name}
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
          style={{ objectPosition: 'top center' }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 flex flex-col items-center text-center z-10">
          <div className="bg-black/80 px-2 md:px-3 py-1 border border-indigo-400 mb-1 md:mb-2 shadow-[4px_4px_0_rgba(99,102,241,0.4)]">
             <span className="text-yellow-400 text-[10px] md:text-xs font-pixel tracking-widest uppercase">
               {laneIcons[lane]} {laneLabels[lane]}
             </span>
          </div>
          
          <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-wider font-pixel drop-shadow-md truncate w-full">
            {champion.name}
          </h3>
          <p className="text-indigo-300 text-[10px] md:text-sm font-vt323 uppercase tracking-widest mt-0 md:mt-1 truncate w-full">
            {champion.title}
          </p>

          {/* Retro Stat Bars - Hide on very small screens if needed, or make smaller */}
          <div className="w-full mt-2 md:mt-3 space-y-1 opacity-90">
            <div className="flex items-center text-[10px] md:text-xs text-red-400 font-pixel">
              <span className="w-6 md:w-8">ATK</span>
              <div className="flex-1 h-1.5 md:h-2 bg-gray-800 ml-2 border border-red-900">
                <div className="h-full bg-red-500" style={{ width: `${champion.info.attack * 10}%` }}></div>
              </div>
            </div>
            <div className="flex items-center text-[10px] md:text-xs text-blue-400 font-pixel">
              <span className="w-6 md:w-8">MAG</span>
              <div className="flex-1 h-1.5 md:h-2 bg-gray-800 ml-2 border border-blue-900">
                <div className="h-full bg-blue-500" style={{ width: `${champion.info.magic * 10}%` }}></div>
              </div>
            </div>
            <div className="flex items-center text-[10px] md:text-xs text-green-400 font-pixel">
              <span className="w-6 md:w-8">DEF</span>
              <div className="flex-1 h-1.5 md:h-2 bg-gray-800 ml-2 border border-green-900">
                <div className="h-full bg-green-500" style={{ width: `${champion.info.defense * 10}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scanline overlay specific to card */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
      </div>
    </div>
  );
};

export default ChampionCard;