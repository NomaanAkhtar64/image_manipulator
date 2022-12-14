import express from 'express';
import dotenv from 'dotenv';
import { ImageRouter } from './routes/image';
import cors from 'cors';

dotenv.config({ path: './dev.env' });

const app = express();

app.use(cors());
app.use(express.static('./media'));

app.use('/api/image/', ImageRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`);
});
