import createError, { HttpError } from 'http-errors';
import expressUpload from 'express-fileupload';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mailRouter from './routes/email';
import cors from 'cors';

// Swagger
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');

// ROUTESS
import usersRouter from './routes/users';
import postRouter from './routes/postRoute';
import commentRouter from './routes/commentRoute';
import { sendSurveyNotification } from './controller/surveyController';

// db.sync({
//   // force: true,
// })
//   .then(() => {
//     console.log('Database connected successfully 🚀');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(expressUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

setInterval(sendSurveyNotification, 604800000);

app.use('/api/mail', mailRouter);
app.use('/user', usersRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler

// error handler
app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

export default app;
