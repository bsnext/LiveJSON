import * as fsSync from "node:fs";
import * as fs from "node:fs/promises";

class LiveJSONTemplate {
    protected fileContent: Object;
    protected isSelfReloading: boolean;
    readonly filePath: string;

    constructor(filePath: string, options?: { interval?: number; }) {
        const interval = (typeof options?.interval === `number`) ? options.interval : 250;

        if (typeof filePath !== `string`) {
            throw new Error(`new LiveJSON(...) first argument expected a 'string' type, got '${typeof filePath}'`);
        }

        if (!fsSync.existsSync(filePath)) {
            throw new Error(`LiveJSON can not find file '${filePath}'`);
        }

        ////////

        this.filePath = filePath;
        this.isSelfReloading = false;

        this.__reloadSync(true);
        
        const __this = this;

        fsSync.watchFile(filePath,
            {
                interval: interval
            },
            function (...args) {
                if (__this.isSelfReloading) {
                    __this.isSelfReloading = false;
                    return;
                }

                __this.__reloadSync(true);
            }
        );
    }

    ////////

    protected __loadContent(content: string, strict: boolean) {
        try {
            this.fileContent = JSON.parse(content);
        } catch (e) {
            if (strict) {
                throw e;
            }

            console.error(e);
        }
    }

    protected __reloadSync(strict: boolean = false) {
        const tempFileContent = fsSync.readFileSync(this.filePath, { encoding: `utf8`, flag: `r` });
        this.__loadContent(tempFileContent, strict);
    }

    protected __set(key: Object | string, value: any) {
        if (typeof key === `object`) {
            for (let [index, value] of Object.entries(key)) {
                this.fileContent[index] = value;
            }
        } else if (typeof key === `string`) {
            this.fileContent[key] = value;
        }
    }

    ////////

    getAll<T>() {
        return this.fileContent as T;
    }

    get<T>(key: string) {
        return this.fileContent[key] as T;
    }
}

export class LiveJSON extends LiveJSONTemplate {
    constructor(filePath: string, options?: { interval?: number; }) {
        const interval = (typeof options?.interval === `number`) ? options.interval : 250;
        super(filePath, { interval: interval });
    }

    async reload(strict: boolean = false) {
        const tempFileContent = await fs.readFile(this.filePath, { encoding: `utf8`, flag: `r` });
        this.__loadContent(tempFileContent, strict);
    }

    async save() {
        this.isSelfReloading = true;
        await fs.writeFile(this.filePath, JSON.stringify(this.fileContent, null, 4), { encoding: 'utf8', flag: 'w' });
    }

    async set(key: string, value: any, save?: boolean): Promise<void>;
    async set(key: Object, save?: boolean): Promise<void>;
    async set(key: Object | string, arg1: any, arg2: boolean = true): Promise<void> {
        let save, value;

        if (typeof key === `object`) {
            save = (typeof arg1 === `boolean`) ? arg1 : true;
        } else if (typeof key === `string` && typeof arg2 === `boolean`) {
            value = arg1;
            save = arg2;
        } else {
            throw new Error(`LiveJSON.set(...) invalid input arguments, expected (object[, boolean]) or (string, any[, boolean]).`);
        }

        this.__set(key, value);

        if (save) {
            await this.save();
        }
    }
}

export class LiveJSONSync extends LiveJSONTemplate {
    constructor(filePath: string, options?: { interval?: number; }) {
        const interval = (typeof options?.interval === `number`) ? options.interval : 250;
        super(filePath, { interval: interval });
    }

    reload(strict: boolean = false): void {
        const tempFileContent = fsSync.readFileSync(this.filePath, { encoding: `utf8`, flag: `r` });
        this.__loadContent(tempFileContent, strict);
    }

    save() {
        this.isSelfReloading = true;
        fsSync.writeFileSync(this.filePath, JSON.stringify(this.fileContent, null, 4), { encoding: 'utf8', flag: 'w' });
    }

    set(key: string, value: any, save?: boolean): void;
    set(key: Object, save?: boolean): void;
    set(key: Object | string, arg1: any, arg2: boolean = true): void {
        let save, value;

        if (typeof key === `object`) {
            save = (typeof arg1 === `boolean`) ? arg1 : true;
        } else if (typeof key === `string` && typeof arg2 === `boolean`) {
            value = arg1;
            save = arg2;
        } else {
            throw new Error(`LiveJSON.set(...) invalid input arguments, expected (object[, boolean]) or (string, any[, boolean]).`);
        }

        this.__set(key, value);

        if (save) {
            this.save();
        }
    }
}