<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";

// register all components (scales, elements, controllers, plugins…)
Chart.register(...registerables);

const chartRef = ref(null);
let chartInstance = null;

onMounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "tasks",
          data: [12, 49, 3, 5, 2,44,4,12,9,43,22,11],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
</script>

<template>
  <q-card class="q-pa-sm" style="width: fit-content;">
    <div style="width: 600px; height: 400px">
      <canvas ref="chartRef"></canvas>
    </div>
  </q-card>
</template>
