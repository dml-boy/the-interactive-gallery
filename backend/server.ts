import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import imageRoutes from './routes/imageRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/images', imageRoutes);       // Correct: /api/images/
app.use('/api/comments', commentRoutes);   // e.g. /api/comments/image/:id

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
