const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.use(
  "/api",
  createProxyMiddleware({
    logLevel: "debug",
    target: " https://itunes.apple.com/",
    headers: {},
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  })
);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
