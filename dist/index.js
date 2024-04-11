"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveJSONSync = exports.LiveJSON = void 0;
const fsSync = require("node:fs");
const fs = require("node:fs/promises");
class LiveJSONTemplate {
    constructor(filePath, options) {
        const interval = (typeof (options === null || options === void 0 ? void 0 : options.interval) === `number`) ? options.interval : 250;
        if (typeof filePath !== `string`) {
            throw new Error(`new LiveJSON(...) first argument expected a 'string' type, got '${typeof filePath}'`);
        }
        if (!fsSync.existsSync(filePath)) {
            throw new Error(`LiveJSON can not find file '${filePath}'`);
        }
        this.filePath = filePath;
        this.isSelfReloading = false;
        this.__reloadSync(true);
        const __this = this;
        fsSync.watchFile(filePath, {
            interval: interval
        }, function (...args) {
            if (__this.isSelfReloading) {
                __this.isSelfReloading = false;
                return;
            }
            __this.__reloadSync(true);
        });
    }
    __loadContent(content, strict) {
        try {
            this.fileContent = JSON.parse(content);
        }
        catch (e) {
            if (strict) {
                throw e;
            }
            console.error(e);
        }
    }
    __reloadSync(strict = false) {
        const tempFileContent = fsSync.readFileSync(this.filePath, { encoding: `utf8`, flag: `r` });
        this.__loadContent(tempFileContent, strict);
    }
    __set(key, value) {
        if (typeof key === `object`) {
            for (let [index, value] of Object.entries(key)) {
                this.fileContent[index] = value;
            }
        }
        else if (typeof key === `string`) {
            this.fileContent[key] = value;
        }
    }
    getAll() {
        return this.fileContent;
    }
    get(key) {
        return this.fileContent[key];
    }
}
class LiveJSON extends LiveJSONTemplate {
    constructor(filePath, options) {
        const interval = (typeof (options === null || options === void 0 ? void 0 : options.interval) === `number`) ? options.interval : 250;
        super(filePath, { interval: interval });
    }
    async reload(strict = false) {
        const tempFileContent = await fs.readFile(this.filePath, { encoding: `utf8`, flag: `r` });
        this.__loadContent(tempFileContent, strict);
    }
    async save() {
        this.isSelfReloading = true;
        await fs.writeFile(this.filePath, JSON.stringify(this.fileContent, null, 4), { encoding: 'utf8', flag: 'w' });
    }
    async set(key, arg1, arg2 = true) {
        let save, value;
        if (typeof key === `object`) {
            save = (typeof arg1 === `boolean`) ? arg1 : true;
        }
        else if (typeof key === `string` && typeof arg2 === `boolean`) {
            value = arg1;
            save = arg2;
        }
        else {
            throw new Error(`LiveJSON.set(...) invalid input arguments, expected (object[, boolean]) or (string, any[, boolean]).`);
        }
        this.__set(key, value);
        if (save) {
            await this.save();
        }
    }
}
exports.LiveJSON = LiveJSON;
class LiveJSONSync extends LiveJSONTemplate {
    constructor(filePath, options) {
        const interval = (typeof (options === null || options === void 0 ? void 0 : options.interval) === `number`) ? options.interval : 250;
        super(filePath, { interval: interval });
    }
    reload(strict = false) {
        const tempFileContent = fsSync.readFileSync(this.filePath, { encoding: `utf8`, flag: `r` });
        this.__loadContent(tempFileContent, strict);
    }
    save() {
        this.isSelfReloading = true;
        fsSync.writeFileSync(this.filePath, JSON.stringify(this.fileContent, null, 4), { encoding: 'utf8', flag: 'w' });
    }
    set(key, arg1, arg2 = true) {
        let save, value;
        if (typeof key === `object`) {
            save = (typeof arg1 === `boolean`) ? arg1 : true;
        }
        else if (typeof key === `string` && typeof arg2 === `boolean`) {
            value = arg1;
            save = arg2;
        }
        else {
            throw new Error(`LiveJSON.set(...) invalid input arguments, expected (object[, boolean]) or (string, any[, boolean]).`);
        }
        this.__set(key, value);
        if (save) {
            this.save();
        }
    }
}
exports.LiveJSONSync = LiveJSONSync;
//# sourceMappingURL=index.js.map