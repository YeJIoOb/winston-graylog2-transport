import * as Transport from 'winston-transport';
export declare type GraylogServer = {
    host: string;
    port: number;
};
export declare type GraylogTransportOptions = {
    graylog: GraylogOptions;
    level?: string;
    name?: string;
    silent?: boolean;
    handleExceptions?: boolean;
    prelog?: GraylogPrelog;
    processMeta?: GraylogProcessMeta;
    staticMeta?: GraylogLogMessageMeta;
};
export declare type GraylogPrelog = {
    (message: string): string;
};
export declare type GraylogLogMessageMeta = {
    [index: string]: any;
};
export declare type GraylogProcessMeta = {
    (meta: GraylogLogMessageMeta): GraylogLogMessageMeta;
};
export declare type GraylogOptions = {
    servers: GraylogServer[];
    hostname?: string;
    facility?: string;
    bufferSize?: number;
};
export declare class GraylogTransport extends Transport {
    private logger;
    graylogLevels: {
        emerg: string;
        alert: string;
        crit: string;
        error: string;
        warning: string;
        warn: string;
        notice: string;
        info: string;
        debug: string;
    };
    constructor(opts: GraylogTransportOptions);
    getMessageLevel(winstonLevel: any): any;
    prepareMeta(meta: GraylogLogMessageMeta, staticMeta: GraylogLogMessageMeta): GraylogLogMessageMeta;
    staticMeta: GraylogLogMessageMeta;
    prelog: GraylogPrelog;
    processMeta: GraylogProcessMeta;
    log(data: any, callback: any): void;
}
