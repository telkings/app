<template>
  <card>
    <template slot="header">
      <h5 class="card-category" style="font-size: 20px;">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h5>
      <h3 class="card-title"></h3>

       <div id="map-wrap" style="height: 350px; width: 100%">  
              <l-map 
                     :zoom="zoom" 
                     :center="center">
                <l-tile-layer :url="url"></l-tile-layer>

                <l-marker
                  :draggable="true"
                  :lat-lng="position"
                >
                  <l-icon :icon-url="icon" :icon-size="iconSize" />
                  <l-popup>
                    futura posicion
                  </l-popup>
                </l-marker>
              </l-map>     
        </div>
      

      <br />
    </template>
  </card>
</template>

<script>
import { latLng ,Icon} from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip, LIcon } from "vue2-leaflet";
import image from '../../static/img/map.png' 

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


export default {
  name: "mapa",
  props: ["config"],
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
          rel: 'stylesheet',
          href: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
        },
      ],
    }
  },

  data() {
    return {
      
              url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
              zoom:6,
              center:latLng(4.666127, -74.09343),
              icon:image,
              iconSize:[40,40],
              position:{lat: 4.640439, lng: -74.145561}
    };
  },

  mounted() {
    //userId/dId/uniquestr/sdata
    const topic = this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/sdata";
    console.log(topic);
    this.$nuxt.$on(topic, this.processReceivedData);
  },
  beforeDestroy() {
    this.$nuxt.$off( this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/sdata");
  },
  methods: {
        processReceivedData(data){
        console.log("Recibiendo ubicacion");
       console.log(data);
        if (this.position = data) {

            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Nueva Ubicacion -> " + this.config.variableFullName
            });
        }
       
    },
  }
};
</script>
<style></style>