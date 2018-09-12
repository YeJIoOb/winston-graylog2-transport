"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Winston = require("winston");
const index_1 = require("./index");
const options = {
    graylog: {
        servers: [
            { 'host': '127.0.0.1', port: 12201 }
        ],
        facility: 'Node.js',
        bufferSize: 1350
    },
    level: 'debug',
    name: 'myAwesomeApp',
    silent: false,
    handleExceptions: false,
    staticMeta: { service: 'myAwesomeApp' }
};
exports.Logger = Winston.createLogger({
    levels: Winston.config.syslog.levels,
    transports: [
        new index_1.GraylogTransport(options)
    ]
});
exports.Logger.log('emerg', 'test', { a: 'b', foo: 'bar' });
