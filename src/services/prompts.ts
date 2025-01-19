import { MysteryStory, Character, Clue } from '../types/story';

export const createStoryPrompt = (options: {
  numberOfCharacters: number;
  timePeriod: string;
  locationType: string;
  theme: string;
}): string => {
  return `You are a master mystery writer creating an intricate murder mystery game. Create a detailed murder mystery with the following specifications:

Setting:
- Time period: ${options.timePeriod}
- Location type: ${options.locationType}
- Number of characters: ${options.numberOfCharacters}
- Theme: ${options.theme}

Requirements:
1. Create a cast of ${options.numberOfCharacters} distinct characters with unique:
   - Backgrounds
   - Motivations
   - Secrets
   - Relationships with others
2. Design a murder plot that is:
   - Complex but solvable
   - Has clear motives
   - Involves hidden relationships
   - Contains multiple red herrings
3. Create a set of clues that:
   - Can be discovered in different locations
   - Include physical evidence, testimonies, and circumstantial evidence
   - Some should be misleading (red herrings)
   - Should allow players to solve the mystery when properly combined

Please structure your response as a valid JSON object matching this TypeScript interface:

interface MysteryStory {
  id: string;
  setting: {
    location: string;
    timePeriod: string;
    description: string;
    rooms: string[];
  };
  characters: Array<{
    id: string;
    name: string;
    occupation: string;
    age: number;
    background: string;
    secrets: string[];
    personality: string[];
    relationships: Array<{
      characterId: string;
      type: 'friend' | 'enemy' | 'family' | 'colleague' | 'lover' | 'acquaintance' | 'rival';
      details: string;
      isPublicKnowledge: boolean;
    }>;
    alibi: string;
    knownInformation: string[];
    isMurderer?: boolean;
    isVictim?: boolean;
  }>;
  victimId: string;
  murdererId: string;
  clues: Array<{
    id: string;
    type: 'physical' | 'testimonial' | 'circumstantial';
    description: string;
    location: string;
    visibilityConditions: string[];
    relevance: 'critical' | 'misleading' | 'background';
  }>;
  timeline: Array<{
    id: string;
    timestamp: string;
    description: string;
    participants: string[];
    location: string;
    isPublicKnowledge: boolean;
  }>;
  solution: string;
}

Ensure all IDs are unique and relationships between characters reference valid character IDs.`;
};

export const createCharacterResponsePrompt = (params: {
  character: Character;
  question: string;
  askedBy: Character;
  discoveredClues: Clue[];
}): string => {
  const cluesContext = params.discoveredClues.map(c => c.description).join('\n');
  
  return `You are role-playing as ${params.character.name}, a character in a murder mystery. Here are your characteristics:

Background: ${params.character.background}
Occupation: ${params.character.occupation}
Personality: ${params.character.personality.join(', ')}
Secrets: ${params.character.secrets.join(', ')}
Alibi: ${params.character.alibi}

You are being questioned by ${params.askedBy.name} (${params.askedBy.occupation}).
Your relationship with them: ${params.character.relationships.find(r => 
  r.characterId === params.askedBy.id
)?.details || 'No specific relationship'}

The following clues have been discovered:
${cluesContext}

The question you are being asked is: "${params.question}"

${params.character.isMurderer ? 
  'You are the murderer. You must lie convincingly while potentially leaving subtle clues that could be noticed by very astute investigators.' : 
  'You are innocent of the murder, but you may have your own secrets to protect.'}

Respond in character, considering:
1. Your personality and background
2. Your relationship with the questioner
3. Your secrets and what you want to hide
4. What you genuinely know about the murder
5. Your alibi and whether it's true

Keep your response natural and conversational, as if speaking in character. Don't be too obvious about hiding information - be subtle and believable.`;
};

export const createHintPrompt = (params: {
  discoveredClues: Clue[];
  unsolvedClues: Clue[];
  interactionHistory: Array<{question: string; answer: string}>;
  story: MysteryStory;
}): string => {
  return `You are a mystery game master providing a hint to a player who might be stuck. Here's their current progress:

Discovered Clues:
${params.discoveredClues.map(c => c.description).join('\n')}

Recent Interactions:
${params.interactionHistory.slice(-3).map(i => 
  `Q: ${i.question}\nA: ${i.answer}`
).join('\n')}

There are still these undiscovered clues (DO NOT REVEAL DIRECTLY):
${params.unsolvedClues.map(c => c.type).join(', ')}

Generate a subtle hint that:
1. Points them in a useful direction without giving away solutions
2. Helps them notice connections they might have missed
3. Suggests productive actions they could take
4. Maintains the mystery and enjoyment of discovery

Keep the hint subtle and suggestive rather than explicit. Help them think about the case in new ways.`;
};