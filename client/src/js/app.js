/* eslint-disable no-console */
import formatDate from "./formatDate";

const ws = new WebSocket("ws://localhost:7070");
const inputMessage = document.querySelector("#input-message");
const divMessageList = document.querySelector(".message-list");
const formLogin = document.querySelector(".login");
const btnLogin = document.querySelector(".btn-login");
const inputLogin = document.querySelector("#nick");
const ulMembers = document.querySelector(".ul-members");
const divError = document.querySelector(".error");

function renderListMemders(arr) {
  ulMembers.textContent = "";
  arr.forEach((item) => {
    const liMember = document.createElement("li");
    liMember.classList.add("li-member");
    liMember.textContent = item.nick;
    ulMembers.append(liMember);
  });
}

function renderMessage({ id, nick, text, date }) {
  const divMessage = document.createElement("div");
  divMessage.classList.add("message");

  const divAutor = document.createElement("div");
  divAutor.classList.add("autor");

  const spanName = document.createElement("span");
  spanName.classList.add("name");
  spanName.textContent = `${nick}  `;
  divAutor.append(spanName);

  const spanDate = document.createElement("span");
  spanDate.classList.add("date");
  spanDate.textContent = formatDate(date);
  divAutor.append(spanDate);

  const spanTextMessage = document.createElement("span");
  spanTextMessage.classList.add("text-message");
  spanTextMessage.textContent = text;

  divMessage.append(divAutor);
  divMessage.append(spanTextMessage);
  divMessageList.append(divMessage);
  if (id === localStorage.getItem("IdUser")) {
    spanName.textContent = "you  ";
    divAutor.style.color = "red";
    divMessage.style.alignSelf = "flex-end";
  }
}

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  const nick = inputLogin.value;
  ws.send(JSON.stringify({ flag: "user", nick }));
  formLogin.classList.add("hidden");
});

inputMessage.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    const text = inputMessage.value;
    if (!text) return;
    const objMessage = {
      id: localStorage.getItem("IdUser"),
      text,
      date: Date.now(),
    };
    ws.send(JSON.stringify({ flag: "message", objMessage }));
    inputMessage.value = "";
  }
});

ws.addEventListener("error", (e) => {
  console.log(e);
  console.log("ws error");
});

ws.addEventListener("open", (e) => {
  console.log("ws open");
});

ws.addEventListener("message", (e) => {
  const data = JSON.parse(e.data);
  switch (data.flag) {
    case "IdUser":
      localStorage.setItem("IdUser", data.IdUser);
      break;
    case "members":
      renderListMemders(data.body);
      break;
    case "error":
      divError.textContent = data.body;
      formLogin.classList.remove("hidden");
      break;
    case "message":
      renderMessage(data.body);
      break;
    default:
      break;
  }
});
