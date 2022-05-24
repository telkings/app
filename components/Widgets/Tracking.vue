<template>
  <card>
    <template slot="header">
      <h5 class="card-category" style="font-size: 20px;">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
        <div class="pull-right">
          <el-tooltip
            content="Cambiar tipo de mapa"
            :open-delay="300"
            placement="top"
          >
            <base-button
              @click.native="mapstyle()"
              class="remove btn-link"
              type="warning"
              size="sm"
              icon
            >
              <i class="fas fa-layer-group"></i>
            </base-button>
          </el-tooltip>
        </div>
      </h5>
      <h3 class="card-title"></h3>

      <div id="map-wrap" style="height:450px; width:100%;">
        <l-map :zoom="zoom" :center="center">
          <l-tile-layer :url="url"></l-tile-layer>
          <l-control-attribution
            position="topright"
            prefix="SISTEMA DE RASTREO TELKINGS"
          ></l-control-attribution> 
          
          <l-marker
            :draggable="false"
            :lat-lng="getCoord(item.lat, item.lng)"
            v-for="item in positionDevices"
            v-if="renderUbications == true"
            :key="item.id"
          >
            <l-icon :icon-url="icon" :icon-size="iconSize" />
            <l-popup>
              Fecha: {{ item.time }} <br />
              Dispositivo N°: {{ item.dId }} <br />
              Ver en Google Maps 
              <el-tooltip
                content="Google Maps"
                :open-delay="300"
                placement="top"
              >
                <base-button
                 @click.native="googleMaps(item)"
                 class="edit btn-link"
                 type="warning"
                 size="sm"
                 icon
                 >
                  <i class="fas fa-map-marker-alt"></i>
                </base-button>
              </el-tooltip>
            </l-popup>
          </l-marker>
          <l-marker :draggable="false" :lat-lng="ultim">
            <l-icon :icon-url="icon" :icon-size="iconSize" />
            <l-tooltip>
              Ubicacion Actual
            </l-tooltip>
          </l-marker>
          <l-circle
            :lat-lng="ultim"
            :radius="circle.radius"
            :color="circle.color"
            :opacity="circle.opacity"
          ></l-circle>
          <l-layer-group>
            <l-polyline
              v-for="item in routesLines"
              v-if="renderUbications == true"
              :key="item.id"
              :lat-lngs="routesLines"
            ></l-polyline>
          </l-layer-group>
        </l-map>
      </div>
      <br />
      <div>
        <!-- <base-button
          type="warning"
          size="sm"
          @click.native="showSwal('gps-on')"
          v-if="this.gps == false"
          >Activar GPS
        </base-button>
        <base-button
          type="warning"
          size="sm"
          @click.native="showSwal('gps-off')"
          v-if="this.gps == true"
          >Desactivar GPS
        </base-button> -->

        <base-button type="warning" size="sm" @click="clickUltimatePosition"
          >Historial Ubicaciones📍</base-button
          >
            <!-- <base-button type="primary" size="sm" @click="ubicatePosition"
              >Ubicacion Dispositivo📍</base-button> -->
      </div>
      <br />
    </template>
  </card>
</template>

<script>
import swal from "sweetalert2";
import { latLng, Icon } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LIcon,
  LPolyline,
  LLayerGroup,
  LControlAttribution,
  LControl,
  LCircle
} from "vue2-leaflet";

