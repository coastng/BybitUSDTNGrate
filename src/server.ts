import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { rateController } from './rate.controller';
import { errorHandler, notFound } from './middlewares/error.middleware';
import sls from 'serverless-http';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(helmet());
app.use(hpp());

app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
});

app.get('/api/rate', rateController);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// app.listen(4050, () => {
//     console.log(`Server is running on http://localhost:${4050}`);
// });

// export const server = sls(app);

export default app;
