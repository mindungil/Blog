import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { configDotenv } from 'dotenv';
import {db} from '../db/models/index.js';

configDotenv();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

db.sequelize.sync({force: false})
    .then(() => {
        console.log('mysql 연결 성공');
    })
    .catch((err)=> {
        console.error('DB 연결 실패: ', err);
    });

app.get('/', (req, res)=> {
    res.send('Hello world');
})
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`서버가 ${port}에서 실행 중 입니다.`);
})