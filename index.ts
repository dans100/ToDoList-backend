require('dotenv').config();

import express from 'express';
import cors from 'cors';
import {list} from "./routes/list";
import {register} from "./routes/register";
import {admin} from "./routes/admin";
import {login} from "./routes/login";


const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use('/list', list);
app.use('/register', register);
app.use('/admin', admin);
app.use('/login', login);


app.listen(3001, () => {
    console.log('Server listen on port: http://localhost:3001');
});

