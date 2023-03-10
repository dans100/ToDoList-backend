require('dotenv').config();

import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { list } from './routes/list';
import { register } from './routes/register';
import { login } from './routes/login';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(limiter);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN as string,
    methods: 'GET,POST,DELETE,PATCH',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_TOKEN as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24,
    },
  })
);

app.use('/list', list);
app.use('/register', register);
app.use('/', login);

app.listen(3001, '0.0.0.0', () => {
  console.log('Server listen on port: http://0.0.0.0:3001');
});
