# LiveJSON
Package for working with "live" JSON documents, and easy get access to updates.

**Case 1:**
Store some minor project settings, as example "Disabled Registration" or "Enabled Captcha". Manage this status from your code, or just by edit file with text-editor.

**Case 2:**
Share and manage some variables between few Node.JS instances. Set variable from **Process #1**, and have access to that from **Process #2**.

## Installing:
```bash
npm install @bsnext/livejson
```

## Usage:
```ts
new LiveJSON(filePath: string [, { interval: number = 50 }])
new LiveJSONSync(filePath: string [, { interval: number = 50 }])
```

* filePath - Path to your JSON file.
* interval - Delay betweeb checking file updates.

```ts
import { LiveJSONSync, LiveJSON } from "@bsnext/livejson";
const exampleFile = new LiveJSONSync(`myFile.json`);

// Get Value
exampleFile.get(`variableName`); 

// Set Value
exampleFile.set(`variableName`, 1337);

// Set Multiple Values
exampleFile.set(
    {
        variableName: 777,
        oneMoreVariable: `Hi!`
    }
);
```

## API:

```ts
LiveJSONSync.get(key: string) // Get Value
LiveJSONSync.getAll() // Get All Values
LiveJSONSync.save() // Manual Save File
LiveJSONSync.reload(strict: boolean = false) // Manual Reload File
LiveJSONSync.set(key: string, value: any[, save: boolean = true]) // Set Value
LiveJSONSync.set({[key: string]: any}, [, save: boolean = true]) // Set Multiple Values

LiveJSON.get(key: string)
LiveJSON.getAll()
await LiveJSON.save()
await LiveJSON.reload(strict: boolean = false)
await LiveJSON.set(key: string, value: any[, save: boolean = true])
await LiveJSON.set({[key: string]: any}, [, save: boolean = true])
```

*Save on "set" methods is enabled by default.*<br>
*You can set it as "false", if make much changes in one moment.*<br>
*Just disable that and use "save" method after your changes.*

*"strict" parameter used in "reload" method for throw Error, if JSON can not be parsed.*

## Future:
* onReload event
* onReloadError event
* Tests
* Benchmark