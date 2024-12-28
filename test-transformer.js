import edgeTransformer from './edge_transformer.js';
import path from 'path';

// Mock a Source object
const source = {
  data: '', // For `.edge` files, `data` can be left empty as Edge reads the file from the filesystem
  filename: path.resolve('views/pages/movies.edge'), // Replace with the path to your test `.edge` file
  line: 1,
  column: 1,
  offset: 0,
};

async function testTransformer() {
  try {
    // Simulate the `html-validate` transformation process
    const generator = edgeTransformer.call({}, source);

    // Collect all transformed sources (should usually be one)
    for (const transformed of generator) {
      console.log('Transformed Output:', transformed.data);
    }
  } catch (error) {
    console.error('Error testing transformer:', error);
  }
}

testTransformer();
