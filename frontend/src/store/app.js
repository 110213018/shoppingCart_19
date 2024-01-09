// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    //
  }),
});

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    token: null,
    user: {},
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    setUser(user) {
      this.user = user;
    },
    async login(username, password) {
      const response = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        this.setToken(data.data.accessToken);
        this.setUser(data.data.user);
      } else {
        console.log("Login failed");
      }
    },
    async register(username, password, role) {
      const response = await fetch("http://localhost:4000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Registration successful");
        console.log("Registration successful:", data);
      } else {
        console.log("Registration failed");
      }
    },
  },
});
