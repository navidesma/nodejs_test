import winston, {format} from "winston";
import {join} from "path";
import {__dirname} from "./variables.js";


const logConfiguration = {
    'transports': [new winston.transports.Console({level: "debug"}), new winston.transports.File({
        level: 'error',
        filename: join(__dirname, "logs.log"),
        format: format.combine(format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}), format.align(), winston.format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),)
    })]
};

const logger = winston.createLogger(logConfiguration)

export default logger;