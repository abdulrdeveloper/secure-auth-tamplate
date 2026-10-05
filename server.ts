import app from './src/app.js';
import 'dotenv/config';

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error('PORT is not defined in the environment variables');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
