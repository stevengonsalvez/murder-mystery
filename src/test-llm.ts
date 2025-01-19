import { LLMService } from './services/llm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testLLMIntegration() {
  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY not found in environment variables');
    console.error('Please create a .env file with your API key:');
    console.error('ANTHROPIC_API_KEY=your_api_key_here');
    process.exit(1);
  }

  const llmService = new LLMService(process.env.ANTHROPIC_API_KEY);

  console.log('Generating mystery story...');
  
  try {
    const story = await llmService.generateStory({
      numberOfCharacters: 6,
      timePeriod: 'Victorian Era',
      locationType: 'Country Manor',
      theme: 'Inheritance Dispute'
    });

    console.log('Generated Story:');
    console.log(JSON.stringify(story, null, 2));

    // Test character response
    console.log('\nTesting character response...');
    const character = story.characters[0];
    const askedBy = story.characters[1];
    const response = await llmService.generateCharacterResponse({
      character,
      askedBy,
      question: "Where were you on the night of the murder?",
      discoveredClues: story.clues.slice(0, 2) // Use first two clues as discovered
    });

    console.log('Character Response:');
    console.log(response);

  } catch (error) {
    console.error('Error during test:', error);
  }
}

testLLMIntegration().catch(console.error);