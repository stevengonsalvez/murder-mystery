export interface Character {
  id: string;
  name: string;
  occupation: string;
  age: number;
  background: string;
  secrets: string[];
  personality: string[];
  relationships: Relationship[];
  alibi: string;
  knownInformation: string[];
  isMurderer?: boolean;
  isVictim?: boolean;
}

export interface Relationship {
  characterId: string;
  type: RelationType;
  details: string;
  isPublicKnowledge: boolean;
}

export type RelationType = 
  | 'friend'
  | 'enemy'
  | 'family'
  | 'colleague'
  | 'lover'
  | 'acquaintance'
  | 'rival';

export interface Clue {
  id: string;
  type: 'physical' | 'testimonial' | 'circumstantial';
  description: string;
  location: string;
  visibilityConditions: string[];
  relevance: 'critical' | 'misleading' | 'background';
  discoveredBy?: string[];
}

export interface Event {
  id: string;
  timestamp: Date;
  description: string;
  participants: string[];
  location: string;
  isPublicKnowledge: boolean;
}

export interface Setting {
  location: string;
  timePeriod: string;
  description: string;
  rooms: string[];
}

export interface MysteryStory {
  id: string;
  setting: Setting;
  characters: Character[];
  victimId: string;
  murdererId: string;
  clues: Clue[];
  timeline: Event[];
  solution: string;
}
