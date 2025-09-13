import { defineStore } from "pinia";
import { GraphQLClient, gql } from "graphql-request";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    users: [], // Add this line to store all users
  }),

  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
    getUsers(state) {
      return state.users;
    },
  },

  actions: {
    getClient() {
      return new GraphQLClient("http://localhost:5000/graphql", {
        headers: {
          authorization: this.token ? `Bearer ${this.token}` : "",
        },
      });
    },

    async login({ email, password }) {
      const mutation = gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            user {
              id
              name
              email
            }
          }
        }
      `;
      const res = await this.getClient().request(mutation, { email, password });

      this.user = res.login.user;
      this.token = res.login.token;
      localStorage.setItem("token", this.token);
    },

    async register({ name, email, password }) {
      const mutation = gql`
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            token
            user {
              id
              name
              email
            }
          }
        }
      `;

      const variables = {
        input: {
          name,
          email,
          password,
        },
      };

      const res = await this.getClient().request(mutation, variables);

      this.user = res.register.user;
      this.token = res.register.token;
      localStorage.setItem("token", this.token);
    },

    async fetchMe() {
      const query = gql`
        query GetMe {
          me {
            id
            name
            email
            role
          }
        }
      `;
      try {
        const response = await this.getClient().request(query);
        this.user = response.me;
      } catch (error) {
        console.error("Error fetching current user:", error);
        // Handle token expiration or invalid token
        this.token = null;
        this.user = null;
        localStorage.removeItem("token");
      }
    },

    // Add this new action to fetch all users
    async fetchAllUsers() {
      const query = gql`
        query GetAllUsers {
          users {
            id
            name
            email
            role
          }
        }
      `;
      try {
        const response = await this.getClient().request(query);
        this.users = response.users;
      } catch (error) {
        console.error("Error fetching all users:", error);
        throw error; // Rethrow the error to be caught by the component
      }
    },

    async updateUserRole(userId, newRole) {
      const mutation = gql`
        mutation UpdateUserRole($userId: ID!, $newRole: Role!) {
          updateUserRole(userId: $userId, newRole: $newRole) {
            id
            role
          }
        }
      `;
      const variables = {
        userId,
        newRole,
      };

      await this.getClient().request(mutation, variables);
      // You can also update the local store state here if needed
      const userToUpdate = this.users.find((user) => user.id === userId);
      if (userToUpdate) {
        userToUpdate.role = newRole;
      }
    },

    checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        this.token = token;
      }
    },
  },
});
