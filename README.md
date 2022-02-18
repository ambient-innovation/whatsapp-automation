# Easily automate sending WhatsApp Messages

Take your first steps into automating processes!

**NOTE:** WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally
safe and you might be blocked!

## Quick Links

### dependencies

* [express](https://github.com/expressjs/express)
* [node-cron](https://github.com/node-cron/node-cron)
* [pug](https://github.com/pugjs/pug/tree/master/packages/pug)
* [qrcode-terminal](https://github.com/gtanner/qrcode-terminal)
* [ts-node](https://github.com/TypeStrong/ts-node)
* [typescript](https://github.com/Microsoft/TypeScript)
* [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js/)

### tools used

* [jQuery](https://jquery.com/)
* [Bootstrap](https://getbootstrap.com/)

## Process

1. First, create your project folder and run `npm init` to initialise the project.


2. Install [TypeScript](https://www.typescriptlang.org/) `npm i typescript`


3. Run `tsc -init` in your projects root folder to initialise TypeScript and create a default configuration file.


4. Make sure, that the following values are set in your typescript configuration file:
    * `"rootDir": "./src"`
    * `"resolveJsonModule": true`
    * `"types": ["node"]`


5. Install express and ts-node: `npm i express ts-node`


6. Install types for express as devDependency: `npm i @types/express --save-dev `

---

🙌 **Now that you have set up your project, we are ready to write our first lines of code** 🙌

---

7. Create a directory called `src` in your projects root.


8. Create a file called `index.ts` in your `src` folder:

```ts
// src/index.ts
import express, {Application} from "express"
import indexRoute from './routes/index'  // This line will initially cause an error, beacuse there is no 'routes/index.ts' yet

// Initialise your app
const app: Application = express()

// Specify the port, your app will be running on
const PORT: number = 8000

// Transforms the raw string of req.body into json
app.use(express.json())
app.use(express.urlencoded({extended: true}));

// Use routes, we will specify in 'routes/index.ts'
app.use(indexRoute)

// Listen for any activity on our specified port
app.listen(PORT, () => console.log(`Server is running successfully at ${PORT}`))
```

9. In your src folder, create a directory called `routes`


10. Create a file `index.ts` in your `routes` folder:

```ts
// src/routes/index.ts
import {Response, Request, Router} from 'express'

// Instantiate router
const route = Router()

// Specifies, that a get-call on 'localhost:<YOUR_PORT>/' will return 'An answer'
export default route.get('/', async (req: Request, res: Response): Promise<any> => res.send('An answer'))
```

11. In the `scripts` section of your `package.json`, add the following script: `"start": "ts-node ./src/index.ts"`

    Running this script will start your server. You can execute this script by typing `npm start` in your terminal.


12. If you now navigate to `localhost:<YOUR_PORT>/` you'll see `An answer` displayed.

---

🥳 **Congratulations! You just created a working server!** 🥳

---

Obviously, our current site is not really a design masterpiece and looks quite bland. Let's change that!

13. Install the templating engine `pug` - `npm i pug`


14. Add the following lines to your `index.ts` (in your `src` folder):

```ts
// src/index.ts
// ...
import * as path from "path";

// ...
// View engine setup
app.set('views', path.join(__dirname, 'views'));  // Specifies, that the projects views (ie templates) will be in the current directory (__dirname) in a folder called 'views'
app.set('view engine', 'pug');  // Set the projects view engine (ie templating engine) to be 'pug'
```

15. Now, create a `views` directory in your `src` folder and add an `index.pug` file:

🎨 **Note:** We will style our site with [Bootstrap](https://getbootstrap.com/)

```jade
// src/views/index.pug
doctype html
html
    head
        title= 'WhatsApp Bot'
        // Bootstrap CSS
        link(href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous")
    body
        div(class='container')
            h1= 'WhatsApp Bot'

            // Form for specifying a person to send a message to, specify a time at which the message will be sent and a message to send
            form(id='whatsapp-form')
                div(class="mb-3")
                    label(for="person" class="form-label") Person
                    input(name="person" type="text" class="form-control" id="person" aria-describedby="personHelp")

                div(class="mb-3")
                    label(for="time" class="form-label") Time
                    input(name="time" type="text" class="form-control" id="time" aria-describedby="timeHelp")
                    // Help text
                    div(id="emailHelp" class="form-text") In Format HH:MM

                div(class="mb-3")
                    label(for="text" class="form-label") Text
                    textarea(name="text" class="form-control" id="text" rows=3 aria-describedby="textHelp")

                button(class='btn btn-primary' type='button' id="submit-btn" title="Start WhatsApp Bot" onclick='onButtonClick()') Start WhatsApp Bot

        // Bootstrap JS
        script(src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous")
        // jQuery 
        script(src='https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js')
    
        script.
            function onButtonClick() {
                // Send values of elements to 'localhost:<YOUR_PORT>/start-whatsapp-bot'
                $.post('start-whatsapp-bot', $('#whatsapp-form').serialize())
            }
```

16. In order for our view to be "visible" (ie: rendered) we need to slightly adjust `routes/index.ts`:

```ts
// src/routes/index.ts

//...
// Specifies, that a get-call on 'localhost:<YOUR_PORT>/' will return the 'index.pug' template
export default route.get('/', async (req: Request, res: Response): Promise<any> => res.render('index'))
```

---

💃 You now have a working form which is able to send data to your backend 🕺

The data however is not being handled... A route is missing 😐

---

17. Create a file `startWhatsAppBot.ts` in your `routes` folder:

```ts
// src/routes/startWhatsAppBot.ts
import {Response, Request, Router} from 'express'

// Instantiate router
const route = Router()

// Specifies, that a post-call on 'localhost:<YOUR_PORT>/start-whatsapp-bot' extracts the data from your form to local variables and responds with a statusCode 200
export default route.post(
  '/start-whatsapp-bot',
  async (req: Request, res: Response): Promise<any> => {
    // Extract data from body
    const {person, time, text} = req.body

    // Respond with a statusCode 200
    res.sendStatus(200)
  }
)
```

18. For the route to be accessible we need to adjust `src/index.ts`:

```ts
// src/index.ts
// ...
import indexRoute from './routes/index'
import startWhatsAppBotRoute from './routes/startWhatsAppBot'

// ...
app.use(indexRoute)
app.use(startWhatsAppBotRoute)
// ...
```

19. Now we can submit the form with data and receive the values in our backend!

---

Alright, so far so good! 😍 We have a form which we can fill out and submit, and we receive the data in our backend.

Now for that automated whatsapp message... 🤔

---

20. First, lets add basic validation to our form data:

```ts
// src/routes/startWhatsAppBot.ts

//...

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

    // Respond with a statusCode 200
    res.sendStatus(200)
  }
)
```

21. Having done that, let's extract the hour and minute from our time input:

```ts
// src/routes/startWhatsAppBot.ts

//...

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

// Respond with a statusCode 200
res.sendStatus(200)
```

22. Install the necessary package for accessing and navigating whatsapp: `npm i whatsapp-web.js`


23. Extend `startWhatsAppBot.ts` to instantiate a whatsApp client and add eventListeners:

```ts
// src/routes/startWhatsAppBot.ts

//...

import {Client} from "whatsapp-web.js";
import fs from "fs";

//...

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Instantiate a new client
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
  // Log the received qr data
  console.log(qr)
});

// Listen for ready event and log, that the client is ready
client.on('ready', () => {
  console.log('Client is ready!');
});

// Initialise client
await client.initialize();
```

24. If we now submit our form we will see, that the client is successfully initialised and that the qr event is
    triggered.

    However, the received qr data is not readable for us, and we can not use it to log in.

    Wouldn't it be nice, if we could properly render the qr data to a qr code we can scan with our phone?


25. The package `qrcode-terminal` takes care of exactly that! Install it with: `npm i qrcode-terminal`


26. Modify the qr event listener:

```ts
// src/routes/startWhatsAppBot.ts

//...

const qrcode = require('qrcode-terminal')

//...

// Listen for qr event (triggered on first login)
client.on('qr', qr => {
  // Generate a qr code and print it to the terminal
  qrcode.generate(qr, {small: true});
});
```

27. If you now submit your form, you will see a qr code in your terminal, which you can scan with your phone to log into
    WhatsApp.


28. **BUT:** You might realise, you have to log in _every time_ you submit your form. This is where `session.json` comes
    into play.


29. Modify `startWhatsAppBot.ts` to try to read the stored session from our `session.json`:

```ts
// src/routes/startWhatsAppBot.ts

//...

import {readFile} from "fs/promises";

//...

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
```

---

🥳 Now, we don't have to log in every time we start our programm 🥳

With the initialised client, we can access our contacts, chats and so much more!

For more info on what the client can do, refer to the [whatsapp-web.js docs](https://docs.wwebjs.dev/).

Let's dive into the functionalities of `whatsapp-web.js`!

---

30. Extend `startWhatsAppBot.ts` so that the client gets all chats and let's filter the chats for the person specified
    in our form:

```ts
// src/routes/startWhatsAppBot.ts

//...
await client.initialize();

const chats = await client.getChats()  // Get all chats

// Filter all chats for the chat, which name contains the person we specified in the form
const filteredChats = chats.filter(chat => chat.name.includes(person))  // .filter() returns an array

if (!filteredChats) return  // Return early if no chat was found

// Get the first element of the filtered array (the array should mostly only consist of one chat object anyway, 
// depending on how broad or specified the person field was filled in the form
const desiredChat = filteredChats[0]

await desiredChat.sendMessage(text)  // Send a message to the chat

client?.destroy()  // Close the connection, once the chat was sent
```

31. To send the message at a specified time, we need to be able to schedule sending the message.

    This can be achieved with a little help of `node-cron`: `npm i node-cron`


32. Having installed `node-cron`, we can now schedule a task to be sent at the specified time:

    For more info on the cron syntax, refer to
    the [node-cron documentation](https://github.com/node-cron/node-cron#cron-syntax).

```ts
// src/routes/startWhatsAppBot.ts

// ...

const cron = require("node-cron");

// ...

const desiredChat = filteredChats[0]

if (!desiredChat) return  // return early if no chat was found

// Schedule the message to be sent at the specified time
cron.schedule(`${minute} ${hour} * * *`, async () => {
  await desiredChat.sendMessage(text)  // Send a message to the chat
  console.log(`Successfully sent "${text}" to ${desiredChat.name}`);
  client?.destroy()  // Close the connection, once the chat was sent
});
```

33. Finally, lets send a quick message back to the frontend, informing, that the message will be sent:

```ts
// src/routes/startWhatsAppBot.ts

// ...

res.send(`Message "${text}" was scheduled to be sent to ${desiredChat.name} at ${hour}:${minute}"`)
```

😍 And that's it! You are now able to send WhatsApp Messages to your friends at specified times! 😍

Keep in mind, that when having scheduled a task, your server needs to **keep running** until the scheduled task was
executed!

You can not schedule a message, turn off your computer and enjoy a cold beer with your friends and expect the message to
be sent!

## Problems

This is a very basic tutorial! It does not properly handle all errors and still has some flaws.

The tutorial is meant to take aspiring coders by the hand and help them take their first steps in automating processes.

**Known Issues:**

* As mentioned above: The Server (ie your computer) needs to run until message is sent.

* A new WhatsApp Client is spawned everytime a new message is scheduled - overwriting old scheduled messages. So one can
  always only schedule one message at a time.

* Login Failure in WhatsApp is not handled properly: Starting the program and successfully logging in, then logging out
  the device on your phone and restarting the program, will lead to an unhandled error, as it finds the session.json and
  tries to instantiate a client with an invalidated session.

* Since the QR Code is only visibly rendered in terminal this program is not really suitable for web display, where only
  frontend would be visible.

These issues are addressed in `version-2`. Check out the different branches for more improvements and different versions
of this app 😊