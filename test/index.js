import Configify from "../bin/index.js";
import fs from "fs";

fs.mkdirSync("./test/config", {recursive: true});

const conf = new Configify("./test/config/test.json", {
    version: 1,
    config: {
        times_opened: 0,
        foo: "bar",
        fizz: "buzz"
    }
});

conf.config.times_opened++;

console.info(`Config opened ${conf.config.times_opened} time(s).`);

setTimeout(() => {
    conf.writeToDisk();
}, 3*1000);