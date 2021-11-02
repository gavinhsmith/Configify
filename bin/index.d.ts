/// <reference types="node" />
import * as fs from "fs";
/**
 * The file stucture for a configuration file
 * @template S The JSON Schema that the config follows
 */
export interface ConfigFile<S> {
    /** The timestamp when the file was last saved */
    last_saved: string;
    /** The timestamp when the file was last opened */
    last_opened: string;
    /** The configuration version */
    version: number;
    /** The configuration data */
    config: S;
}
/**
 * A configuration handler
 * @template S The JSON Schema that the config follows
 */
export default class Config<S> {
    /** The default update hander for a config file (just returns the old state) */
    static DEFAULT_UPDATE_HANDLER: (e: any) => any;
    /** The default Write-To-Disk callback */
    static DEFAULT_WTD_CALLBACK: (e: any) => void;
    /** The configuration version */
    version: number;
    /** The configuration data */
    config: S;
    /** The file path to the config */
    readonly file_path: string;
    /** The default configuration */
    readonly defaults: ConfigFile<S>;
    /** The last time the file was saved. */
    last_saved: Date;
    /** The last time the file was opened. */
    last_opened: Date;
    /**
     * Create an instance of the config
     * @param file_path The file path to where the config file will be or is stored
     * @param default_config The default configuration
     */
    constructor(file_path: string, defaults: ConfigFile<S>, updateHandler?: (old_config: ConfigFile<S>) => ConfigFile<S>);
    /**
     * Writes the current local config to the disk; "Saves" the config
     * @param callback The callback for the FS write call
     */
    writeToDisk(callback?: fs.NoParamCallback): void;
    /**
     * Reset the configuration to the default
     * @returns The new config
     */
    resetConfig(): S;
}
