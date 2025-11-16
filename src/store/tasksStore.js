import { defineStore } from "pinia";
import { GraphQLClient, gql } from "graphql-request";
import { useAuthStore } from "./authStore"; // ← اضافه شد

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),
  getters: {
    completedTasksCount(state) {
      return state.tasks.length;
    },

    taskDistribution(state) {
      const counts = {
        TODO: 0,
        "IN PROGRESS": 0,
        DONE: 0,
      };

      state.tasks.forEach((task) => {
        const status = task.status.toUpperCase();
        if (counts.hasOwnProperty(status)) {
          counts[status]++;
        }
      });

      return [
        { priority: "TODO", value: counts["TODO"] },
        { priority: "IN PROGRESS", value: counts["IN PROGRESS"] },
        { priority: "DONE", value: counts["DONE"] },
      ];
    },
  },

  actions: {
    getClient() {
      const authStore = useAuthStore();
      return new GraphQLClient("http://localhost:5000/graphql", {
        headers: {
          authorization: authStore.token ? `Bearer ${authStore.token}` : "",
        },
      });
    },

    async fetchMyTasks() {
      this.loading = true;
      try {
        const query = gql`
          query GetMyTasks {
            myTasks {
              id
              title
              description
              status
              dueDate
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
        `;
        const res = await this.getClient().request(query);
        this.tasks = res.myTasks;
        this.error = null;
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching my tasks:", err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * @param {string} projectId
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
     * @param {string} taskId -
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
              dueDate
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
     * @param {string} projectId
     * @param {object} input
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
              dueDate
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
        this.tasks.push(res.createTask);
        return res.createTask;
      } catch (err) {
        console.error("Error creating task:", err);
        throw err;
      }
    },

    /**
     * @param {string} taskId
     * @param {object} input
     */
    async updateTask({ taskId, input }) {
      const mutation = gql`
        mutation UpdateTask($id: ID!, $input: TaskUpdateInput!) {
          updateTask(id: $id, input: $input) {
            id
            title
            description
            status
            dueDate
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
     * @param {string} taskId
     */
    async deleteTask(taskId) {
      const mutation = gql`
        mutation DeleteTask($id: ID!) {
          deleteTask(id: $id)
        }
      `;
      try {
        await this.getClient().request(mutation, { id: taskId });
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
              team {
                id
              }
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
    async fetchTeamMembers(teamId) {
      this.loading = true;
      try {
        const query = gql`
          query GetTeam($teamId: ID!) {
            team(id: $teamId) {
              id
              name
              members {
                id
                name
              }
            }
          }
        `;
        const res = await this.getClient().request(query, { teamId });
        return res.team.members;
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching team members:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchProjectById(projectId) {
      try {
        const query = gql`
          query GetProjectById($projectId: ID!) {
            project(id: $projectId) {
              id
              name
              team {
                id
              }
            }
          }
        `;
        const res = await this.getClient().request(query, { projectId });
        return res.project;
      } catch (err) {
        console.error("Error fetching project by ID:", err);
        throw err;
      }
    },
    async fetchTasksByProject(projectId) {
      try {
        const authStore = useAuthStore(); // ← Add this line
        const client = this.getClient();
        const query = gql`
          query TasksByProject($projectId: ID!) {
            tasks(projectId: $projectId, status: null) {
              items {
                id
                title
                status
                assignee {
                  id
                  name
                }
                project {
                  id
                  name
                }
              }
            }
          }
        `;
        const data = await client.request(query, { projectId });
        this.tasks = data.tasks.items.filter(
          (t) => t.assignee?.id === authStore.user?.id
        );
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
});
