require('dotenv').config();

import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import {list} from "./routes/list";
import {register} from "./routes/register";
import {admin} from "./routes/admin";
import {login} from "./routes/login";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

const app = express();
app.use(limiter);
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.1.11:3000']
}));
app.use(express.json());
app.use('/list', list);
app.use('/register', register);
app.use('/admin', admin);
app.use('/login', login);


app.listen(3001, '0.0.0.0', () => {
    console.log('Server listen on port: http://0.0.0.0:3001');
});

