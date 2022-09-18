const WebSocket = require("ws");
const wsServer = new WebSocket.Server({ port: 7070 });
const uuid = require("uuid");
let members = [];

wsServer.on("connection", onConnect);

function onConnect(wsClient) {
  const id = uuid.v4();
  wsClient.send(JSON.stringify({ flag: "members", body: members }));
  wsClient.on("message", function (message) {
    const data = JSON.parse(message);
    switch (data.flag) {
      case "user":
        const isExist = members.find((item) => item.nick === data.nick);
        if (isExist) {
          wsClient.send(
            JSON.stringify({
              flag: "error",
              body: "Пользователь с таким ником уже есть в чате",
            })
          );
        } else {
          const user = { id, nick: data.nick };
          members.push(user);
          wsClient.send(JSON.stringify({ flag: "IdUser", IdUser: user.id }));
          [...wsServer.clients]
            .filter((o) => o.readyState === WebSocket.OPEN)
            .forEach((o) =>
              o.send(JSON.stringify({ flag: "members", body: members }))
            );
        }
        break;
      case "message":
        const nick = members.find(
          (item) => item.id === data.objMessage.id.toString()
        ).nick;
        [...wsServer.clients]
          .filter((o) => o.readyState === WebSocket.OPEN)
          .forEach((o) =>
            o.send(
              JSON.stringify({
                flag: "message",
                body: { ...data.objMessage, nick },
              })
            )
          );
        break;
      default:
        break;
    }
  });
  wsClient.on("close", function (e) {
    members = members.filter((item) => item.id !== id);
    [...wsServer.clients]
      .filter((o) => o.readyState === WebSocket.OPEN)
      .forEach((o) =>
        o.send(JSON.stringify({ flag: "members", body: members }))
      );
  });
}
