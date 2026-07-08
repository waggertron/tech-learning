// @ts-nocheck
import { useEffect } from "react";
import { createChatConnection } from "../../content/docs/posts/_react-example-modules/chat";

export function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createChatConnection(roomId);
    connection.connect();

    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Room {roomId}</h1>;
}
