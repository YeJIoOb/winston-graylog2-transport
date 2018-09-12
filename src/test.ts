import * as Winston from 'winston';
import { GraylogTransport, GraylogTransportOptions } from './index';

const options: GraylogTransportOptions = {
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

export const Logger = Winston.createLogger({
  levels: Winston.config.syslog.levels,
  transports: [
    new GraylogTransport(options)
  ]
});

Logger.log('emerg', 'test', { a: 'b', foo: 'bar' });