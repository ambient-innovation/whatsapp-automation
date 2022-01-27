import {Router} from 'express';
import index from './indexRoute';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  index(app)

  return app
}