import express from 'express';
import { createServer, getServerPort } from '@devvit/web/server';
import routes from './routes';
import { errorHandler, notFoundHandler, requestLogger } from './middleware';

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

// Request logging
app.use(requestLogger);

// Routes
app.use(routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
