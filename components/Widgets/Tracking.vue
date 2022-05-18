<template>
  <card>
    <template slot="header">
      <h5 class="card-category" style="font-size: 20px;">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h5>
      <h3 class="card-title"></h3>

      <!-- $$$$$$$$$$$$$$$$ MAPA-TRACKING $$$$$$$$$$$$$$$$$$$$$$ -->
      <div>
        <base-button type="success" size="sm" @click="mapDefault()"
          >Normal</base-button
        >
        <base-button type="danger" size="sm" @click="mapWhite()"
          >Blanco</base-button
        >
        <!-- <base-button type="primary" size="sm" @click="mapBlack()"
          >Oscuro</base-button
        > -->
        <base-button type="warning" size="sm" @click="mapSatelit()"
          >Satelital</base-button
        >
      </div>
      <div id="map-wrap" style="height:450px; width:100%;">
        <l-map :zoom="zoom" :center="center">
          <l-tile-layer :url="url"></l-tile-layer>
          <l-control-attribution
            position="topright"
            prefix="SISTEMA DE RASTREO TELKINGS"
          ></l-control-attribution>
          <l-control position="bottomleft">
            <base-button type="warning" size="sm" @click="clickUltimatePosition"
              >🌎Ultimas Ubicaciones 🌎📌</base-button
            >
          </l-control>
          <l-control position="bottomleft">
            <base-button type="primary" size="sm" @click="ubicatePosition"
              >Ubicacion Dispositivo📍</base-button
            >
          </l-control>

          <l-control position="bottomleft">
            <base-button
              type="primary"
              size="sm"
              @click.native="showSwal('auto-close')"
              >Ventana Modal
            </base-button>
          </l-control>
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
              Dispositivo N°: {{ item.dId }}
            </l-popup>
          </l-marker>
          <l-marker :draggable="false" :lat-lng="ultim">
            <l-icon :icon-url="icon" :icon-size="iconSize" />
            <l-tooltip>
              Ultima posicion📍Registrada
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
      <!-- $$$$$$$$$$$$$$$$ MAPA-TRACKING $$$$$$$$$$$$$$$$$$$$$$ -->
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
      circle: { radius: 3500, color: "red", opacity: 0.1 },
      renderUbications: false,
      position: []
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
    this.tracking();
  },
  methods: {
    getCoord(a, b) {
      return latLng(a, b);
    },
    mapDefault() {
      this.url = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
    },
    // mapBlack() {
    //   this.url =
    //     "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
    // },
    mapWhite() {
      this.url =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
    },
    mapSatelit() {
      this.url =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    },
    clickUltimatePosition() {
      this.renderUbications = true;
      this.$notify({
        type: "success",
        icon: "tim-icons icon-check-2",
        message: "Ultimas ubicaciones del dispositivo"
      });
    },
    ubicatePosition() {
      this.tracking();
      this.center = this.ultim;
      this.circle.center = this.ultim;
      this.$notify({
        type: "success",
        icon: "tim-icons icon-check-2",
        message: "Obteniendo mi ubicacion exitosamente!!"
      });
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
      time = dd + "/" + mm + "/" + yyyy + " - " + hh + ":" + min + ":" + seg;

      return time;
    },
    showSwal(type) {
      if (type === "warning-message-and-confirmation") {
        swal({
          title: "Estas seguro ?",
          text: `No podrás revertir esto!`,
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn btn-success btn-fill",
          cancelButtonClass: "btn btn-danger btn-fill",
          confirmButtonText: "Si, bórralo!",
          buttonsStyling: false
        }).then(() => {
          swal({
            title: "borrado!",
            text: "ha sido eliminado.",
            type: "success",
            confirmButtonClass: "btn btn-success btn-fill",
            buttonsStyling: false
          });
        });
      } else if (type === "auto-close") {
        swal({
          title: "CIERRE AUTOMATICO!",
          text: "Se cerrara en 3 segundos!!.",
          timer: 3000,
          showConfirmButton: false
        });
      }
    }
  }
};
</script>
<style></style>
