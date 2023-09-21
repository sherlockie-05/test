import * as express from 'express';
import * as dotenv from 'dotenv';
import { Routes } from './routes';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from "morgan";
import path = require('path');
import * as fs from 'fs';
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

if(fs.existsSync(path.join(__dirname,"..",".env"))){
    dotenv.config();
}

export class Server{
    protected app = express();
    constructor(){
        const PORT = process.env.PORT as string;
        const NODE_ENV = process.env.NODE_ENV;
        const routes = new Routes(NODE_ENV);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        this.app.use(morgan("dev"));
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use("/admin",routes.path());
        this.app.listen(PORT,()=>{
            console.log("The server runs on localhost:",PORT);
        });
    }
}