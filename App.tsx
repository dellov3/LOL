import React, { useState, useEffect } from 'react';
import { fetchChampionData, getRandomChampionForLane } from './services/riotService';
import { ChampionData, TeamComposition, Lane, HistoryEntry } from './types';
import ChampionCard from './components/ChampionCard';
import RolesView from './components/RolesView';
import HistoryList from './components/HistoryList';

type Tab = 'generator' | 'roles';

function App() {
  const [champions, setChampions] = useState<Record<string, ChampionData>>({});
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [team, setTeam] = useState<TeamComposition | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('generator');
  
  // Add state to track if we are rolling (generating)
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchChampionData();
      setChampions(data);
      setIsLoadingData(false);
    };
    loadData();
  }, []);

  const handleRollTeam = async () => {
    if (Object.keys(champions).length === 0 || isRolling) return;

    setTeam(null);
    setIsRolling(true);

    try {
      // Use pure randomizer for maximum variety (solves AI repetition issue)
      const usedIds = new Set<string>();
      
      // Generate sequentially to ensure unique champs if possible (though across lanes duplicates are technically allowed in Blind Pick, usually we want unique)
      const top = getRandomChampionForLane(champions, Lane.TOP, usedIds); 
      if(top) usedIds.add(top.id);
      
      const jg = getRandomChampionForLane(champions, Lane.JUNGLE, usedIds); 
      if(jg) usedIds.add(jg.id);
      
      const mid = getRandomChampionForLane(champions, Lane.MID, usedIds); 
      if(mid) usedIds.add(mid.id);
      
      const bot = getRandomChampionForLane(champions, Lane.BOT, usedIds); 
      if(bot) usedIds.add(bot.id);
      
      const sup = getRandomChampionForLane(champions, Lane.SUPPORT, usedIds); 
      if(sup) usedIds.add(sup.id);

      const newTeam: TeamComposition = {
        [Lane.TOP]: top,
        [Lane.JUNGLE]: jg,
        [Lane.MID]: mid,
        [Lane.BOT]: bot,
        [Lane.SUPPORT]: sup
      };

      // Artificial delay for effect
      await new Promise(resolve => setTimeout(resolve, 600));

      setTeam(newTeam);
      
      // Add to history
      setHistory(prev => [{
        id: Date.now(),
        timestamp: Date.now(),
        team: newTeam
      }, ...prev]);

    } catch (e) {
      console.error("Error rolling team", e);
    } finally {
      setIsRolling(false);
    }
  };

  return (
    <div className="min-h-screen p-2 md:p-8 pb-20 flex flex-col items-center crt-flicker relative overflow-x-hidden">
      {/* Retro Header */}
      <header className="text-center mb-4 md:mb-8 z-10 w-full">
        <h1 className="text-3xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-pixel mb-2 md:mb-4 drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)] leading-tight">
          RIT0 RANDOMIZER
        </h1>
        <div className="inline-block bg-gray-800 px-2 md:px-4 py-1 md:py-2 border border-green-500 transform -skew-x-12 mb-4 md:mb-6">
          <p className="text-green-400 font-vt323 text-base md:text-xl transform skew-x-12 uppercase tracking-widest">
             Patch 15.22.1 // META LOADED
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-2 md:space-x-4 w-full max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 px-2 py-2 md:px-6 md:py-3 font-pixel text-[10px] md:text-sm transition-all border-2 transform active:translate-y-1 ${
              activeTab === 'generator' 
                ? 'bg-indigo-700 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-indigo-500 hover:text-indigo-400'
            }`}
          >
            TEAM GENERATOR
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 px-2 py-2 md:px-6 md:py-3 font-pixel text-[10px] md:text-sm transition-all border-2 transform active:translate-y-1 ${
              activeTab === 'roles' 
                ? 'bg-blue-700 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-blue-500 hover:text-blue-400'
            }`}
          >
            ALL ROLES
          </button>
        </div>
      </header>

      {/* Main Control */}
      <div className="z-10 w-full max-w-7xl flex flex-col items-center min-h-[600px]">
        
        {isLoadingData ? (
          <div className="text-green-500 font-pixel animate-pulse text-xl mt-20 flex flex-col items-center">
             <span>LOADING CHAMPION DATA...</span>
             <span className="font-vt323 text-sm mt-2 text-green-700">ACCESSING MAINFRAME...</span>
          </div>
        ) : (
          <>
            {activeTab === 'generator' && (
              <div className="w-full flex flex-col items-center animate-fade-in">
                {/* Champions Grid */}
                <div className="flex flex-wrap w-full justify-center mb-6 md:mb-10 gap-y-2 md:gap-y-6 -mx-1">
                  <ChampionCard champion={team ? team[Lane.TOP] : null} lane={Lane.TOP} delay={0} />
                  <ChampionCard champion={team ? team[Lane.JUNGLE] : null} lane={Lane.JUNGLE} delay={200} />
                  <ChampionCard champion={team ? team[Lane.MID] : null} lane={Lane.MID} delay={400} />
                  <ChampionCard champion={team ? team[Lane.BOT] : null} lane={Lane.BOT} delay={600} />
                  <ChampionCard champion={team ? team[Lane.SUPPORT] : null} lane={Lane.SUPPORT} delay={800} />
                </div>

                {/* Action Button */}
                <button
                  onClick={handleRollTeam}
                  disabled={isRolling}
                  className="group relative inline-flex items-center justify-center px-8 py-3 md:px-10 md:py-4 overflow-hidden font-pixel font-bold text-white transition-all duration-300 bg-indigo-600 rounded-none hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-indigo-900 hover:border-indigo-950 active:border-0 active:mt-1 w-full md:w-auto"
                >
                  <span className="absolute top-0 left-0 w-full h-full -mt-1 -ml-1 transition-all duration-300 bg-purple-600 rounded-none group-hover:mt-0 group-hover:ml-0"></span>
                  <span className="relative text-xs md:text-base z-10 uppercase">
                    GENERATE TEAM
                  </span>
                </button>

                {/* History Section */}
                <div className="w-full px-1 md:px-0">
                  <HistoryList history={history} />
                </div>
              </div>
            )}

            {activeTab === 'roles' && (
              <div className="w-full px-1 md:px-0">
                <RolesView champions={champions} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;