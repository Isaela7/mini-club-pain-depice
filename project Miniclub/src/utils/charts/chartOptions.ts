export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    datalabels: {
      color: '#fff',
      font: {
        weight: 'bold'
      },
      formatter: (value: number) => value || ''
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
};