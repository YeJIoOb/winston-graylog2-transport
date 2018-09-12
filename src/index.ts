import * as Transport from 'winston-transport';
import * as _ from 'lodash';
const graylog2 = require("graylog2");

export type GraylogServer = {
  host: string;
  port: number;
}

export type GraylogTransportOptions = {
  graylog: GraylogOptions;
  level?: string;
  name?: string;
  silent?: boolean;
  handleExceptions?: boolean;
  prelog?: GraylogPrelog;
  processMeta?: GraylogProcessMeta;
  staticMeta?: GraylogLogMessageMeta;
}

export type GraylogPrelog = {
  (message: string): string;
}

export type GraylogLogMessageMeta = {
  [index: string]: any;
}

export type GraylogProcessMeta = {
  (meta: GraylogLogMessageMeta): GraylogLogMessageMeta
}

export type GraylogOptions = {
  servers: GraylogServer[];
  hostname?: string;
  facility?: string;
  bufferSize?: number;
}

export class GraylogTransport extends Transport {
  private logger;

  graylogLevels = {
    emerg: 'emergency',
    alert: 'alert',
    crit: 'critical',
    error: 'error',
    warning: 'warning',
    warn: 'warning',
    notice: 'notice',
    info: 'info',
    debug: 'debug',
  }

  constructor(opts: GraylogTransportOptions) {
    super();
    this.processMeta =
      typeof opts.processMeta === 'function'
        ? opts.processMeta
        : _.identity;
    this.prelog =
      typeof opts.prelog === 'function' ? opts.prelog : _.identity;
    this.staticMeta = opts.staticMeta || {};

    this.logger = new graylog2.graylog(opts.graylog);
    this.logger.on('error', function (error) {
      this.emit('error', error);
    });
  }

  getMessageLevel(winstonLevel) {
    return this.graylogLevels[winstonLevel] || this.graylogLevels.info;
  }

  prepareMeta(meta: GraylogLogMessageMeta, staticMeta: GraylogLogMessageMeta) {
    meta = meta || {};

    if (meta instanceof Error) {
      meta = { error: meta.stack };
    } else if (typeof meta === 'object') {
      meta = _.mapValues(meta, function (value) {
        if (value instanceof Error) {
          return value.stack;
        }

        return value;
      });
    }

    meta = _.merge(meta, staticMeta);

    return meta;
  }

  staticMeta: GraylogLogMessageMeta;

  prelog: GraylogPrelog;

  processMeta: GraylogProcessMeta;

  log(data, callback) {
    let { level, message, ...meta } = data;
    setImmediate(() => {
      this.emit('logged', data);
    });
    meta = this.processMeta(this.prepareMeta(meta, this.staticMeta));
    message = this.prelog(message);

    this.logger[this.getMessageLevel(level)](message.substring(0, 100), message, { ...meta, winstonLevel: level, level: undefined });

    callback();
  }
};
