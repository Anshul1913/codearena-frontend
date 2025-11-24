import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import Cookies from 'js-cookie';

export const connectSocket = (roomId, onMessageReceived, onConnected) => {
  
      const token = Cookies.get('jwtToken');
  console.log(token);
  
  const client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws-connect"),

    connectHeaders: {
      Authorization: `Bearer ${token}`  // 🔑 JWT passed in WebSocket headers
    },

    debug: () => {},
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("📡 Authenticated WebSocket connected");
      onConnected();

      client.subscribe(`/topic/room/${roomId}`, (message) => {
        const body = JSON.parse(message.body);
        onMessageReceived(body);
      });
    },

    onStompError: (error) => {
      console.error("❌ STOMP ERROR:", error);
    }
  });

  client.activate();
  return client;
};
