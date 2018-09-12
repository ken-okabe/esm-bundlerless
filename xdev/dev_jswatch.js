const fs = require('fs');
const moduleMap = JSON.parse(fs.readFileSync("./modulejs_map.json", "utf8"));

import { T, now, mlog } from "./timeline-monoid.js";

import { remote } from "electron";
const childWindow = remote
  .getCurrentWindow()
  .getChildWindows()[0];

const buildDir = require("path")
  .join(__dirname, "../dist/build/");

const srcDir = require("path")
  .join(__dirname, "../src/");

const { spawn } = require('child_process');

const chokidar = require('chokidar');

const jswatch = () => {

  const tscw = T((timeline) => {
    //------------------
    const proc = spawn('tsc',
      ['-p', './tsconfig.json', '-w'],
      { shell: true });
    proc.stderr.on('data', (err) => {
      console.error(err.toString());
    });
    proc.stdout.on('data', (data) => {
      console.log("@tscw : " + data.toString());
      data.toString()
        .includes("Found 0 errors. Watching for file changes.")
        ? (() => {
          console.log("@tscw Transpile success!");
          return timeline[now] = true;
        })()
        : false;
    })
  });

  const dummy = tscw.sync(
    () => toMap[now].map(
      (filename) => startMap(filename)
    )
  );

  const isDir = (filepath) => fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();

  const fileChange = T((timeline) => {
    //------------------
    chokidar
      .watch(buildDir,
        { ignored: /(^|[\/\\])\../ })
      .on('all', (event, filename) => {
        console.log("###js file/dir changed :" + filename);

        return isDir(filename)
          ? false
          : timeline[now] = filename;
      })
  });

  const toMap = T();
  toMap[now] = [];

  const dummy1 = fileChange.sync(
    (filename) => {

      toMap[now] = (toMap[now].includes(filename))
        ? toMap[now]
        : [...toMap[now], filename];
    }
  );

  const startMap = filename => readFile(filename);

  const readFile = (filename) => {

    const filenameJs = filename
      .replace(".tsx", ".js")
      .replace(".ts", ".js");

    console.log("### file Read :" + filenameJs);

    fs.readFile(filenameJs, 'utf8',
      (err, data) => err
        ? (() => {
          console.log("fileRead errer !!!"); throw err;
        })()
        : (() => {
          console.log("file Read as=======");
          console.log(data);

          return remap(filenameJs)(data);
        })()
    );
  };

  const remap = (filenameJs) => (data) => {
    const operator = (acc, key) => {

      const before1 = '"' + key + '"';
      const before2 = "'" + key + "'";

      const after = '"' + moduleMap[key] + '"';

      return acc
        .replace(before1, after)
        .replace(before2, after);
    };

    const result = Object.keys(moduleMap)
      .reduce(operator, data);

    const resultjs = result
      .replace(/^(import[^\S\r\n].+?[^\S\r\n]from[^\S\r\n]*(["']))((?:(?!(?:\.js)?\2)[\S\s])+)(\2\s*;)/mg, '$1$3.js$4');
    console.log("remapped as=======");
    console.log(resultjs);

    return delay(() =>
      writeFile(filenameJs)(resultjs)
    )(500);//need dealay to avoid glitch

  };

  const writeFile = (filenameJs) => (data) => {
    fs.writeFile(filenameJs, data,
      (err, data) => err
        ? (() => {
          console.log("fileWrite error !!!");
          throw err;
        })()
        : (() => {
          console.log("file write done=======");

          return delay(reload)(250);
        })()// wait a bit for writing
    );
  };

  const reload = () => {
    console.log("reloading");

    toMap[now] = [];
    console.log("### transpiled read- mapped-write, then toMap is empty now " + toMap[now]);

    return childWindow.webContents
      .send("asynchronous-message", "reload");

  };

  const delay = f => time =>
    setTimeout(f, time);

};

export { jswatch };