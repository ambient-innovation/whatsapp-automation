import express, {Application} from "express"
import indexRoute from './routes/index'
import startWhatsAppBotRoute from './routes/startWhatsAppBot'
import * as path from "path";

// Initialise your app
const app: Application = express()

// Specify the port, your app will be running on
const PORT: number = 8000

// Transforms the raw string of req.body into json
app.use(express.json())
app.use(express.urlencoded({ extended: true}));

// Use routes, we will specify in 'routes/index.ts'
app.use(indexRoute)
app.use(startWhatsAppBotRoute)

// View engine setup
app.set('views', path.join(__dirname, 'views'));  // Specifies, that the projects views (ie templates) will be in the current directory (__dirname) in a folder called 'views'
app.set('view engine', 'pug');  // Set the projects view engine (ie templating engine) to be 'pug'

// Listen for any activity on our specified port
app.listen(PORT, () => console.log(`Server is running successfully at ${PORT}`))