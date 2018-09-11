
import { jswatch } from "./dev_jswatch.js";
import { server } from "./server.js";
import { remote } from "electron";
const dev = () => {
  console.log("dev--------------------");

  jswatch();

  const childWindow = remote
    .getCurrentWindow()
    .getChildWindows()[0]

  const dir = "../dist";
  const port = 19999;
  const serverUp = (args) => {
    console.log("server up " + port);

    childWindow.
      loadFile("./xdev/index.html");

    childWindow.webContents
      .on('did-finish-load',
        () => {
          childWindow.webContents
            .send('asynchronous-message', "ping");
        });

  };
  server(dir)(port)(serverUp);

  //--------------------------------
};

export { dev };