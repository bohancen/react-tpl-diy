// const fs = require("fs");
const path = require("path");
const express = require("express");
const server = express();
const PORT = process.env.PORT || 9000;

const assetManifest = require('../build/asset-manifest.json')

// 静态资源
server.use(
  `/static/`,
  express.static(path.resolve(__dirname, "../build/static/"))
);

// icon
server.use(
  `/favicon.ico`,
  express.static(path.resolve(__dirname, "../public/favicon.ico"))
);

server.get("/*", (req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="${assetManifest['index.css']}"/>
      </head>
      <body>
        <div id="root"></div>
        <script src="${assetManifest['index.js']}"></script>
      </body>
    </html>
  `)
  // res.send(
  //   fs.readFileSync(path.resolve(buildDir, "./index.html"), {
  //     encoding: "utf8",
  //   })
  // );
});

server.listen(PORT, () => {
  console.log("test server run at " + PORT);
});
