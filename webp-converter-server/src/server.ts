import createApp from './config/app';
import { config } from './config/environment';
import { logRegisteredRoutes } from './utils/routeLogger';

const app = createApp();
const port = config.port;

app.listen(port, () => {
  console.log(`\n🚀 Server running at http://localhost:${port}`);

  logRegisteredRoutes(app);

  console.log(`📦 Environment: ${config.nodeEnv}`);
});