import imagetrue from "../../static/img/map.png";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  middleware: "authenticated",
  name: "tracking",
  props: ["config"],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LIcon,
    LPolyline,
    LLayerGroup,
    LControlAttribution,
    LControl,
    LCircle
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
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 11,
      center: latLng(4.6533326, -74.083652),
      icon: imagetrue,
      iconSize: [40, 40],
      positionDevices: [],
      routesLines: [],
      ultim: { lat: 0, lng: 0 },
      circle: { radius: 4500, color: "red", opacity: 0.2 },
      renderUbications: false,
      position: [],
      watchId: "",
      gps: false,
      lastlatitude: "",
      lastlongitude: "",
      mapselected: 0
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.renderUbications = false;
          this.tracking();
        }, 300);
      }
    }
  },
  mounted() {
    this.ubicatePosition();
    //userId/dId/uniquestr/sdata
    const topic =
      this.config.userId +
      "/" +
      this.config.selectedDevice.dId +
      "/" +
      this.config.variable +
      "/sdata";
    //console.log(topic);
    this.$nuxt.$on(topic, this.processReceivedData);
  },
  beforeDestroy() {
    this.$nuxt.$off(
      this.config.userId +
        "/" +
        this.config.selectedDevice.dId +
        "/" +
        this.config.variable +
        "/sdata"
    );
  },
  methods: {
    processReceivedData(data) {
      console.log("receiving location");
      //console.log(data);
      this.ultim = data;
      this.center = this.ultim;
      this.circle.center = this.ultim;
    },
    //////////////////////////////////////////////////////

    geolocation(position) {
      const { latitude, longitude } = position.coords;
      console.log(position.coords);
      console.log("latitud: " + latitude);
      console.log("longitud: " + longitude);

      if (this.lastlatitude != latitude) {
        if (this.lastlongitude != longitude) {
          this.lastlongitude = longitude;
          this.lastlatitude = latitude;

          const toSend = {
            topic:
              this.config.userId +
              "/" +
              this.config.selectedDevice.dId +
              "/" +
              this.config.variable +
              "/sdata",
            msg: {
              lat: latitude,
              lng: longitude,
              value: 1,
              save: 1
            }
          };

          $nuxt.$emit("mqtt-sender", toSend);
        }
      }
    },
    handleError(error) {
      const { code } = error;
      switch (code) {
        case GeolocationPositionError.TIMEOUT:
          // Handle timeout.
          break;
        case GeolocationPositionError.PERMISSION_DENIED:
          console.log("Permiso denegado");
          // User denied the request.
          break;
        case GeolocationPositionError.POSITION_UNAVAILABLE:
          console.log("Posición no disponible");
          // Position not available.
          break;
      }
    },
    startGeolocation() {
      if (navigator.geolocation) {
        const geo_options = {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        };

        this.watchId = navigator.geolocation.watchPosition(
          this.geolocation,
          this.handleError,
          geo_options
        );
      }
    },
    stopGeolocation() {
      navigator.geolocation.clearWatch(this.watchId);
    },

    ////////////////////////////////////////////////////////////////////////////
    getCoord(a, b) {
      return latLng(a, b);
    },
    mapstyle() {
      if (this.mapselected == 0) {
        this.mapSatelit();
        this.mapselected = 1;
      } else if (this.mapselected == 1) {
        this.mapDefault();
        this.mapselected = 0;
      }
    },
    mapDefault() {
      this.url = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
    },
    mapWhite() {
      this.url =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
    },
    mapSatelit() {
      this.url =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    },
    async clickUltimatePosition() {
      await this.tracking();
      this.renderUbications = true;
      this.center = this.ultim;
      this.circle.center = this.ultim;
      this.$notify({
        type: "success",
        icon: "tim-icons icon-check-2",
        message: "Ultimas ubicaciones del dispositivo"
      });
    },
    async ubicatePosition() {
      await this.tracking();
      if (this.ultim.lat != "0" && this.ultim.lng != "0") {
        this.center = this.ultim;
        this.circle.center = this.ultim;

        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: " Obteniendo mi Ubicación Actual exitosamente!!"
        });
      }
    },
    async tracking() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          dId: this.$store.state.selectedDevice.dId
        }
      };
      try {
        const res = await this.$axios.get("/tracking", axiosHeaders); //end point tracking

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          this.positionDevices = res.data.locations;
          this.routesLines = res.data.locations;
          this.position = res.data.ultimate;
          var j = 0;
          while (j < this.position.length) {
            this.ultim.lat = this.position[j].lat;
            this.ultim.lng = this.position[j].lng;
            j++;
          }
          for (var i = 0; i < this.positionDevices.length; i++) {
            let date = this.unixToDate(parseInt(this.positionDevices[i].time));

            this.positionDevices[i].time = date;
          }
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error al listar posiciones!!!!!!!!"
        });
        console.log(error);
        return;
      }
    },
    unixToDate(ms) {
      var d = new Date(parseInt(ms)),
        yyyy = d.getFullYear(),
        mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
        dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
        hh = ("0" + d.getHours()).slice(-2), // Add leading 0.
        min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
        seg = ("0" + d.getSeconds()).slice(-2),
        time;

      // ie: 2013-02-18, 8:35 AM
      time =  hh + ":" + min + ":" + seg + " - "+ dd + "/" + mm + "/" + yyyy ;

      return time;
    },
    showSwal(type) {
      if (type === "gps-on") {
        swal({
          title: "GPS ACTIVADO",
          timer: 500,
          showConfirmButton: false
        });
        this.gps = true;
        //this.startGeolocation();
      } else if (type === "gps-off") {
        swal({
          title: "GPS DESACTIVADO",
          timer: 500,
          showConfirmButton: false
        });
        this.gps = false;
        //this.stopGeolocation();
      }
    },
    googleMaps(incoming){
       console.log("parametros item mapa" + 
       JSON.stringify(incoming))
    }
  }
};
</script>
<style></style>
