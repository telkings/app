<template>
  <div class="col-md-12">
    <!-- FORM ADD DEVICE -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">AGREGAR DISPOSITIVOS</h4>
          <p>
            Ingresa el nombre, número de serie y plantilla.
          </p>
        </div>

        <div class="row">
          <div class="col-12">
            <base-input
              label="DISPOSITIVO"
              type="text"
              placeholder="Ej: Casa Campo"
              v-model="newDevice.name"
            >
            </base-input>
          </div>

          <div class="col-12">
            <base-input
              label="SERIE"
              type="text"
              placeholder="Ej: 777222"
              v-model="newDevice.dId"
            >
            </base-input>
          </div>

          <div class="col-12">
            <slot name="label">
              <label> PLANTILLAS </label>
            </slot>

            <el-select
              v-model="selectedIndexTemplate"
              placeholder="Seleccione plantilla"
              class="select-primary"
              style="width:100%"
            >
              <el-option
                v-for="(template, index) in templates"
                :key="template._id"
                class="text-dark"
                :value="index"
                :label="template.name"
              ></el-option>
            </el-select>
          </div>

          <div class="col-12">
            <slot name="label">
              <label> UBICACIÓN DISPOSITIVO </label>
            </slot>
            <br />
            <div id="map-wrap" style="height: 350px; width: 100%">
              <l-map :zoom="zoom" :center="center">
                <l-tile-layer :url="url"></l-tile-layer>

                <l-marker
                  :draggable="true"
                  @update:latLng="onDrag"
                  :lat-lng="center"
                >
                  <l-icon :icon-url="icon" :icon-size="iconSize" />
                  <l-popup>
                    Ubicar Dispositivo
                  </l-popup>
                </l-marker>
              </l-map>
            </div>
          </div>
        </div>

        <div class="row pull-right">
          <div class="col-12">
            <base-button
              @click="createNewDevice()"
              type="warning"
              class="mb-3"
              size="lg"
              >AGREGAR</base-button
            >
          </div>
        </div>
      </card>
    </div>

    <!-- DEVICES TABLE -->
    <div class="row">
      <card card-body-classes="table-full-width">
        <div slot="header">
          <h4 class="card-title">DISPOSITIVOS AGREGADOS</h4>
          <p>Verifique que su dispositivo esté "conectado"</p>
          <p>
            Si está "desconectado", es posible que se encuentré sin energía
            eléctrica o ha perdido la conexión a internet
          </p>
        </div>

        <el-table :data="$store.state.devices">
          <el-table-column min-width="50" label="#" align="center">
            <div slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </div>
          </el-table-column>

          <el-table-column
            min-width="150"
            prop="name"
            label="NOMBRE"
          ></el-table-column>

          <el-table-column
            min-width="100"
            prop="dId"
            label="SERIE"
          ></el-table-column>

          <el-table-column
            min-width="120"
            prop="password"
            label="SEGURO"
          ></el-table-column>

          <!-- <el-table-column min-width="100">
            <div slot-scope="{ row, $index }">
              <el-tooltip
                content="Generar una nueva contraseña"
                :open-delay="300"
                placement="top"
              >
                <base-button
                  @click.native="handleResetDevicePassword(row)"
                  class="like btn-link"
                  type="warning"
                  size="sm"
                  icon
                >
                  <i class="fas fa-fingerprint"></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column> -->
<!-- 
          <el-table-column
            min-width="100"
            prop=""
            label="ESTADO"
          ></el-table-column> -->

          <el-table-column
            min-width="100"
            prop="templateName"
            label="PLANTILLA"
          ></el-table-column>

          <el-table-column min-width="160" label="ALMACENAMIENTO">
            <div slot-scope="{ row, $index }">
              <el-tooltip
                content="Estado base de datos"
                style="margin-right:10px"
              >
                <i
                  class="fas fa-database "
                  :class="{
                    'text-warning': row.saverRule.status,
                    'text-dark': !row.saverRule.status
                  }"
                ></i>
              </el-tooltip>

              <el-tooltip content="Actualizar base de datos">
                <base-switch
                  @click="updateSaverRuleStatus(row.saverRule)"
                  :value="row.saverRule.status"
                  type="info"
                  on-text="On"
                  off-text="Off"
                ></base-switch>
              </el-tooltip>

              <el-tooltip
                content="Eliminar dispositivo"
                :open-delay="300"
                placement="top"
              >
                <base-button
                  type="warning"
                  icon
                  size="sm"
                  class="btn-link"
                  @click="handledeleteDevice(row)"
                >
                  <i class="tim-icons icon-simple-remove "></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
      </card>
    </div>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

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

