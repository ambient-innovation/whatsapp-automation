import express, {Response, Request, Router} from 'express'
import ClientService from "../../services/whatsapp/clientService";
import SendMessageService from "../../services/whatsapp/sendMessageService";

const route = Router()

export default ({appRouter, app}: { appRouter: Router, app: express.Application }) => {
  appRouter.use('/whatsapp-bot', route);

  route.post(
    '/init',
    async (req: Request, res: Response): Promise<any> => {

      const service = new ClientService({app})
      await service.initClient()

      res.sendStatus(200)
    }
  )

  route.get(
    '/is-client-running',
    async (req: Request, res: Response): Promise<any> => {
      res.send({clientRunning: app.locals.whatsAppClient != undefined})
    }
  )

  route.post(
    '/send-message',
    async (req: Request, res: Response): Promise<any> => {
      const {person, time, text} = req.body

      // Basic validation
      if (!person || !text) {
        res.sendStatus(400)
        return
      }

      // text is not being sent?
      const service = new SendMessageService({
        app, person: String(person), time: String(time), text: String(text)
      })

      await service.sendMessage()

      res.send(`Message "${text}" was scheduled to be sent to ${person} at ${time}"`)
    }
  )
}
