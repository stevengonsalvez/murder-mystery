import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const port = 3001;

// Verify API key exists
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY not found in environment variables');
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const MOCK_STORY = {
  "id": "story_1",
  "setting": {
    "location": "Thornfield Manor",
    "timePeriod": "Victorian Era, 1875",
    "description": "A grand estate nestled in the English countryside, known for its opulent parties and dark secrets. On this stormy night, the annual harvest ball was in full swing when tragedy struck.",
    "rooms": [
      "Grand Ballroom",
      "Library",
      "Drawing Room",
      "Dining Hall",
      "Conservatory",
      "Kitchen",
      "Wine Cellar",
      "Master Study",
      "Portrait Gallery",
      "Servants' Quarters"
    ]
  },
  "characters": [
    {
      "id": "char_1",
      "name": "Lord Edmund Blackwood",
      "occupation": "Estate Owner",
      "age": 58,
      "background": "A stern aristocrat facing mounting debts and family scandal",
      "secrets": ["Secretly selling family heirlooms", "Has a gambling addiction", "Planning to change his will"],
      "personality": ["Proud", "Authoritative", "Shrewd"],
      "relationships": [
        {
          "characterId": "char_2",
          "type": "family",
          "details": "His new young wife",
          "isPublicKnowledge": true
        }
      ],
      "alibi": "Was in his study reviewing estate papers",
      "knownInformation": ["Overheard an argument in the library"],
      "isVictim": true
    },
    {
      "id": "char_2",
      "name": "Lady Victoria Blackwood",
      "occupation": "Lady of the House",
      "age": 32,
      "background": "Recently married to Lord Blackwood, from a lesser noble family",
      "secrets": ["In love with someone else", "Discovered her husband's financial troubles"],
      "personality": ["Charming", "Ambitious", "Refined"],
      "relationships": [
        {
          "characterId": "char_1",
          "type": "family",
          "details": "Her husband",
          "isPublicKnowledge": true
        },
        {
          "characterId": "char_3",
          "type": "acquaintance",
          "details": "Childhood friend",
          "isPublicKnowledge": true
        }
      ],
      "alibi": "Was greeting guests in the ballroom",
      "knownInformation": ["Saw someone leave the study hurriedly"]
    },
    {
      "id": "char_3",
      "name": "Dr. James Morton",
      "occupation": "Family Physician",
      "age": 45,
      "background": "Long-time family doctor and confidant",
      "secrets": ["Knows about Lord Blackwood's illness", "Has gambling debts of his own"],
      "personality": ["Professional", "Observant", "Reserved"],
      "relationships": [],
      "alibi": "Attending to a guest who felt faint",
      "knownInformation": ["Lord Blackwood was not in good health"]
    },
    {
      "id": "char_4",
      "name": "Miss Eleanor Grey",
      "occupation": "Governess",
      "age": 28,
      "background": "Educated at finishing school, employed by the family for 3 years",
      "secrets": ["Overheard private family conversations", "In correspondence with a mysterious person"],
      "personality": ["Intelligent", "Discreet", "Perceptive"],
      "relationships": [],
      "alibi": "Was in the library organizing books",
      "knownInformation": ["Witnessed a secret meeting"]
    },
    {
      "id": "char_5",
      "name": "Mr. Thomas Richards",
      "occupation": "Butler",
      "age": 60,
      "background": "Served the family for 30 years, knows all the household secrets",
      "secrets": ["Knows about missing family jewels", "Has been selling information"],
      "personality": ["Proper", "Efficient", "Observant"],
      "relationships": [],
      "alibi": "Supervising the dinner service",
      "knownInformation": ["Noticed items missing from the study"],
      "isMurderer": true
    },
    {
      "id": "char_6",
      "name": "Lady Margaret Rothschild",
      "occupation": "Family Friend",
      "age": 55,
      "background": "Old money, close friend of the family",
      "secrets": ["Involved in business dealings with Lord Blackwood", "Knows about the family scandals"],
      "personality": ["Sophisticated", "Gossipy", "Sharp-witted"],
      "relationships": [],
      "alibi": "Playing cards in the drawing room",
      "knownInformation": ["Overhead a heated argument about money"]
    },
    {
      "id": "char_7",
      "name": "Mr. Oliver Bennett",
      "occupation": "Family Solicitor",
      "age": 50,
      "background": "Handles all legal matters for the Blackwoods",
      "secrets": ["Recently updated Lord Blackwood's will", "Aware of mounting debts"],
      "personality": ["Meticulous", "Professional", "Cautious"],
      "relationships": [],
      "alibi": "Discussing business in the library",
      "knownInformation": ["Has important documents in his briefcase"]
    },
    {
      "id": "char_8",
      "name": "Mrs. Sarah Parker",
      "occupation": "Head Housekeeper",
      "age": 52,
      "background": "Has served in the manor for 25 years",
      "secrets": ["Knows about secret passages", "Keeps a diary of household events"],
      "personality": ["Efficient", "Loyal", "Observant"],
      "relationships": [],
      "alibi": "Preparing rooms for overnight guests",
      "knownInformation": ["Found something suspicious in the fireplace"]
    },
    {
      "id": "char_9",
      "name": "Captain William Hawthorne",
      "occupation": "Recent Estate Neighbor",
      "age": 40,
      "background": "Retired military officer who recently purchased neighboring estate",
      "secrets": ["Has a mysterious past", "Interested in purchasing Thornfield"],
      "personality": ["Charming", "Strategic", "Mysterious"],
      "relationships": [],
      "alibi": "Smoking in the conservatory",
      "knownInformation": ["Noticed unusual activity around the estate"]
    },
    {
      "id": "char_10",
      "name": "Miss Rose Wilson",
      "occupation": "Lady's Maid",
      "age": 24,
      "background": "Personal maid to Lady Victoria",
      "secrets": ["Delivers secret messages", "Witnesses private conversations"],
      "personality": ["Quiet", "Attentive", "Clever"],
      "relationships": [],
      "alibi": "Attending to Lady Victoria's wardrobe",
      "knownInformation": ["Saw someone sneaking through the servants' hall"]
    }
  ],
  "victimId": "char_1",
  "murdererId": "char_5",
  "clues": [
    {
      "id": "clue_1",
      "type": "physical",
      "description": "A crumpled letter revealing significant gambling debts",
      "location": "Study",
      "visibilityConditions": [],
      "relevance": "critical"
    },
    {
      "id": "clue_2",
      "type": "physical",
      "description": "Empty poison bottle hidden behind books",
      "location": "Library",
      "visibilityConditions": [],
      "relevance": "critical"
    },
    {
      "id": "clue_3",
      "type": "testimonial",
      "description": "Report of raised voices from the study earlier that evening",
      "location": "Hallway",
      "visibilityConditions": [],
      "relevance": "background"
    },
    {
      "id": "clue_4",
      "type": "physical",
      "description": "Butler's glove with unusual stains",
      "location": "Wine Cellar",
      "visibilityConditions": ["clue_2"],
      "relevance": "critical"
    },
    {
      "id": "clue_5",
      "type": "circumstantial",
      "description": "Recently modified last will and testament",
      "location": "Master Study",
      "visibilityConditions": [],
      "relevance": "background"
    }
  ],
  "timeline": [
    {
      "id": "event_1",
      "timestamp": "1875-10-31T19:00:00Z",
      "description": "The harvest ball begins",
      "participants": ["char_1", "char_2", "char_3"],
      "location": "Grand Ballroom",
      "isPublicKnowledge": true
    },
    {
      "id": "event_2",
      "timestamp": "1875-10-31T20:30:00Z",
      "description": "Lord Blackwood seen entering his study",
      "participants": ["char_1"],
      "location": "Study",
      "isPublicKnowledge": true
    },
    {
      "id": "event_3",
      "timestamp": "1875-10-31T21:15:00Z",
      "description": "Argument overheard in the study",
      "participants": ["char_1", "char_5"],
      "location": "Study",
      "isPublicKnowledge": true
    },
    {
      "id": "event_4",
      "timestamp": "1875-10-31T22:00:00Z",
      "description": "Body discovered",
      "participants": ["char_2", "char_3"],
      "location": "Study",
      "isPublicKnowledge": true
    }
  ],
  "solution": "The butler, Mr. Thomas Richards, poisoned Lord Blackwood's evening brandy. After years of loyal service, he discovered he was to be dismissed due to the estate's financial troubles, and that Lord Blackwood planned to sell family heirlooms that the butler had been secretly stealing and replacing with replicas. Fearing exposure and destitution, he used his intimate knowledge of the household to commit the murder."
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate-story', async (req, res) => {
  try {
    console.log('Received request to generate story:', req.body);
    // Return mock story for now
    console.log('Returning mock story');
    res.json(MOCK_STORY);
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story', details: error.message });
  }
});

