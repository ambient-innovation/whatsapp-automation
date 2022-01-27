// Set the NODE_ENV to 'development' by default
import path from "path";

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  port: parseInt(process.env.PORT || '3000', 10),

  projectRoot: process.cwd(),
  srcRoot: path.join(process.cwd(), '/src'),

  sessionFilePath: path.join(process.cwd(), '/src/config/session.json'),

  // API configs
  api: {
    prefix: '/api',
  },
};