import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { configDotenv } from 'dotenv';

configDotenv();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res)=> {
    res.send('Hello world');
})
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`서버가 ${port}에서 실행 중 입니다.`);
})