import { ensureEnv } from '#utils/env';
import { createApp } from './createApp.js';

const env = ensureEnv();

const app = createApp({}, {});

app.listen(env.PORT || 3008, () => {
  console.log(`Server is running on http://localhost:${env.PORT || 3008}`);
});
