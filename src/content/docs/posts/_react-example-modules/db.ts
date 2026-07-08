export const db = {
  project: {
    async delete() {
      return { id: "project-1" };
    },
  },
  profile: {
    async update() {
      return { id: "profile-1", displayName: "Ada Lovelace" };
    },
  },
};
