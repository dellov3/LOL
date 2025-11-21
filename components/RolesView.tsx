import React from 'react';
import { ChampionData, Lane } from '../types';
import { filterChampionsByLane, getSquareArtUrl } from '../services/riotService';

interface RolesViewProps {
  champions: Record<string, ChampionData>;
}

const RolesView: React.FC<RolesViewProps> = ({ champions }) => {
  const lanes = [Lane.TOP, Lane.JUNGLE, Lane.MID, Lane.BOT, Lane.SUPPORT];
  const laneNames: Record<Lane, string> = {
    [Lane.TOP]: 'TOP LANE',
    [Lane.JUNGLE]: 'JUNGLE',
    [Lane.MID]: 'MID LANE',
    [Lane.BOT]: 'BOTTOM',
    [Lane.SUPPORT]: 'SUPPORT',
  };

  const laneColors: Record<Lane, string> = {
    [Lane.TOP]: 'text-red-400 border-red-500',
    [Lane.JUNGLE]: 'text-green-400 border-green-500',
    [Lane.MID]: 'text-purple-400 border-purple-500',
    [Lane.BOT]: 'text-blue-400 border-blue-500',
    [Lane.SUPPORT]: 'text-yellow-400 border-yellow-500',
  };

  // Fix: explicitly cast Object.values output to ChampionData[] to avoid type errors if inferred as unknown[]
  const championList = Object.values(champions) as ChampionData[];

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="text-center mb-6 md:mb-8 border-b-2 border-gray-800 pb-4">
        <h2 className="text-xl md:text-2xl font-pixel text-blue-300 mb-2">CHAMPION DATABASE</h2>
        <p className="text-gray-500 font-vt323 text-base md:text-lg">CLASSIFIED BY META ROLES</p>
      </div>

      {lanes.map((lane) => {
        const validChampions = filterChampionsByLane(championList, lane).sort((a, b) => a.name.localeCompare(b.name));
        
        return (
          <div key={lane} className="mb-10 md:mb-16">
            <div className={`flex flex-col md:flex-row md:items-end border-b-4 ${laneColors[lane].split(' ')[1]} mb-4 md:mb-6 pb-2`}>
              <h2 className={`text-2xl md:text-4xl font-pixel mr-4 ${laneColors[lane].split(' ')[0]}`}>
                {laneNames[lane]}
              </h2>
              <span className="text-gray-500 font-vt323 text-lg md:text-xl mb-1">
                // {validChampions.length} UNITS DETECTED
              </span>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 md:gap-4">
              {validChampions.map(champ => (
                <div key={champ.id} className="group relative bg-gray-900 border-2 border-gray-700 hover:border-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  <div className="aspect-square overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                    <img 
                      src={getSquareArtUrl(champ.id)} 
                      alt={champ.name}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="bg-black border-t border-gray-800 p-1 text-center">
                    <span className="text-[9px] md:text-[10px] lg:text-xs text-gray-300 font-pixel truncate block group-hover:text-white">
                      {champ.name}
                    </span>
                  </div>
                  
                  {/* Tooltip-like stats on hover - hidden on mobile */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 border border-white text-white text-xs font-vt323 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 hidden md:block">
                    {champ.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RolesView;