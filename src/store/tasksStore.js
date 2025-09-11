import { defineStore } from "pinia";
import { GraphQLClient, gql } from "graphql-request";
import { useAuthStore } from "./authStore";

export const useTaskStore = defineStore("task", {
  state: () => ({
    // The state is now a simple array to hold all tasks
    tasks: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Helper function to get an authenticated GraphQL client
    getClient() {
      const authStore = useAuthStore();
      return new GraphQLClient("http://localhost:5000/graphql", {
        headers: {
          authorization: authStore.token ? `Bearer ${authStore.token}` : "",
        },
      });
    },

    /**
     * Fetches all tasks for a specific project without pagination.
     * @param {string} projectId - The ID of the project to fetch tasks for.
     */
    async fetchTasks(projectId) {
      this.loading = true;
      try {
        const query = gql`
          query GetTasks($projectId: ID!) {
            tasks(projectId: $projectId) {
              items {
                id
                title
                description
                status
                assignee {
                  id
                  name
                }
                project {
                  id
                  name
                }
                createdAt
              }
            }
          }
        `;
        const res = await this.getClient().request(query, { projectId });
        // The result is now an array of items, not a paginated object
        this.tasks = res.tasks.items;
        this.error = null;
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching tasks:", err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetches a single task with all details, including comments.
     * @param {string} taskId - The ID of the task to fetch.
     */
    async fetchTask(taskId) {
      this.loading = true;
      try {
        const query = gql`
          query GetTask($id: ID!) {
            task(id: $id) {
              id
              title
              description
              status
              assignee {
                id
                name
              }
              comments {
                id
                text
                author {
                  id
                  name
                }
                createdAt
              }
              createdAt
              updatedAt
            }
          }
        `;
        const res = await this.getClient().request(query, { id: taskId });
        return res.task;
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching task:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Creates a new task.
     * @param {string} projectId - The project's ID.
     * @param {object} input - The task data (title, description, assigneeId, etc.).
     */
    async createTask({ projectId, input }) {
      try {
        const mutation = gql`
          mutation NewTask($projectId: ID!, $input: TaskInput!) {
            createTask(projectId: $projectId, input: $input) {
              id
              title
              description
              status
              assignee {
                id
                name
              }
            }
          }
        `;
        const res = await this.getClient().request(mutation, {
          projectId,
          input,
        });
        // Push the new task to the local state
        this.tasks.push(res.createTask);
        return res.createTask;
      } catch (err) {
        console.error("Error creating task:", err);
        throw err;
      }
    },

    /**
     * Updates an existing task.
     * @param {string} taskId - The task's ID.
     * @param {object} input - The task data to update.
     */
    async updateTask({ taskId, input }) {
      const mutation = gql`
        mutation UpdateTask($id: ID!, $input: TaskUpdateInput!) {
          updateTask(id: $id, input: $input) {
            id
            title
            description
            status
            assignee {
              id
              name
            }
          }
        }
      `;
      try {
        const res = await this.getClient().request(mutation, {
          id: taskId,
          input,
        });
        // Update the task in the local state for a responsive UI
        const taskIndex = this.tasks.findIndex(
          (t) => t.id === res.updateTask.id
        );
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = res.updateTask;
        }
        return res.updateTask;
      } catch (err) {
        console.error("Error updating task:", err);
        throw err;
      }
    },

    /**
     * Deletes a task.
     * @param {string} taskId - The ID of the task to delete.
     */
    async deleteTask(taskId) {
      const mutation = gql`
        mutation DeleteTask($id: ID!) {
          deleteTask(id: $id)
        }
      `;
      try {
        await this.getClient().request(mutation, { id: taskId });
        // Remove the task from the local state
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        return true;
      } catch (err) {
        console.error("Error deleting task:", err);
        throw err;
      }
    },

    /**
     * Adds a new comment to a task.
     * @param {string} taskId - The task's ID.
     * @param {string} text - The comment's text.
     */
    async addComment({ taskId, text }) {
      try {
        const mutation = gql`
          mutation AddComment($taskId: ID!, $text: String!) {
            addComment(taskId: $taskId, text: $text) {
              id
              text
              author {
                id
                name
              }
              createdAt
            }
          }
        `;
        const res = await this.getClient().request(mutation, { taskId, text });
        return res.addComment;
      } catch (err) {
        console.error("Error adding comment:", err);
        throw err;
      }
    },

    /**
     * Fetches all teams for the current user.
     */
    async fetchTeams() {
      this.loading = true;
      try {
        const query = gql`
          query GetTeams {
            teams {
              id
              name
              createdBy {
                id
                name
              }
            }
          }
        `;
        const res = await this.getClient().request(query);
        return res.teams;
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching teams:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetches projects for a specific team.
     * @param {string} teamId - The team's ID.
     */
    async fetchProjects(teamId) {
      this.loading = true;
      try {
        const query = gql`
          query GetProjects($teamId: ID!) {
            projects(teamId: $teamId) {
              id
              name
              createdAt
            }
          }
        `;
        const res = await this.getClient().request(query, { teamId });
        return res.projects;
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching projects:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
