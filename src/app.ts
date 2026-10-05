import express from 'express';
const app: express.Application = express();

app.get('/', (_req: express.Request, res: express.Response) => {
  res.send('Hello, World!');
});

export default app;