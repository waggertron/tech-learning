import { useEffect } from "react";

export function RoomTitle({ roomId }) {
  useEffect(() => {
    document.title = `Room ${roomId}`;
  }, []);
  return null;
}
