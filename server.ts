import app from './src/app.js';
import 'dotenv/config';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error('PORT is not defined in the environment variables');
}

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error: unknown) => {
  console.error(
    `Server startup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
  );
  process.exitCode = 1;
});
