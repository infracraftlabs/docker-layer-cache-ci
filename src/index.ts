import express from "express";
const app = express();
app.get("/", (_req, res) => { res.send("version 1"); });
app.listen(8080);
