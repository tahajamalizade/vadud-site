import { defineStore } from "pinia";
import { GraphQLClient, gql } from "graphql-request";
import { useAuthStore } from "./authStore";

export const useTeamStore = defineStore("team", {
  state: () => ({
    teams: [],
  }),

  actions: {
    getClient() {
      const authStore = useAuthStore();
      return new GraphQLClient("http://localhost:5000/graphql", {
        headers: {
          authorization: authStore.token ? `Bearer ${authStore.token}` : "",
        },
      });
    },
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

    async addMemberToTeam(teamId, userId) {
      const mutation = gql`
        mutation AddUserToTeam($teamId: ID!, $userId: ID!) {
          addUserToTeam(teamId: $teamId, userId: $userId) {
            id
            name
            members {
              id
              name
              email
              role
            }
          }
        }
      `;
      return this.getClient().request(mutation, { teamId, userId });
    },

    async removeMemberFromTeam(teamId, userId) {
      const mutation = gql`
        mutation RemoveUserFromTeam($teamId: ID!, $userId: ID!) {
          removeUserFromTeam(teamId: $teamId, userId: $userId) {
            id
            name
            members {
              id
              name
              email
              role
            }
          }
        }
      `;
      return this.getClient().request(mutation, { teamId, userId });
    },

    async createTeam(name, members) {
      try {
        const mutation = gql`
          mutation NewTeam($name: String!, $members: [ID!]) {
            createTeam(name: $name, members: $members) {
              id
              name
              createdAt
              updatedAt
            }
          }
        `;
        const data = await this.getClient().request(mutation, {
          name,
          members,
        });
        this.teams.push(data.createTeam);
        return data.createTeam;
      } catch (err) {
        console.error("Error creating team:", err);
        throw err;
      }
    },
  },
});
