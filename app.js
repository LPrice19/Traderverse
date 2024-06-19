import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from '@xenova/transformers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;  // Define the port number

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load the pipeline asynchronously
const loadPipeline = async () => {
  const pipe = await pipeline('sentiment-analysis');

  // Define your routes after the pipeline is loaded
  app.post('/', async (req, res) => {
    try {
      const result = await pipe(req.body.text);
      res.json(result);
    } catch (error) {
      console.error('Error processing sentiment analysis:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'journal.html'));
  });

  // Start the server after the pipeline is loaded
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
};

// Call the function to load the pipeline and start the server
loadPipeline().catch(error => {
  console.error('Failed to load the pipeline:', error);
});
