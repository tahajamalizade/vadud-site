import { defineStore } from "pinia";
import { GraphQLClient, gql } from "graphql-request";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isLoggedIn(state) {
      return !!state.token;
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

    /**
     * This query fetches all teams and their members.
     * It then flattens the list to return a unique array of all users.
     */


    /**
     * Fetches the current authenticated user's details.
     */
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


    checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        this.token = token;
      }
    },
  },
});
