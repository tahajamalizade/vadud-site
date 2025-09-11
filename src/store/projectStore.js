import { defineStore } from "pinia";
import { GraphQLClient, gql } from "graphql-request";
import { useAuthStore } from "./authStore";

const endpoint = "http://localhost:5000/graphql"; // update if needed

export const useProjectStore = defineStore("project", {
  state: () => ({
    projects: [],
    loading: false,
    error: null,
  }),

  actions: {
    getClient() {
      const authStore = useAuthStore();
      return new GraphQLClient(endpoint, {
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : "",
        },
      });
    },

    async fetchProjects(teamId) {
      this.loading = true;
      try {
        const client = this.getClient();
        const query = gql`
          query GetProjects($teamId: ID!) {
            projects(teamId: $teamId) {
              id
              name
              createdAt
              updatedAt
              team {
                id
                name
              }
            }
          }
        `;
        const data = await client.request(query, { teamId });
        this.projects = data.projects;
        this.error = null;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async createProject({ teamId, name }) {
      try {
        const client = this.getClient();
        const mutation = gql`
          mutation CreateProject($teamId: ID!, $name: String!) {
            createProject(teamId: $teamId, name: $name) {
              id
              name
              createdAt
              updatedAt
              team {
                id
                name
              }
            }
          }
        `;
        const variables = { teamId, name };
        const data = await client.request(mutation, variables);
        this.projects.push(data.createProject);
        return data.createProject;
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },
  },
});
