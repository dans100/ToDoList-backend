import express from 'express';
import cors from 'cors';
import {list} from "./routes/list";


const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use('/list', list);


app.listen(3001, () => {
    console.log('Server listen on port: http://localhost:3001');
});
