import io from "socket.io-client";
import { DOMAIN, DOMAIN2, DOMAIN3 } from "./service";

var socket = io(DOMAIN3, {
  transports: ["websocket", "polling", "flashsocket"],
});

export default socket;
