import * as fs from "fs";
export default class Config {
    static DEFAULT_UPDATE_HANDLER = e => e;
    static DEFAULT_WTD_CALLBACK = e => { if (e)
        throw e; };
    version;
    config;
    file_path;
    defaults;
    last_saved;
    last_opened;
    constructor(file_path, defaults, updateHandler = Config.DEFAULT_UPDATE_HANDLER) {
        this.defaults = defaults;
        this.file_path = file_path;
        if (fs.existsSync(file_path)) {
            let conf_file = JSON.parse(fs.readFileSync(file_path, "utf-8"));
            if (conf_file.version < defaults.version)
                conf_file = updateHandler(conf_file);
            this.config = conf_file.config;
            this.version = conf_file.version;
            this.last_saved = new Date(conf_file.last_saved);
            this.last_opened = new Date();
        }
        else {
            this.config = defaults.config;
            this.version = defaults.version;
            this.last_saved = new Date();
            this.last_opened = new Date();
            this.writeToDisk();
        }
        ;
    }
    writeToDisk(callback = Config.DEFAULT_WTD_CALLBACK) {
        this.last_saved = new Date();
        let conf_file = {
            version: this.version,
            config: this.config,
            last_saved: this.last_saved.toISOString(),
            last_opened: this.last_opened.toISOString()
        };
        fs.writeFile(this.file_path, JSON.stringify(conf_file, null, 2), "utf-8", callback);
    }
    resetConfig() {
        this.config = this.defaults.config;
        this.writeToDisk();
        return this.config;
    }
}
;
