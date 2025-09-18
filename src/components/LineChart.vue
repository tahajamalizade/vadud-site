<template>
  <q-card class="q-pa-sm" style="width: fit-content">
    <div style="width: 600px; height: 400px">
      <canvas ref="chartRef"></canvas>
    </div>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";
import { useTaskStore } from "../store/tasksStore";
import { useRoute } from "vue-router";

Chart.register(...registerables);

const route = useRoute();
const projectId = route.params.id;

const chartRef = ref(null);
let chartInstance = null;

const taskStore = useTaskStore();

const monthlyCounts = ref(new Array(12).fill(0));
const chartLabels = ref([
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December",
]);

const updateChartData = () => {
  const counts = new Array(12).fill(0);
  taskStore.tasks.forEach((task) => {
    try {
      const date = new Date(task.createdAt);
      const month = date.getMonth();
      if (!isNaN(date) && month >= 0 && month < 12) {
        counts[month]++;
      }
    } catch (e) {
      console.error("Invalid task date format:", task.createdAt);
    }
  });
  monthlyCounts.value = counts;

  if (chartInstance) {
    chartInstance.data.datasets[0].data = monthlyCounts.value;
    chartInstance.update();
  }
};

onMounted(async () => {
  if (projectId) {
    await taskStore.fetchTasks(projectId);
    updateChartData();
  } else {
    console.warn("No projectId found to fetch tasks.");
  }

  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels: chartLabels.value,
      datasets: [
        {
          label: "Tasks",
          data: monthlyCounts.value,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)",
            "rgba(199, 199, 199, 0.6)", "rgba(83, 102, 255, 0.6)", "rgba(255, 99, 255, 0.6)",
            "rgba(99, 255, 132, 0.6)", "rgba(54, 235, 162, 0.6)", "rgba(162, 54, 235, 0.6)",
          ],
          borderColor: "rgba(0,0,0,0.1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: "top" },
      },
      scales: {
        x: { beginAtZero: true },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Tasks",
          },
        },
      },
    },
  });
});

watch(() => taskStore.tasks, updateChartData, { deep: true });
</script>

<style scoped>
.q-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
