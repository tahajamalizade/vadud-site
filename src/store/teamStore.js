import { defineStore } from "pinia";
import { GraphQLClient, gql } from "graphql-request";
import { useAuthStore } from "./authStore"; // Import the auth store

export const useTeamStore = defineStore("team", {
  state: () => ({
    teams: [],
  }),

  actions: {
    // This action retrieves the auth token from the auth store and
    // creates an authenticated GraphQL client for this store's requests.
    getClient() {
      const authStore = useAuthStore();
      return new GraphQLClient("http://localhost:5000/graphql", {
        headers: {
          authorization: authStore.token ? `Bearer ${authStore.token}` : "",
        },
      });
    },

    /**
     * Fetches all teams from the backend.
     * It includes nested fields for members, projects, and the creator.
     */
    async fetchTeams() {
      try {
        const query = gql`
          query GetTeams {
            teams {
              id
              name
              createdAt
              updatedAt
              members {
                id
                name
                email
                role
              }
              createdBy {
                id
                name
              }
              projects {
                id
                name
                createdAt
              }
            }
          }
        `;
        const data = await this.getClient().request(query);
        this.teams = data.teams;
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    },

    /**
     * Creates a new team on the backend and adds it to the store.
     */
    async createTeam(name) {
      try {
        const mutation = gql`
          mutation NewTeam($name: String!) {
            createTeam(name: $name) {
              id
              name
              createdAt
              updatedAt
            }
          }
        `;
        const data = await this.getClient().request(mutation, { name });
        this.teams.push(data.createTeam);
        return data.createTeam;
      } catch (err) {
        console.error("Error creating team:", err);
        throw err;
      }
    },
  },
});
