"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transport = require("winston-transport");
const _ = require("lodash");
const graylog2 = require("graylog2");
class GraylogTransport extends Transport {
    constructor(opts) {
        super();
        this.graylogLevels = {
            emerg: 'emergency',
            alert: 'alert',
            crit: 'critical',
            error: 'error',
            warning: 'warning',
            warn: 'warning',
            notice: 'notice',
            info: 'info',
            debug: 'debug',
        };
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
    prepareMeta(meta, staticMeta) {
        meta = meta || {};
        if (meta instanceof Error) {
            meta = { error: meta.stack };
        }
        else if (typeof meta === 'object') {
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
    log(data, callback) {
        let { level, message } = data, meta = __rest(data, ["level", "message"]);
        setImmediate(() => {
            this.emit('logged', data);
        });
        meta = this.processMeta(this.prepareMeta(meta, this.staticMeta));
        message = this.prelog(message);
        this.logger[this.getMessageLevel(level)](message.substring(0, 100), message, Object.assign({}, meta, { winstonLevel: level, level: undefined }));
        callback();
    }
}
exports.GraylogTransport = GraylogTransport;
;
