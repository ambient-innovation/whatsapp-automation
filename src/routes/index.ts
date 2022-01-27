import {Response, Request, Router} from 'express'

// Instantiate router
const route = Router()

// Specifies, that a get-call on 'localhost:<YOUR_PORT>/' will return the 'index.pug' template
export default route.get('/', async (req: Request, res: Response): Promise<any> => res.render('index'))
