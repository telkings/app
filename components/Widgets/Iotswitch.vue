<template>
  <card>
    <template slot="header">
      <h5 class="card-category">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h5>

      <h3 class="card-title">
        <i
          class="fa "
          :class="[config.icon, getIconColorClass()]"
          aria-hidden="true"
          style="font-size: 30px;"
        ></i>
        <base-switch
          @click="
            sending = !sending;
            sendValue();
          "
          :value="sending"
          type="primary"
          on-text="ON"
          off-text="OFF"
          style="margin-top: 10px;"
          class="pull-right"
        >
        </base-switch>
      </h3>
    </template>
  </card>
</template>

<script>
export default {
  name: "iotswitch",
  props: ["config"],

  data() {
    return {
      value: false,
      sending: false, // base de datos
      statusdevice: false,
      topic: "",
      props: ["config"]
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          //this.value = false;

          this.$nuxt.$off(this.topic);

          //userId/dId/uniquestr/sdata
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable +
            "/sdata";
          this.$nuxt.$on(this.topic, this.processReceivedData);
        }, 300);
      }
    }
  },

  mounted() {
    this.topic =
      this.config.userId +
      "/" +
      this.config.selectedDevice.dId +
      "/" +
      this.config.variable +
      "/sdata";
    this.$nuxt.$on(this.topic, this.processReceivedData);
    this.updatedevicedata();
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic);
  },
  methods: {
    async updatedevicedata(datadevice) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        client: {
          id: this.config.userId,
          dId: this.config.selectedDevice.dId,
          data: datadevice
        }
      };

      try {
        const res = await this.$axios.put(
          "/updatedevice",
          toSend,
          axiosHeaders
        );

        if (res.data.status == "success") {
          if (res.data.datadevice != "") {
            if (res.data.datadevice == "true") {
              this.value = true;
              this.sending = true;
            }

            if (res.data.datadevice == "false") {
              this.value = false;
              this.sending = false;
            }

            console.log("Obteniendo datos");
          } else {
            console.log("Dato actualizado");
          }
        }
      } catch (error) {
        console.log(error);
        return;
      }
    },
    processReceivedData(data) {
      try {
        console.log("received");
        console.log(data);
        this.value = data.value;
        this.statusdevice = true;
        this.sending = data.value;
        this.updatedevicedata(data.value);
        setTimeout(() => {
          this.statusdevice = false;
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    },
    getIconColorClass() {
      //para apagar el icono
      if (!this.value) {
        return "text-dark";
      }

      if (this.config.class == "success") {
        return "text-success";
      }
      if (this.config.class == "primary") {
        return "text-secondary";
      }
      if (this.config.class == "warning") {
        return "text-default";
      }
      if (this.config.class == "danger") {
        return "text-danger";
      }
    },

    sendValue() {
      setTimeout(() => {
        if (this.statusdevice == false) {
          this.sending = !this.sending;
        }
      }, 2000);

      const toSend = {
        topic:
          this.config.userId +
          "/" +
          this.config.selectedDevice.dId +
          "/" +
          this.config.variable +
          "/actdata",
        msg: {
          value: this.sending
        }
      };

      $nuxt.$emit("mqtt-sender", toSend);
    }
  }
};
</script>
<style></style>
