import express from "express";
const app = express();
app.get("/", (_req, res) => { res.send("version 4"); });
app.listen(8080);
