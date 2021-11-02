// Import Needed Modules
import * as fs from "fs";

/**
 * The file stucture for a configuration file
 * @template S The JSON Schema that the config follows
 */
export interface ConfigFile<S> {
    /** The timestamp when the file was last saved */
    last_saved: string,
    /** The timestamp when the file was last opened */
    last_opened: string,
    /** The configuration version */
    version: number,
    /** The configuration data */
    config: S
}

/**
 * A configuration handler
 * @template S The JSON Schema that the config follows
 */
export default class Config<S> {

    /** The default update hander for a config file (just returns the old state) */
    public static DEFAULT_UPDATE_HANDLER = e=>e;

    /** The default Write-To-Disk callback */
    public static DEFAULT_WTD_CALLBACK = e=>{if (e) throw e};

    /** The configuration version */
    public version: number;

    /** The configuration data */
    public config: S;

    /** The file path to the config */
    public readonly file_path: string;

    /** The default configuration */
    public readonly defaults: ConfigFile<S>;

    /** The last time the file was saved. */
    public last_saved: Date;

    /** The last time the file was opened. */
    public last_opened: Date;

    /**
     * Create an instance of the config
     * @param file_path The file path to where the config file will be or is stored
     * @param default_config The default configuration
     */
    constructor(file_path: string, defaults: ConfigFile<S>, updateHandler: (old_config: ConfigFile<S>) => ConfigFile<S> = Config.DEFAULT_UPDATE_HANDLER) {
        this.defaults = defaults;
        this.file_path = file_path;

        if (fs.existsSync(file_path)) {
            let conf_file: ConfigFile<S> = JSON.parse(fs.readFileSync(file_path, "utf-8"));

            if (conf_file.version < defaults.version) conf_file = updateHandler(conf_file);

            this.config = conf_file.config;
            this.version = conf_file.version;
            this.last_saved = new Date(conf_file.last_saved);
            this.last_opened = new Date();
        } else {
            this.config = defaults.config;
            this.version = defaults.version;
            this.last_saved = new Date();
            this.last_opened = new Date();

            this.writeToDisk();
        };
    }

    /**
     * Writes the current local config to the disk; "Saves" the config
     * @param callback The callback for the FS write call
     */
    public writeToDisk(callback: fs.NoParamCallback = Config.DEFAULT_WTD_CALLBACK): void {
        this.last_saved = new Date();
        let conf_file: ConfigFile<S> = {
            version: this.version,
            config: this.config,
            last_saved: this.last_saved.toISOString(),
            last_opened: this.last_opened.toISOString()
        };
        fs.writeFile(this.file_path, JSON.stringify(conf_file, null, 2), "utf-8", callback);
    }

    /**
     * Reset the configuration to the default
     * @returns The new config
     */
    public resetConfig(): S {
        this.config = this.defaults.config;
        this.writeToDisk();
        return this.config;
    }
};