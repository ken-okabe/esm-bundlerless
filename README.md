# esm-bundlerless

ESM (ES6 Modules) Bundlerless Front-end Development tool

ESM (ES6 Modules)  simplifies JavaScript application development since there is no need to bundle on deploy, modules works as it is on browsers.

**This article will show you how you can develop and deploy JavaScript front-end applications with ES modules in the browser today without bundlers such as webpack/Browserify.**

This project provides a basic concept and a minimal prototype.


## ES6 Modules support in modern browsers today
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility

![compati.png](https://kenokabetech.github.io/img/ts-react-electron/compati.png)

## Robust dependencies

- [TypeScript 3.0](https://www.typescriptlang.org/)  
For React JSX applications, there is a need to transpile JSX to vanilla JavaScript, and until now we needed to use webpack+babel, that has been a very complicated setup.  
Amazingly TypeScript has an ability to transpile JSX(TSX) to JS.  Hence, as long as sticking to TypeScript, another transpiler such as babel is not necessary.  
- [Electron 3.0](https://electronjs.org/)  
Electron is built on Chromium and Node.js technology, so it's a hybrid environment of both WebBrowser and local node runtime.  
Therefore, with Electron, I presume anything can be done, however, the fact is there is some issue to take advantage of ESM - [Issue: Contexts: supporting new Node's ESM Loader (without hacking)](https://github.com/electron/node/issues/33)  
While I commented there, the member of the team of Electron and the developer of [lodash](https://www.npmjs.com/package/lodash) relied on me to suggest to use [esm](https://www.npmjs.com/package/esm) library that is his another brilliant work, and that technically resolved the issue.  

![esm-dependency.png](https://kenokabetech.github.io/img/ts-react-electron/esm-dependency.png)

- [Visual Studio Code ](https://code.visualstudio.com/)  
I highly recommend using Visual Studio Code than any other IDE including AtomEditor(by GitHub).  
VisualStudio code is optimized to use TypeScript out of the box, and in fact, VisualStudio Code is purely developed in TypeScript(Anders Hejlsberg explained so in some Microsoft keynote.)    
VisualStudio Code is developed by Microsoft and build on Electron, and it's one of the reason Microsoft acquired GitHub. Electron is originally a core unit of AtomEditor developed by GitHub, so essentially, Electron is now Microsoft's asset.  
Very interestingly, all tools, TypeScript, Electron and VisualStudio Code are maintained by Microsoft. 

## TypeScript to JavaScript on save

The most of the work is done by TypeScript transpiler
[tsc --watch option](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
>Run the compiler in watch mode. Watch input files and trigger recompilation on changes. The implementation of watching files and directories can be configured using environment variable. See [configuring watch](https://www.typescriptlang.org/docs/handbook/configuring-watch.html) for more details.
>
![esm-src.png](https://kenokabetech.github.io/img/ts-react-electron/esm-src.png)
![esm-src.png](https://kenokabetech.github.io/img/ts-react-electron/esm-dist.png)

## This tool adds the `.js` file extension to the end of module specifiers in TypeScript transpilation
https://github.com/Microsoft/TypeScript/issues/16577

![esm-src.png](https://kenokabetech.github.io/img/ts-react-electron/esm-ts.png)

![esm-src.png](https://kenokabetech.github.io/img/ts-react-electron/esm-js.png)

## Automatic reload and clean console log in a child window of Electron

![esm-whole.png](https://kenokabetech.github.io/img/ts-react-electron/esm-whole.png)

![esm-whole0.png](https://kenokabetech.github.io/img/ts-react-electron/esm-whole0.png)


 ## Use the latest TypeScript version installed in the local project not global

It's a good manner not to install typescript npm package 

not to global 
`npm install -g typescript`
but to local --save-dev.
`npm install -D typescript`

In VisalStudio Code, by clicking the TypeScript Version, it's easy to switch to use the loacal(WorkSpace) version.

![Screenshot from 2018-08-19 16-55-15.png](https://kenokabetech.github.io/img/ts-react-electron/Screenshot%20from%202018-08-19%2016-55-15.png)

 
![Screenshot from 2018-08-19 17-05-21.png](https://kenokabetech.github.io/img/ts-react-electron/Screenshot%20from%202018-08-19%2017-05-21.png) 
  


 