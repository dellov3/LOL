import { ChampionData, RiotResponse, Lane } from '../types';

const DATA_DRAGON_VERSION = '15.22.1';
const DATA_URL = `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/data/en_US/champion.json`;

// A comprehensive snapshot of Meta Roles for S14/15
// Updated to be very broad to ensure variety in randomization
const META_ROLES: Record<Lane, string[]> = {
  [Lane.TOP]: [
    "Aatrox", "Akali", "Ambessa", "Aurora", "Camille", "Cassiopeia", "ChoGath", "Darius", "DrMundo", "Fiora", "Gangplank", 
    "Garen", "Gnar", "Gragas", "Gwen", "Heimerdinger", "Illaoi", "Irelia", "Jax", "Jayce", "KSante", "Karma",
    "Kayle", "Kennen", "Kled", "Lillia", "Malphite", "Maokai", "Mordekaiser", "Nasus", "Olaf", "Ornn", "Pantheon", "Poppy", 
    "Quinn", "Renekton", "Rengar", "Riven", "Rumble", "Ryze", "Sejuani", "Sett", "Shen", "Singed", "Sion", "Smolder", "TahmKench", 
    "Teemo", "Tryndamere", "TwistedFate", "Udyr", "Urgot", "Vayne", "Viktor", "Vladimir", "Volibear", "Warwick", "Wukong", 
    "Yasuo", "Yone", "Yorick", "Zac"
  ],
  [Lane.JUNGLE]: [
    "Amumu", "BelVeth", "Brand", "Briar", "Camille", "Diana", "DrMundo", "Ekko", "Elise", "Evelynn", "Fiddlesticks", "Gragas", "Graves", 
    "Gwen", "Hecarim", "Ivern", "JarvanIV", "Jax", "Karthus", "Kayn", "KhaZix", "Kindred", "LeeSin", 
    "Lillia", "MasterYi", "Maokai", "Morgana", "Naafiri", "Nidalee", "Nocturne", "Nunu", "Olaf", "Pantheon", "Poppy", "Qiyana", "Rammus", 
    "RekSai", "Rengar", "Rumble", "Sejuani", "Shaco", "Shen", "Shyvana", "Skarner", "Sylas", "Taliyah", "Talon", "Teemo", "Trundle", 
    "Twitch", "Udyr", "Vi", "Viego", "Volibear", "Warwick", "Wukong", "XinZhao", "Zac", "Zed", "Zyra"
  ],
  [Lane.MID]: [
    "Ahri", "Akali", "Akshan", "Anivia", "Annie", "AurelionSol", "Aurora", "Azir", "Brand", "Cassiopeia", 
    "ChoGath", "Corki", "Diana", "Ekko", "Ezreal", "Fizz", "Galio", "Gangplank", "Garen", "Gragas", "Hwei", "Irelia", "Jayce", "Karma", 
    "Kassadin", "Katarina", "Kayle", "Kennen", "Kled", "KogMaw", "LeBlanc", "Lissandra", "Lucian", "Lux", "Malphite", "Malzahar", "Naafiri", 
    "Nasus", "Neeko", "Orianna", "Pantheon", "Qiyana", "Renekton", "Rumble", "Ryze", "Seraphine", "Sett", "Smolder", "Swain", "Sylas", "Syndra", "Taliyah", 
    "Talon", "Tristana", "Tryndamere", "TwistedFate", "Varus", "Veigar", "VelKoz", "Vex", "Viktor", "Vladimir", "Xerath", 
    "Yasuo", "Yone", "Zed", "Ziggs", "Zilean", "Zoe"
  ],
  [Lane.BOT]: [
    "Aphelios", "Ashe", "Brand", "Caitlyn", "Cassiopeia", "ChoGath", "Draven", "Ezreal", "Hwei", "Jhin", "Jinx", "KaiSa", "Kalista", "Karthus", 
    "KogMaw", "Lucian", "MissFortune", "Nilah", "Samira", "Senna", "Seraphine", "Sivir", "Smolder", "Swain", "Syndra", "TahmKench", 
    "Tristana", "Twitch", "Varus", "Vayne", "Veigar", "Xayah", "Yasuo", "Zeri", "Ziggs"
  ],
  [Lane.SUPPORT]: [
    "Alistar", "Amumu", "Annie", "Ashe", "Bard", "Blitzcrank", "Brand", "Braum", "Camille", "Fiddlesticks", "Galio", "Gragas", "Heimerdinger", "Hwei", 
    "Janna", "Karma", "LeBlanc", "Leona", "Lulu", "Lux", "Malphite", "Maokai", "Milio", "MissFortune", "Morgana", "Nami", "Nautilus", 
    "Neeko", "Pantheon", "Poppy", "Pyke", "Rakan", "Rell", "Renata", "Senna", "Seraphine", "Sett", "Shaco", "Shen", 
    "Sona", "Soraka", "Swain", "TahmKench", "Taric", "Thresh", "Twitch", "VelKoz", "Xerath", "Yuumi", "Zac", "Zilean", 
    "Zoe", "Zyra"
  ]
};

export const fetchChampionData = async (): Promise<Record<string, ChampionData>> => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch champion data: ${response.statusText}`);
    }
    const json: RiotResponse = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching data dragon:", error);
    return {};
  }
};

export const getLoadingArtUrl = (championId: string): string => {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg`;
};

export const getSquareArtUrl = (championId: string): string => {
  return `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img/champion/${championId}.png`;
};

export const findChampionByNameOrId = (champions: Record<string, ChampionData>, name: string): ChampionData | null => {
  const champList = Object.values(champions) as ChampionData[];
  const lowerName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return champList.find(c => {
    const cId = c.id.toLowerCase();
    const cName = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cId === lowerName || cName === lowerName;
  }) || null;
};

export const filterChampionsByLane = (champions: ChampionData[], lane: Lane): ChampionData[] => {
  const validIds = new Set(META_ROLES[lane].map(id => id.toLowerCase()));
  
  return champions.filter(champ => {
    return validIds.has(champ.id.toLowerCase());
  });
};

export const getRandomChampionForLane = (allChampions: Record<string, ChampionData>, lane: Lane, excludeIds: Set<string>): ChampionData | null => {
  const championList = Object.values(allChampions) as ChampionData[];
  
  // Use the detailed Meta Map
  let candidates = filterChampionsByLane(championList, lane).filter(c => !excludeIds.has(c.id));
  
  // Fallback logic if map fails (unlikely with comprehensive map)
  if (candidates.length === 0) {
    candidates = championList.filter(champ => {
       const tags = champ.tags;
       switch (lane) {
          case Lane.TOP: return tags.includes('Fighter') || tags.includes('Tank');
          case Lane.JUNGLE: return tags.includes('Assassin') || tags.includes('Fighter');
          case Lane.MID: return tags.includes('Mage') || tags.includes('Assassin');
          case Lane.BOT: return tags.includes('Marksman');
          case Lane.SUPPORT: return tags.includes('Support');
          default: return true;
       }
    }).filter(c => !excludeIds.has(c.id));
  }
  
  if (candidates.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
};