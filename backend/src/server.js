import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import {db} from '../db/models/index.js';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middleware/errororHandler.js';

configDotenv();
const app = express();

app.use(helmet());                              // http 헤더 자동 설정 라이브러리
app.use(cors());
app.use(express.json({limit: '10mb'}));         // 전송 10MB 제한
app.use(express.urlencoded({extended: true}));

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

// 404 에러 핸들러
app.use(notFoundHandler);

// 에러 헨들러
app.use(errorHandler);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`서버가 ${port}에서 실행 중 입니다.`);
})