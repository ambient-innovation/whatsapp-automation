import express, {NextFunction, Request, Response} from 'express';
import config from "../config";
import apiRoutes from "../api/routes";
import frontendRoutes from "../routes";
import path from "path";

export default ({app}: { app: express.Application }) => {
  // Transforms the raw string of req.body into json
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());

  // Load API routes
  app.use(config.api.prefix, apiRoutes({app: app}));
  // Load frontend routes
  app.use(frontendRoutes());

  // view engine setup
  app.set('views', path.join(config.srcRoot, 'views'));
  app.set('view engine', 'pug');

  // static file setup
  app.use(express.static(path.join(config.srcRoot, 'static')));

  app.use(express.urlencoded({extended: false}));

  // catch 404 and forward to error handler
  app.use(function (req: Request, res: Response, next: NextFunction) {
    const createError = require('http-errors');
    next(createError(404));
  });

// error handler
  app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // log error
    console.log('\n', req.url, '\n', err, '\n')

    // render the error page
    res.sendStatus(err.status || 500);
  });

  app.listen(config.port, () => {
    console.log(`
################################################
 Server listening on port: ${config.port}
################################################
    `);
  }).on('error', err => {
    console.error(err);
    process.exit(1);
  });
};