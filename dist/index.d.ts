declare class LiveJSONTemplate {
    protected fileContent: Object;
    protected isSelfReloading: boolean;
    readonly filePath: string;
    constructor(filePath: string, options?: {
        interval?: number;
    });
    protected __loadContent(content: string, strict: boolean): void;
    protected __reloadSync(strict?: boolean): void;
    protected __set(key: Object | string, value: any): void;
    getAll<T>(): T;
    get<T>(key: string): T;
}
export declare class LiveJSON extends LiveJSONTemplate {
    constructor(filePath: string, options?: {
        interval?: number;
    });
    reload(strict?: boolean): Promise<void>;
    save(): Promise<void>;
    set(key: string, value: any, save?: boolean): Promise<void>;
    set(key: Object, save?: boolean): Promise<void>;
}
export declare class LiveJSONSync extends LiveJSONTemplate {
    constructor(filePath: string, options?: {
        interval?: number;
    });
    reload(strict?: boolean): void;
    save(): void;
    set(key: string, value: any, save?: boolean): void;
    set(key: Object, save?: boolean): void;
}
export {};
