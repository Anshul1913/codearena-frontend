import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import Cookies from 'js-cookie';
let client = null;
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
export const subscribeToChat = (roomId, onMessageReceived = () => {}) => {
  if (!client) return;
  client.subscribe(`/topic/room/${roomId}`, (message) => {
    const body = JSON.parse(message.body);
    onMessageReceived(body);
  });
};

export const startMatchSocket = (roomId) => {
  client.publish({
    destination: "/app/room/start",
    body: JSON.stringify({ roomCode: roomId }),
  });
};
export const subscribeToRoomStatus = (roomId, onStatusReceived = () => {}) => {
  if (!client) return;
  client.subscribe(`/topic/room/${roomId}/status`, (message) => {
    const body = JSON.parse(message.body);
    console.log("📩 STATUS EVENT:", body);
    onStatusReceived(body);
  });
};


export const webconnectSocket = (onConnected = () => {}) => {
  const token = Cookies.get("jwtToken");

  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws-connect"),

    connectHeaders: {
      Authorization: `Bearer ${token}`
    },

    reconnectDelay: 5000,
    debug: () => {},

    onConnect: () => {
      console.log("📡 Authenticated WebSocket Connected");
      onConnected();
    },

    onStompError: (error) => {
      console.error("❌ STOMP ERROR:", error);
    }
  });

  client.activate();
  return client;
};
