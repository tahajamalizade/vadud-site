// src/store/projectStore.js
import { defineStore } from "pinia";
import { GraphQLClient, gql } from "graphql-request";
import { useAuthStore } from "./authStore";

const endpoint = "http://localhost:5000/graphql";

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
          authorization: authStore.token ? `Bearer ${authStore.token}` : "",
        },
      });
    },

    // ✅ Create new project
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

    // ✅ Fetch only the projects of the logged-in user
    async fetchMyProjects() {
      this.loading = true;
      try {
        const client = this.getClient();
        const query = gql`
          query {
            myProjects {
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
        const data = await client.request(query);
        this.projects = data.myProjects;
        this.error = null;
        return this.projects;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
