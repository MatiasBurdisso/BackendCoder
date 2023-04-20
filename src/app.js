import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import loginRouter from "./routes/login.routes.js";
import signupRouter from "./routes/signup.routes.js";
import profileRouter from "./routes/profile.routes.js";
import forgotRouter from "./routes/forgot.routes.js";


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "coderhouse",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://burdio:7654321@cluster0.pzcooec.mongodb.net/users?retryWrites=true&w=majority",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 15,
    }),
  })
);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.static("public"));
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/profile", profileRouter);
app.use("/forgot", forgotRouter);

const server = app.listen(8080, () => {
  console.log("Server running on port " + 8080);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));

const environment = async () => {
  try {
    await mongoose.connect("mongodb+srv://burdio:7654321@cluster0.pzcooec.mongodb.net/users?retryWrites=true&w=majority");
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log(`Error al conectar a MongoDB: ${error}`);
  }
};

environment();