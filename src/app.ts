import express, {Application} from "express"
import expressLoader from "./loaders/expressLoader";

async function startServer() {
  const app: Application = express()

  await expressLoader({app: app});
}

startServer()
