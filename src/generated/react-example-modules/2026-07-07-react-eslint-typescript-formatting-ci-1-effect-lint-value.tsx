// @ts-nocheck
import { useEffect } from "react";

export function RoomTitle({ roomId }: { roomId: string }) {
  useEffect(() => {
    document.title = "Room " + roomId;
  }, [roomId]);

  return <h1>Room {roomId}</h1>;
}
