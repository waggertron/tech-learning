type ChatConnection = {
  connect: () => string;
  disconnect: () => string;
};

export function createChatConnection(roomId: string): ChatConnection {
  return {
    connect() {
      return `connected:${roomId}`;
    },
    disconnect() {
      return `disconnected:${roomId}`;
    },
  };
}
