import express, {Router} from 'express';
import whatsAppBot from "./startWhatsAppBotRoute";

// guaranteed to get dependencies
export default ({app}: { app: express.Application }) => {
  const appRouter = Router();
  whatsAppBot({appRouter, app});
  return appRouter
}