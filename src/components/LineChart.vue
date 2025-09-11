<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const chartRef = ref(null);
let chartInstance = null;

onMounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartRef.value, {
    type: "bar", // نمودار ستونی
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
          label: "Tasks",
          data: [12, 49, 3, 5, 2, 44, 4, 12, 9, 43, 22, 11],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(199, 199, 199, 0.6)",
            "rgba(83, 102, 255, 0.6)",
            "rgba(255, 99, 255, 0.6)",
            "rgba(99, 255, 132, 0.6)",
            "rgba(54, 235, 162, 0.6)",
            "rgba(162, 54, 235, 0.6)",
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
  <q-card class="q-pa-sm" style="width: fit-content">
    <div style="width: 600px; height: 400px">
      <canvas ref="chartRef"></canvas>
    </div>
  </q-card>
</template>
