export interface ChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  tags: string[];
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  partype: string;
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
}

export interface RiotResponse {
  type: string;
  format: string;
  version: string;
  data: Record<string, ChampionData>;
}

export enum Lane {
  TOP = 'TOP',
  JUNGLE = 'JUNGLE',
  MID = 'MID',
  BOT = 'BOT',
  SUPPORT = 'SUPPORT'
}

export interface TeamComposition {
  [Lane.TOP]: ChampionData | null;
  [Lane.JUNGLE]: ChampionData | null;
  [Lane.MID]: ChampionData | null;
  [Lane.BOT]: ChampionData | null;
  [Lane.SUPPORT]: ChampionData | null;
}

export interface AnalysisResult {
  teamName: string;
  rating: number;
  winCondition: string;
  weakness: string;
}

export interface HistoryEntry {
  id: number;
  timestamp: number;
  team: TeamComposition;
}