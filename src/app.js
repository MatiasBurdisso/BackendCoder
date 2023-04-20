import express, { urlencoded } from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewRouter from "./routes/views.router.js";
import ChatManager from "./dao/db-managers/chat.manager.js";

const app = express();
app.use(urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());

const chatManager = new ChatManager();

mongoose
    .connect("mongodb+srv://burdio:7654321@cluster0.pzcooec.mongodb.net/chat?retryWrites=true&w=majority")
    .then((conn) => {
        console.log("Conected to MongoDB!!");
});

const httpServer = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected.");

  socket.on("new-message", async (data) => {
    const { stat, result } = await chatManager.newMessage(data);
    //mando result.result porque lo recibe asi desde el find()
    io.emit("messages", result.result);
  });
});

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

//midle para recibir io desde el router
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/", viewRouter);