app.post('/api/character-response', async (req, res) => {
  try {
    console.log('Received request for character response:', req.body);
    const { character, question, askedBy, discoveredClues } = req.body;
    
    const response = await handleRateLimit(() =>
      anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        temperature: 0.8,
        messages: [{
          role: 'user',
          content: `You are ${character.name}, a ${character.occupation}.
            You are being questioned by ${askedBy.name}.
            Question: "${question}"
            
            Consider your background: ${character.background}
            Your personality traits: ${character.personality.join(', ')}
            Your secrets: ${character.secrets.join(', ')}
            Your alibi: ${character.alibi}
            
            Respond in character, considering what you know and your relationship with the questioner.
            ${character.isMurderer ? 'You are the murderer - lie convincingly but perhaps leave subtle clues.' : ''}
            `
        }]
      })
    );

    console.log('Successfully generated character response');
    res.json({ response: response.content[0].text });
  } catch (error) {
    console.error('Error generating character response:', error);
    res.status(500).json({ error: 'Failed to generate character response', details: error.message });
  }
});

const handleRateLimit = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (error?.status === 429) {
      console.log('Rate limit hit, waiting 60 seconds before retry...');
      await new Promise(resolve => setTimeout(resolve, 60 * 1000));
      return await operation();
    }
    throw error;
  }
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  - GET  /health');
  console.log('  - POST /api/generate-story');
  console.log('  - POST /api/character-response');
});