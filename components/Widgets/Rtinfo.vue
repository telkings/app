<template>
  <card>
    <div slot="header">
      <h5 class="card-category pull-right">
        {{ getTimeAgo((nowTime - time) / 1000) }} ago
      </h5>

      <h4 class="card-title">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h4>
   

    <i
      class="fa "
      :class="[config.icon, getIconColorClass()]"
      style="font-size: 30px"
    ></i>

    <div class="row pull-right">
      <p class="iotfont-size">{{value.toFixed(config.decimalPlaces)}}</p>
      <p class="iotfont-unit">{{ config.unit }}</p>
    </div>
     </div>
  </card>
</template>


<script>
export default {
  props: ["config"],
  data() {
    return {
      receivedTime: 0,
      value: 0,
      time: Date.now(),
      nowTime: Date.now(),
      isMounted: false,
      topic: ""
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.value = 0;

          this.$nuxt.$off(this.topic + "/sdata");

          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable;
          this.$nuxt.$on(this.topic + "/sdata", this.procesReceivedData);

          this.getLastData();

          window.dispatchEvent(new Event("resize"));
        }, 300);
      }
    }
  },
  mounted() {
    this.getNow();
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },
  methods: {
    getIconColorClass() {
      if (this.config.class == "success") {
        return "text-success";
      }
      if (this.config.class == "primary") {
        return "text-primary";
      }
      if (this.config.class == "warning") {
        return "text-warning";
      }
      if (this.config.class == "danger") {
        return "text-danger";
      }
    },

    procesReceivedData(data) {
      try {
        this.time = Date.now();
        this.value = data.value;

        setTimeout(() => {
          if (data.save == 1) {
           
          }
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    },

    getNow() {
      this.nowTime = Date.now();
      setTimeout(() => {
        this.getNow();
      }, 1000);
    },

    getTimeAgo(seconds) {
      if (seconds < 0) {
        seconds = 0;
      }

      if (seconds < 59) {
        return seconds.toFixed() + " secs";
      }

      if (seconds > 59 && seconds <= 3600) {
        seconds = seconds / 60;
        return seconds.toFixed() + " min";
      }

      if (seconds > 3600 && seconds <= 86400) {
        seconds = seconds / 3600;
        return seconds.toFixed() + " hour";
      }

      if (seconds > 86400) {
        seconds = seconds / 86400;
        return seconds.toFixed() + " day";
      }
    },

    getLastData(){

 
                const axiosHeaders = {
                    headers: {
                        token: $nuxt.$store.state.auth.token,
                    },
                    params: { dId: this.config.selectedDevice.dId, variable: this.config.variable, chartTimeAgo: this.config.chartTimeAgo }
                }

                this.$axios.get("/get-last-data", axiosHeaders)
                    .then(res => {
                        
                        //this.chartOptions.series[0].data = [];
                        const data = res.data.data;
                        console.log(res.data)

                        this.value = data.[0].value;



                        this.isMounted = true;


                        return;

                    })
                    .catch(e => {

                        console.log(e)
                        return;

                    });

            },



  }
};
</script>
<style></style>
