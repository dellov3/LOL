import React from 'react';
import { HistoryEntry, Lane } from '../types';
import { getSquareArtUrl } from '../services/riotService';

interface HistoryListProps {
  history: HistoryEntry[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) return null;

  const orderedLanes = [Lane.TOP, Lane.JUNGLE, Lane.MID, Lane.BOT, Lane.SUPPORT];
  const laneIcons: Record<Lane, string> = {
    [Lane.TOP]: '🛡️',
    [Lane.JUNGLE]: '⚔️',
    [Lane.MID]: '🔮',
    [Lane.BOT]: '🏹',
    [Lane.SUPPORT]: '❤️'
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 md:mt-12 border-t-4 border-gray-800 pt-6 md:pt-8 animate-fade-in">
      <div className="bg-gray-900 border-2 border-gray-700 p-3 md:p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
          <h3 className="text-green-500 font-pixel text-xs md:text-base tracking-wider">
            > SYSTEM LOGS // HISTORY
          </h3>
          <span className="text-gray-500 font-vt323 text-xs md:text-sm">
            {history.length} ENTRIES FOUND
          </span>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
          {history.map((entry) => (
            <div 
              key={entry.id} 
              className="bg-black/60 border border-gray-800 p-2 md:p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4 hover:border-green-500/50 transition-colors"
            >
              {/* Timestamp */}
              <div className="text-gray-400 font-vt323 text-sm md:text-lg whitespace-nowrap border-b md:border-b-0 md:border-r border-gray-800 pb-1 md:pb-0 pr-0 md:pr-4 w-full md:w-auto min-w-[100px]">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>

              {/* Team Icons */}
              <div className="flex items-center justify-between md:justify-center w-full md:w-auto md:flex-1 gap-1 md:gap-4">
                {orderedLanes.map((lane) => {
                  const champ = entry.team[lane];
                  if (!champ) return null;
                  
                  return (
                    <div key={`${entry.id}-${lane}`} className="group relative flex flex-col items-center">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-gray-600 overflow-hidden relative">
                        <img 
                          src={getSquareArtUrl(champ.id)} 
                          alt={champ.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                        {/* Lane Icon Overlay */}
                        <div className="absolute bottom-0 right-0 bg-black/80 text-[6px] md:text-[8px] p-0.5">
                            {laneIcons[lane]}
                        </div>
                      </div>
                      {/* Tooltip */}
                      <span className="hidden md:block absolute -top-6 bg-gray-800 text-white text-[10px] font-pixel px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-gray-600">
                        {champ.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryList;