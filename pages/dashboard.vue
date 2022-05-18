<template>
  <div>
    <div
      v-if="this.usertype == '2'"
      id="map-wrap"
      style="height:550px; width:100%;"
    >
      <l-map :zoom="zoom" :center="center">
        <l-tile-layer :url="url"></l-tile-layer>
        <l-marker
          :draggable="false"
          :lat-lng="getCoord(item.lat, item.long)"
          v-for="item in positionDevices"
          :key="item.id"
        >
          <l-icon :icon-url="icon" :icon-size="iconSize" />
          <l-popup>
            Nombre: {{ item.name }} <br />
            Dispositivo: {{ item.dId }} <br />
            Estado: {{ item.status }}
          </l-popup>
        </l-marker>
      </l-map>
    </div>

    <div class="row" v-if="$store.state.devices.length > 0">
      <div
        v-for="(widget, index) in $store.state.selectedDevice.template.widgets"
        :key="index"
        :class="[widget.column]"
      >
        <Rtnumberchart
          v-if="widget.widget == 'numberchart'"
          :config="fixWidget(widget)"
        ></Rtnumberchart>

        <Iotswitch
          v-if="widget.widget == 'switch'"
          :config="fixWidget(widget)"
        ></Iotswitch>

        <Iotbutton
          v-if="widget.widget == 'button'"
          :config="fixWidget(widget)"
        ></Iotbutton>

        <Iotindicator
          v-if="widget.widget == 'indicator'"
          :config="fixWidget(widget)"
        ></Iotindicator>

        <Map v-if="widget.widget == 'mapa'" :config="fixWidget(widget)"></Map>

        <Tracking
          v-if="widget.widget == 'tracking'"
          :config="fixWidget(widget)"
        ></Tracking>
      </div>
    </div>

    <card v-else>
      <div v-if="this.usertype != '2'">
        SELECCIONA UN DISPOSITIVO
      </div>
    </card>
  </div>
</template>
<script>
import { latLng, Icon } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LIcon
} from "vue2-leaflet";

import imagetrue from "../static/img/map.png";
import imagefalse from "../static/img/map.png";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  middleware: "authenticated",
  name: "Dashboard",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LIcon
  },
  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href: "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        }
      ]
    };
  },
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png", //url:'//tile.memomaps.de/tilegen/{z}/{x}/{y}.png',
      zoom: 5,
      center: latLng(4.6533326 , -74.083652),
      icon: "",
      iconSize: [20, 20],
      usertype: "",
      positionDevices: []
    };
  },

  mounted() {
    this.getUsertype();
    this.clientStatus();
    this.getPosition();
  },

  methods: {
    async getPosition() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      try {
        const res = await this.$axios.get("/listposition", axiosHeaders); //hago llamado a endpoint listposition

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          this.positionDevices = res.data.client; //guardo todo el array en positionDevices

          for (var i = 0; i < this.positionDevices.length; i++) {
            //      //dispositivo conectado o desconectado
            if (this.positionDevices[i].status == true) {
              this.icon = imagetrue;
              this.positionDevices[i].status = "Conectado";
            }
            if (this.positionDevices[i].status == false) {
              this.icon = imagefalse;
              this.positionDevices[i].status = "Desconectado";
            }
          }
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error al listar ubicaciones del mapa"
        });
        console.log(error);
        return;
      }
    },

    getUsertype() {
      this.usertype = this.$store.state.auth.userData.type;
    },

    async clientStatus() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      try {
        const res = await this.$axios.get("/listclients", axiosHeaders); //hago llamado a endpoint clients

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          let clientstatus = res.data.clientStatus; //lo que recupero de mongo se lo asigno a la variable clients
          console.log("Tipo de cliente: " + this.usertype);
          console.log("cliente: " + res.data.type);

          if (clientstatus == false) {
            this.$notify({
              type: "default",
              icon: "tim-icons icon-alert-circle-exc",
              message: "BLOQUEADO POR FALTA DE PAGO"
            });

            const toSend = {
              lock: "1"
            };

            this.$axios
              .put("/lock", toSend, axiosHeaders)
              .then(res => {
                if (res.data.status == "success") {
                  console.log(res.data);

                  const auth = {
                    token: res.data.token,
                    userData: res.data.userData
                  };

                  //token to de store - token a la tienda
                  this.$store.commit("setAuth", auth);

                  //set auth object in localStorage - Grabamos el token en localStorage
                  localStorage.setItem("auth", JSON.stringify(auth));

                  $nuxt.$router.push("/lock");

                  return;
                }
              })
              .catch(e => {
                console.log(e.response.data);
              });
          }

          if (this.usertype != res.data.type) {
            this.$notify({
              type: "default",
              icon: "tim-icons icon-alert-circle-exc",
              message: "LA CONFIGURACIÓN DE SU CUENTA HA CAMBIADO"
            });

            localStorage.clear();

            const auth = {};
            this.$store.commit("setAuth", auth);

            window.location.href = "/login";
          }
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error al obtener ID"
        });
        console.log(error);
        return;
      }
    },

    getCoord(a, b) {
      return latLng(a, b);
    },

    fixWidget(widget) {
      var widgetCopy = JSON.parse(JSON.stringify(widget));
      widgetCopy.selectedDevice.dId = this.$store.state.selectedDevice.dId;
      widgetCopy.selectedDevice.name = this.$store.state.selectedDevice.name;
      widgetCopy.userId = this.$store.state.selectedDevice.userId;

      if (widget.widget == "numberchart") {
        widgetCopy.demo = false;
      }

      return widgetCopy;
    }
  }
};
</script>
