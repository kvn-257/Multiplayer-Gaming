//Client Side
document.getElementById("loading").style.display = "none";
document.getElementById("bigcont").style.display = "none";
document.getElementById("userCont").style.display = "none";
document.getElementById("oppNameCont").style.display = "none";
document.getElementById("valueCont").style.display = "none";
document.getElementById("whosTurn").style.display = "none";

const socket = io();

let name, roomId;

document.getElementById("find").addEventListener("click", function () {
  console.log("clicked");

  roomId = document.getElementById("roomid").value;
  name = document.getElementById("name").value;
  if ((roomId == "" || roomId == null) && (name == "" || name == null)) {
    window.alert("Enter all details before proceding");
  } else {
    socket.emit("find", { name: name, roomId: roomId });
    console.log(name + " is looking for a game in room " + roomId);
    document.getElementById("loading").style.display = "block";

    document.getElementById("find").disabled = true;
  }
});

socket.on("find", (e) => {
  let allPlayersArray = e.allPlayers;
  console.log(allPlayersArray);
  document.getElementById("userCont").style.display = "block";
  document.getElementById("oppNameCont").style.display = "block";

  document.getElementById("valueCont").style.display = "block";
  document.getElementById("loading").style.display = "none";
  document.getElementById("roomid").style.display = "none";
  document.getElementById("name").style.display = "none";
  document.getElementById("find").style.display = "none";
  document.getElementById("enterroomId").style.display = "none";
  document.getElementById("enterName").style.display = "none";
  document.getElementById("bigcont").style.display = "block";
  document.getElementById("userName").innerText = name;
  document.getElementById("whosTurn").style.display = "block";
  document.getElementById("whosTurn").innerText = "X 's Trun";

  let oppName, value;

  const foundObj = allPlayersArray.find(
    (obj) => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`
  );
  console.log(foundObj);

  foundObj.p1.p1name == `${name}`
    ? (oppName = foundObj.p2.p2name)
    : (oppName = foundObj.p1.p1name);
  foundObj.p1.p1name == `${name}`
    ? (value = foundObj.p2.p2value)
    : (value = foundObj.p1.p1value);

  document.getElementById("oppName").innerText = oppName;
  document.getElementById("value").innerText = value;
});

document.querySelectorAll(".btn").forEach((e) => {
  e.addEventListener("click", function () {
    let value = document.getElementById("value").innerHTML;
    e.innerText = value;
    console.log(oppName.innerText);
    let t = { value: value, id: e.id, name: oppName.innerText };
    console.log(t);
    socket.emit("playing", t);
  });
});

socket.on("playing", (e) => {
  const foundObj = e.allPlayers.find(
    (obj) => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`
  );

  p1id = foundObj.p1.p1move;
  p2id = foundObj.p2.p2move;

  if (foundObj.sum % 2 == 0) {
    document.getElementById("whosTurn").innerText = "O 's Trun";
  } else {
    document.getElementById("whosTurn").innerText = "X 's Trun";
  }

  if (p1id != "") {
    document.getElementById(`${p1id}`).innerText = "X";
    document.getElementById(`${p1id}`).disabled = true;
    document.getElementById(`${p1id}`).style.color = "black";
  }
  if (p2id != "") {
    document.getElementById(`${p2id}`).innerText = "O";
    document.getElementById(`${p2id}`).disabled = true;
    document.getElementById(`${p2id}`).style.color = "black";
  }
  check(name, foundObj.sum);
});

function check(name, sum) {
  document.getElementById("btn1").innerText == ""
    ? (b1 = "a")
    : (b1 = document.getElementById("btn1").innerText);
  document.getElementById("btn2").innerText == ""
    ? (b2 = "b")
    : (b2 = document.getElementById("btn2").innerText);
  document.getElementById("btn3").innerText == ""
    ? (b3 = "c")
    : (b3 = document.getElementById("btn3").innerText);
  document.getElementById("btn4").innerText == ""
    ? (b4 = "d")
    : (b4 = document.getElementById("btn4").innerText);
  document.getElementById("btn5").innerText == ""
    ? (b5 = "e")
    : (b5 = document.getElementById("btn5").innerText);
  document.getElementById("btn6").innerText == ""
    ? (b6 = "f")
    : (b6 = document.getElementById("btn6").innerText);
  document.getElementById("btn7").innerText == ""
    ? (b7 = "g")
    : (b7 = document.getElementById("btn7").innerText);
  document.getElementById("btn8").innerText == ""
    ? (b8 = "h")
    : (b8 = document.getElementById("btn8").innerText);
  document.getElementById("btn9").innerText == ""
    ? (b9 = "i")
    : (b9 = document.getElementById("btn9").innerText);

  if (
    (b1 == b2 && b2 == b3) ||
    (b4 == b5 && b5 == b6) ||
    (b7 == b8 && b8 == b9) ||
    (b1 == b4 && b4 == b7) ||
    (b2 == b5 && b5 == b8) ||
    (b3 == b6 && b6 == b9) ||
    (b1 == b5 && b5 == b9) ||
    (b3 == b5 && b5 == b7)
  ) {
    socket.emit("gameOver", { name: name });

    setTimeout(() => {
      sum % 2 == 0 ? alert("X WON !!") : alert("O WON !!");

      setTimeout(() => {
        location.reload();
      }, 2000);
    }, 100);
  } else if (sum == 10) {
    socket.emit("gameOver", { name: name });

    setTimeout(() => {
      alert("DRAW!!");

      setTimeout(() => {
        location.reload();
      }, 2000);
    }, 100);
  }
}
