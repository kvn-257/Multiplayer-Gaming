const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const ejsMate = require("ejs-mate");
const cors = require("cors");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://192.168.96.48:3000",
    methods: ["GET", "POST"],
  },
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./public/views/"));

app.use(express.static(path.join(__dirname, "./public/assets/")));
app.use(
  cors({
    origin: ["http://192.168.96.48:3000"],
    credentials: true,
  })
);

let arr = [];
let roomId = [];
let playingArray = [];
io.on("connection", (socket) => {
  console.log(socket.id + " connected.");
  socket.on("find", (e) => {
    console.log(e.roomId);
    if (e.name != null) {
      arr.push(e.name);
      roomId.push(e.roomId);

      if (roomId.length >= 2 && roomId[0] == roomId[1]) {
        let p1obj = {
          p1name: arr[0],
          p1value: "X",
          p1move: "",
        };
        let p2obj = {
          p2name: arr[1],
          p2value: "O",
          p2move: "",
        };
        let obj = {
          p1: p1obj,
          p2: p2obj,
          sum: 1,
        };
        playingArray.push(obj);
        console.log(obj);
        arr.splice(0, 2);
        roomId.splice(0, 2);
        io.emit("find", { allPlayers: playingArray });
      }
    }
  });

  socket.on("playing", (e) => {
    if (e.value == "X") {
      let objToChange = playingArray.find((obj) => obj.p1.p1name === e.name);
      console.log(objToChange);
      objToChange.p1.p1move = e.id;
      objToChange.sum++;
    } else if (e.value == "O") {
      let objToChange = playingArray.find((obj) => obj.p2.p2name === e.name);

      objToChange.p2.p2move = e.id;
      objToChange.sum++;
    }

    io.emit("playing", { allPlayers: playingArray });
  });
});

app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/dashboard", function (req, res) {
  res.render("dashboard.ejs");
});

app.get("/tictactoe", function (req, res) {
  res.render("tictactoe.ejs");
});

server.listen(3000, function () {
  console.log("Server started on port 3000");
});
