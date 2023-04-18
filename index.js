import express from 'express';
import connect from './src/repository/DB.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { config } from './src/utils/config.js';
import { Logging } from './src/utils/Logging.js';
import { error } from './src/middleware/error.js';
import cors from 'cors';
import { bootstrap } from './src/routes/index.js';
import swaggerJsDoc from 'swagger-jsdoc';
import fs from 'fs';
import swaggerUI from 'swagger-ui-express';
import { SC } from './src/utils/statusCode.js';
import YAML from 'yamljs';
const dbUrl = 'mongodb://127.0.0.1:27017/PetManagement'

const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerYaml = YAML.parse(file);

const app = express();

//middleware for swagger
app.use('/api_docs', swaggerUI.serve, swaggerUI.setup(swaggerYaml));
//set Up logger
app.use((req, res, next)=>{
    Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', ()=>{
        Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - StatusCode: [${res.statusCode}]`);
    })
    next();
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true

}))

app.use((req, res, next) => {
    res.setHeader('Allow-Control-Access-Origin', '*');
    res.setHeader('Allow-Control-Access-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS'),
    res.setHeader('Allow-Control-Access-Headers', 'Content-type, api_key, Authorization'),
    res.setHeader('Allow-Control-Access-Credentials', true);
    next();
});


app.use(error);

bootstrap(app);

app.use('*', (req, res, next) => {
    return res
        .status(SC.NotFound)
        .json({
            status: false,
            message: 'You lost your way 🙂😑'
        })
})

app.listen(config.PORT, () => {
    Logging.info(`App is running on port ${config.PORT}`);
    
    connect({ dbUrl });
})