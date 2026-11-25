import express from "express";
const app = express();
app.get("/", (_req, res) => { res.send("version 3"); });
app.listen(8080);
