import {Response, Request, Router} from 'express'
import fs from "fs";
import {readFile} from "fs/promises";
import {Client} from "whatsapp-web.js";

const qrcode = require('qrcode-terminal')
const cron = require("node-cron");

// Instantiate router
const route = Router()

// Specifies, that a post-call on 'localhost:<YOUR_PORT>/start-whatsapp-bot' extracts the data from your form to local variables and responds with a statusCode 200
export default route.post(
  '/start-whatsapp-bot',
  async (req: Request, res: Response): Promise<any> => {
    // Extract data from body
    const {person, time, text} = req.body

    // Basic validation
    if (!person || !time || !text) {
      // If ANY of either person, time or text are not set, return with statusCode 400
      res.sendStatus(400)
      return
    }

    // time has a format of HH:MM (for example: '15:34')
    const timeArray = time.toString().split(':')  // splitting the time string at ':' results in an array: ['15', '34']
    const hour = parseInt(timeArray[0], 10)  // Cast the hour to an integer of base 10
    const minute = parseInt(timeArray[1], 10)  // Cast the minute to an integer of base 10

    // Initialise sessionData to be undefined by default. sessionData will be filled, if a previous session exists
    let sessionData = undefined;

    // Path where the session data will be stored
    const SESSION_FILE_PATH = './session.json';

    // Check, if a session.json file already exists...
    if (fs.existsSync(SESSION_FILE_PATH)) {
      // ...if it does, read its contents...
      const sessionContent = await readFile(SESSION_FILE_PATH)
      // @ts-ignore
      sessionData = JSON.parse(sessionContent);  // ...and parse the loaded content to json
    }

    // Client can be initialised with options, which contain a previous session.
    // If a session.json was found and its content was loaded, add them to the clientOptions object.
    const clientOptions = sessionData ? {session: sessionData} : {}

    // Instantiate a new client with either empty clientOptions or clientOptions containing a previous session
    const client = new Client(clientOptions);

    // Listen for successful authentication
    client.on('authenticated', (session) => {
      // @ts-ignore
      client.session = session;
      // Save session values to 'session.json'
      fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => err ? console.error(err) : undefined);
    });

    // Listen for qr event (triggered on first login)
    client.on('qr', qr => {
      // Generate a qr code and print it to the terminal
      qrcode.generate(qr, {small: true});
    });

    // Listen for ready event and log, that the client is ready
    client.on('ready', () => {
      console.log('Client is ready!');
    });

    // Initialise client
    await client.initialize();

    const chats = await client.getChats()  // Get all chats

    // Filter all chats for the chat, which name contains the person we specified in the form
    const filteredChats = chats.filter(chat => chat.name.includes(person))  // .filter() returns an array

    if (!filteredChats) return  // Return early if no chat was found

    // Get the first element of the filtered array (the array should mostly only consist of one chat object anyway,
    // depending on how broad or specified the person field was filled in the form
    const desiredChat = filteredChats[0]

    // Schedule the message to be sent at the specified time
    cron.schedule(`${minute} ${hour} * * *`, async () => {
      await desiredChat.sendMessage(text)  // Send a message to the chat
      console.log(`Successfully sent "${text}" to ${desiredChat.name}`);
      client?.destroy()  // Close the connection, once the chat was sent
    });

    res.send(`Message "${text}" was scheduled to be sent to ${desiredChat.name} at ${hour}:${minute}"`)
  }
)
