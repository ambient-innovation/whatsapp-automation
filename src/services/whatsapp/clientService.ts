import fs from "fs";
import {readFile} from "fs/promises";
import {Client, ClientSession} from "whatsapp-web.js";
import express from "express";
import config from "../../config";

const qrcode = require('qrcode-terminal')

export default class ClientService {
  private app: express.Application;

  constructor({app}: { app: express.Application }) {
    this.app = app
  }

  public async initClient() {
    // Use the saved values
    const sessionData = await ClientService.getSessionData()
    const clientOptions = sessionData ? {session: sessionData} : {}

    const client = new Client(clientOptions);
    if (!client) {
      console.error('Client was not instantiated!')
      return
    }

    await this.setWatchersOnClient({client})

    await client.initialize()

    this.app.locals.whatsAppClient = client
  }

  private static async getSessionData(): Promise<undefined | ClientSession> {
    // Load the session data if it has been previously saved
    let sessionData = undefined;

    if (fs.existsSync(config.sessionFilePath)) {
      const json = await readFile(config.sessionFilePath)
      // @ts-ignore
      sessionData = JSON.parse(json);
    }
    return sessionData
  }

  private async setWatchersOnClient({client}: { client: Client }) {
    // Save session values to the file upon successful auth
    client.on('authenticated', (session) => {
      // @ts-ignore
      client.session = session;
      fs.writeFile(config.sessionFilePath, JSON.stringify(session), (err) => err ? console.error(err) : undefined);
    });

    client.on('auth_failure', (err) => {
      console.log(err)
      // @ts-ignore
      client.options.session = false
      client.destroy()
      fs.unlinkSync(config.sessionFilePath)

      this.initClient()
    })

    client.on('qr', qr => {
      qrcode.generate(qr, {small: true});
    });

    client.on('ready', () => {
      console.log('Client is ready!');
    });
  }
}