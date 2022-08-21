import winston from "winston";
import {join} from "path";
import {__dirname} from "./variables.js";


const logConfiguration = {
    'transports': [
        new winston.transports.Console({level: "warn"}),
        new winston.transports.File({level: 'error', filename: join(__dirname, "logs.log")})
    ]
};

const logger = winston.createLogger(logConfiguration)

export default logger;