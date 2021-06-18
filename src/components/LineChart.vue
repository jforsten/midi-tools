<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: ['labels', 'values'],
  data: () => ({
    timer: null,
    updateCounter: 10,
  }),
  computed: {
    chartData: function() {
      return this.values
    },
  },
  methods: {
    renderLineChart: function() {
      this.renderChart(
        {
          labels: this.labels,
          datasets: [
            {
              data: this.chartData,
              backgroundColor: 'transparent',
              borderColor: 'rgba(1, 116, 188, 0.50)',
              pointRadius: 0,
            },
          ],
        },
        {
          animation: {
            duration: 0,
          },
          legend: {
            display: false,
          },
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            yAxes: [
              {
                display: true,
                ticks: {
                  beginAtZero: true, 
                  min: 0,
                  max: 127,
                  stepSize: 32,
                },
              },
            ],
            xAxes: [
              {
                display: true,
                ticks: {
                  beginAtZero: true, 
                 
                  min: 0,
                  max: 127,
                  stepSize: 32,
                },
              },
            ],
          },
        }
      )
    },

    delay(ms) {
      return new Promise((resolve) => (this.timer = setTimeout(resolve, ms)))
    },
    
  },
  watch: {

    values: function() {
      
      this.updateCounter = this.updateCounter++ % 10

      if (this.updateCounter < 9) {
        clearTimeout(this.timer)
      }

      this.delay(10).then(() => {
        this.$data._chart.destroy()
        this.renderLineChart()
      })
    },

  },

  mounted() {
    this.renderLineChart()
  },
}
</script>
