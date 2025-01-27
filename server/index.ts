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

// Configure CORS with dynamic origin handling
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  /\.ngrok-free\.app$/  // This will match any ngrok subdomain
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mock story data with fixed timestamps
const MOCK_STORY = {
  id: 'story_1',
  setting: {
    location: 'Thornfield Manor',
    timePeriod: 'Victorian Era, 1875',
    description: 'A grand estate nestled in the English countryside, known for its opulent parties and dark secrets. On this stormy night, the annual harvest ball was in full swing when tragedy struck.',
    rooms: [
      'Grand Ballroom',
      'Library',
      'Drawing Room',
      'Dining Hall',
      'Conservatory',
      'Kitchen',
      'Wine Cellar',
      'Master Study',
      'Portrait Gallery',
      'Servants\' Quarters'
    ]
  },
  characters: [
    {
      id: 'char_1',
      name: 'Lord Edmund Blackwood',
      occupation: 'Estate Owner',
      age: 58,
      background: 'A stern aristocrat facing mounting debts and family scandal',
      secrets: ['Secretly selling family heirlooms', 'Has a gambling addiction', 'Planning to change his will'],
      personality: ['Proud', 'Authoritative', 'Shrewd'],
      relationships: [
        {
          characterId: 'char_2',
          type: 'family',
          details: 'His new young wife',
          isPublicKnowledge: true
        }
      ],
      alibi: 'Was in his study reviewing estate papers',
      knownInformation: ['Overheard an argument in the library'],
      isVictim: true
    },
    {
      id: 'char_2',
      name: 'Lady Victoria Blackwood',
      occupation: 'Lady of the House',
      age: 32,
      background: 'Recently married to Lord Blackwood, from a lesser noble family',
      secrets: ['In love with someone else', 'Discovered her husband\'s financial troubles'],
      personality: ['Charming', 'Ambitious', 'Refined'],
      relationships: [
        {
          characterId: 'char_1',
          type: 'family',
          details: 'Her husband',
          isPublicKnowledge: true
        },
        {
          characterId: 'char_3',
          type: 'acquaintance',
          details: 'Childhood friend',
          isPublicKnowledge: true
        }
      ],
      alibi: 'Was greeting guests in the ballroom',
      knownInformation: ['Saw someone leave the study hurriedly']
    },
    {
      id: 'char_3',
      name: 'Mr. Thomas Richards',
      occupation: 'Butler',
      age: 60,
      background: 'Served the family for 30 years',
      secrets: ['Knows about missing family jewels', 'Has been selling information'],
      personality: ['Proper', 'Efficient', 'Observant'],
      relationships: [],
      alibi: 'Supervising the dinner service',
      knownInformation: ['Noticed items missing from the study'],
      isMurderer: true
    }
  ],
  victimId: 'char_1',
  murdererId: 'char_3',
  clues: [
    {
      id: 'clue_1',
      type: 'physical',
      description: 'A crumpled letter revealing significant gambling debts',
      location: 'Study',
      visibilityConditions: [],
      relevance: 'critical'
    },
    {
      id: 'clue_2',
      type: 'testimonial',
      description: 'Report of raised voices from the study earlier that evening',
      location: 'Hallway',
      visibilityConditions: [],
      relevance: 'background'
    }
  ],
  timeline: [
    {
      id: 'event_1',
      timestamp: '1875-10-31T19:00:00Z',
      description: 'The harvest ball begins',
      participants: ['char_1', 'char_2', 'char_3'],
      location: 'Grand Ballroom',
      isPublicKnowledge: true
    },
    {
      id: 'event_2',
      timestamp: '1875-10-31T20:30:00Z',
      description: 'Lord Blackwood seen entering his study',
      participants: ['char_1'],
      location: 'Study',
      isPublicKnowledge: true
    }
  ],
  solution: 'The butler, Mr. Thomas Richards, poisoned Lord Blackwood\'s evening brandy. After years of loyal service, he discovered he was to be dismissed due to the estate\'s financial troubles, and that Lord Blackwood planned to sell family heirlooms that the butler had been secretly stealing and replacing with replicas. Fearing exposure and destitution, he used his intimate knowledge of the household to commit the murder.'
};

app.post('/api/generate-story', async (req, res) => {
  try {
    console.log('Received request to generate story:', req.body);
    console.log('Request origin:', req.headers.origin);

    // Return mock story with timestamp conversion
    const storyWithDates = {
      ...MOCK_STORY,
      timeline: MOCK_STORY.timeline.map(event => ({
        ...event,
        timestamp: new Date(event.timestamp)
      }))
    };

    console.log('Sending response:', JSON.stringify(storyWithDates, null, 2));
    res.json(storyWithDates);
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story', details: error.message });
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('CORS enabled with allowed origins:', allowedOrigins);
  console.log('Available endpoints:');
  console.log('  - GET  /health');
  console.log('  - POST /api/generate-story');
});