import swal from "sweetalert2";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  middleware: "userpro",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
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
      templates: [],
      selectedIndexTemplate: null,
      newDevice: {
        name: "",
        dId: "",
        templateId: "",
        templateName: "",
        lat: "",
        long: "",
        lastUbication: "",
        status: false
      },
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 6,
      center: latLng(4.66, -74.09),
      icon: imagetrue,
      iconSize: [40, 40]
    };
  },
  mounted() {
    this.getTemplates();
  },
  methods: {
    updateSaverRuleStatus(rule) {
      var ruleCopy = JSON.parse(JSON.stringify(rule));

      ruleCopy.status = !ruleCopy.status;

      const toSend = {
        rule: ruleCopy
      };

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      this.$axios
        .put("/saver-rule", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$store.dispatch("getDevices");

            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: "ACTUALIZANDO ALMACENAMIENTO DEL DISPOSITIVO "
            });
          }

          return;
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: "ERROR AL ACTUALIZAR EL ALMACENAMIENTO DEL DISPOSITIVO"
          });
          return;
        });
    },

    deleteDevice(device) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.accessToken
        },
        params: {
          dId: device.dId,
          ad: false
        }
      };

      this.$axios
        .delete("/device", axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: device.name + " eliminado"
            });
          }

          $nuxt.$emit("time-to-get-devices");

          return;
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error al eliminar" + device.name
          });
          return;
        });
    },
    //new device
    createNewDevice() {
      if (this.newDevice.name == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "INGRESE EL NOMBRE DEL DISPOSITIVO"
        });
        return;
      }

      if (this.newDevice.dId == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "INGRESE EL NÚMERO DE SERIE DEL DISPOSITIVO"
        });
        return;
      }

      if (this.selectedIndexTemplate == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "SELECCIONE LA PLANTILLA DEL DISPOSITIVO"
        });
        return;
      }

      if (this.lat == null && this.long == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "SELECCIONE UNA UBICACION"
        });
        return;
      }

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      //ESCRIBIMOS EL NOMBRE Y EL ID DEL TEMPLATE SELECCIONADO EN EL OBJETO newDevice
      this.newDevice.templateId = this.templates[
        this.selectedIndexTemplate
      ]._id;
      this.newDevice.templateName = this.templates[
        this.selectedIndexTemplate
      ].name;

      const toSend = {
        newDevice: this.newDevice,
        admin: false,
        latitud: this.lat,
        longitud: this.long,
        datadevice: ""
      };

      this.$axios
        .post("/device", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$store.dispatch("getDevices");

            this.newDevice.name = "";
            this.newDevice.dId = "";
            this.selectedIndexTemplate = null;

            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: "DISPOSITIVO AGREGADO"
            });

            return;
          }
        })
        .catch(e => {
          if (
            e.response.data.status == "error" &&
            e.response.data.error.errors.dId.kind == "unique"
          ) {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message: "NÚMERO DE SERIE NO VÁLIDO"
            });
            return;
          } else {
            this.showNotify("danger", "Error");
            return;
          }
        });
    },

    //Get Templates
    async getTemplates() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      try {
        const res = await this.$axios.get("/template", axiosHeaders);
        console.log(res.data);

        if (res.data.status == "success") {
          this.templates = res.data.data;
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error obteniendo plantillas"
        });
        console.log(error);
        return;
      }
    },

    deleteDevice(device) {
      const axiosHeader = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          dId: device.dId,
          ad: false
        }
      };

      this.$axios
        .delete("/device", axiosHeader)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: device.name + " eliminado"
            });
            this.$store.dispatch("getDevices");
          }
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            type: "default",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error al eliminar" + device.name
          });
        });
    },

    handleResetDevicePassword(row) {
      swal({
        title: "MODIFICAR CONTRASEÑA?",
        text: `La contraseña de conexión del dispositivo ${row.name.toUpperCase()} será modificada`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-warning btn-fill",
        cancelButtonClass: "btn btn-primary btn-fill",
        confirmButtonText: "Ok, modificar contraseña!",
        cancelButtonText: "Cerrar",
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.resetdevicePassword(row);
        }
      });
    },

    handledeleteDevice(row) {
      swal({
        title: "ELIMINAR DISPOSITIVO?",
        text: `El dispositivo ${row.name.toUpperCase()} será eliminado`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-warning btn-fill",
        cancelButtonClass: "btn btn-primary btn-fill",
        confirmButtonText: "Ok, eliminar dispositivo!",
        cancelButtonText: "Cerrar",
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.deleteDevice(row);
        }
      });
    },

    async resetdevicePassword(device) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        Id: device.userId,
        dId: device.dId
      };

      try {
        const res = await this.$axios.post(
          "/updatedevice",
          toSend,
          axiosHeaders
        ); //hago llamado a endpoint clients

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          swal({
            title: "CONTRASEÑA MODIFICADA",
            text: `La contraseña de conexión del dispositivo ${device.name.toUpperCase()} ha sido modificada`,
            type: "success",
            confirmButtonClass: "btn btn-warning btn-fill",
            buttonsStyling: false
          });

          window.location.href = "/devices";
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "ERROR AL ACTUALIZAR DISPOSITIVO"
        });
        console.log(error);
        return;
      }
    },
    onDrag({ lat, lng }) {
      this.lat = lat;
      this.long = lng;
    }
  }
};
</script>
