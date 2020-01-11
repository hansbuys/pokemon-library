import {LFService, Logger, LoggerFactory, LoggerFactoryOptions, LogGroupRule, LogLevel} from "typescript-logging";

export class Logging {

    private static loggerFactory: LoggerFactory;
    private static _logLevel: LogLevel = LogLevel.Info;

    public static set logLevel(value: LogLevel) {
        this._logLevel = value;
        this.createLoggerFactory();
    }

    public static createLogger(type: Function): Logger {
        if (!Logging.loggerFactory) {
            this.createLoggerFactory()
        }
        return Logging.loggerFactory.getLogger(type.name);
    }

    private static createLoggerFactory() {
        const options = new LoggerFactoryOptions()
            .addLogGroupRule(new LogGroupRule(new RegExp(".+"), Logging._logLevel));

        LFService.closeLoggers();
        this.loggerFactory = LFService.createNamedLoggerFactory("LoggerFactory", options);
        this.createLogger(Logging).info(`Logging level set to ${Logging._logLevel}`);
    }
}