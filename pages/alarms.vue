<template>
  <div>
    <!-- NEW ALARM FORM -->
    <div class="row">
      <div class="col-sm-12">
        <card v-if="$store.state.devices.length > 0">
          <div slot="header">
            <h4 class="card-title">
              CREAR NUEVA ALARMA {{ selectedWidgetIndex }}
            </h4>
          </div>

          <div class="row">
            <div class="col-12">
              <el-select
                required
                class="select-primary"
                placeholder="Variable"
                v-model="selectedWidgetIndex"
                style="margin-top: 10px;"
              >
                <el-option
                  v-for="(widget, index) in $store.state.selectedDevice.template
                    .widgets"
                  :key="index"
                  class="text-dark"
                  :value="index"
                  :label="widget.variableFullName"
                ></el-option>
              </el-select>
            </div>

            <div class="col-12">
              <el-select 
                required
                class="select-warning"
                placeholder="Condición"
                v-model="newRule.condition"
                style="margin-top: 10px;"
              >
                <el-option class="text-dark" value="=" label="igual"></el-option>
                <el-option class="text-dark" value=">" label="mayor a"></el-option>
                <el-option class="text-dark" value=">=" label="mayor igual a"></el-option>
                <el-option class="text-dark" value="<" label="menor"></el-option>
                <el-option class="text-dark" value="<=" label="menor igual a"></el-option>
                <el-option class="text-dark" value="!=" label="distinto de"></el-option>
              </el-select>
            </div>

            <div class="col-12">
              <base-input
                label="Valor"
                v-model="newRule.value"
                type="number"
              ></base-input>
            </div>

            <div class="col-12">
              <base-input
                label="Periodo de notificación"
                v-model="newRule.triggerTime"
                type="number"
              ></base-input>
            </div>
          </div>

          <br /><br />

          <div class="row pull-right">
            <div class="col-12">
              <base-button
                @click="createNewRule()"
                native-type="submit"
                type="warning"
                class="mb-3"
                size="lg"
                :disabled="$store.state.devices.length == 0"
              >
               CREAR ALARMA
              </base-button>
            </div>
          </div>
        </card>
        <card v-else>
          Seleccionar dispositivo para crear una alarma
        </card>
      </div>
    </div>

    <!-- ALARMS TABLE -->
    <div class="col-12">
     <div class="row" v-if="$store.state.devices.length > 0">   
        <card card-body-classes="table-full-width" v-if="$store.state.selectedDevice.alarmRules.length > 0">
          <div slot="header">
            <h4 class="card-title">ALARMAS CREADAS</h4>
          </div>

          <el-table
            v-if="$store.state.selectedDevice.alarmRules.length > 0"
            :data="$store.state.selectedDevice.alarmRules"
          >
            <el-table-column min-width="50" label="#" align="center">
              <div class="photo" slot-scope="{ row, $index }">
                {{ $index + 1 }}
              </div>
            </el-table-column>

            <el-table-column
              min-width="100"
              prop="variableFullName"
              label="VARIABLE"
            ></el-table-column>

            <el-table-column min-width="120" prop="variable" label="ID"></el-table-column>

            <el-table-column
              min-width="100"
              prop="condition"
              label="CONDICIÓN"
            ></el-table-column>

            <el-table-column min-width="100" prop="value" label="VALOR"></el-table-column>

            <el-table-column
              min-width="130"
              prop="triggerTime"
              label="PERIODO NOTIF"
            ></el-table-column>

            <el-table-column min-width="150" prop="counter" label="N° NOTIFICACIONES"></el-table-column>

            <el-table-column min-width="180" header-align="right" align="right" label="ELIMINAR">
              <div
                slot-scope="{ row, $index }"
                class="text-right table-actions"
              >

                <el-tooltip content="Estado de notificación" style="margin-left: 20px;">
                  <i
                    class="fas fa-exclamation-triangle"
                    :class="{ 'text-warning': row.status }"
                  ></i>
                </el-tooltip>

                <!-- no ato row.status al v model porque al cambiar de status cambiaria directo sobre store lo que daría error en 
                      cambio uso el value, al accionar el switch no cambiará el objeto, pero podré cambiar el valor en la función -->
                <el-tooltip
                  content="Activar/desactivar notificaciones"
                  style="margin-left: 5px;"
                >
                  <base-switch
                    @click="updateStatusRule(row)"
                    :value="row.status"
                    type="vue"
                    on-text="ON"
                    off-text="OFF"
                    style="margin-top: 10px;"
                  ></base-switch>
                </el-tooltip>

                 <el-tooltip content="Eliminar" effect="light" placement="top">
                  <base-button
                    @click="deleteDevice(row)"
                    type="danger"
                    icon
                    size="sm"
                    class="btn-link"
                  >
                    <i class="tim-icons icon-simple-remove "></i>
                  </base-button>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>

          <h4 v-else class="card-title">No hay alarmas creadas</h4>
        </card>
     </div>
    </div> 
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { Table, TableColumn } from "element-ui";

export default {
  middleware: "userpro",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      alarmRules: [],
      selectedWidgetIndex: null,
      newRule: {
        dId: null,
        deviceName: null,
        status: true,
        variableFullName: null,
        variable: null,
        value: null,
        condition: null,
        triggerTime: null
      }
    };
  },
  methods: {


    deleteDevice(rule) {

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          emqxRuleId: rule.emqxRuleId
        }
      };

      this.$axios
        .delete("/alarm-rule", axiosHeaders)
        .then(res => {
           if (res.data.status == "success") {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: "Alarma eliminada"
            });
            this.$store.dispatch("getDevices");
            return;
          }
        })
        .catch(e => {
          this.$notify({
            type: "default",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error"
          });
          console.log(e);
          return;
        });
    },

    updateStatusRule(rule) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      var ruleCopy = JSON.parse(JSON.stringify(rule));

      ruleCopy.status = !ruleCopy.status;

      const toSend = { rule: ruleCopy };

      this.$axios
        .put("/alarm-rule", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: "Alarma actualizada"
            });

            this.$store.dispatch("getDevices");

            return;
          }
        })
        .catch(e => {
          this.$notify({
            type: "default",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error"
          });
          console.log(e);
          return;
        });
    },

    createNewRule() {
      if (this.selectedWidgetIndex == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Seleccione una variable"
        });
        return;
      }

      if (this.newRule.condition == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Seleccione una condición"
        });
        return;
      }

      if (this.newRule.value == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Ingrese un valor"
        });
        return;
      }

      if (this.newRule.triggerTime == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Seleccione un período de notificación"
        });
        return;
      }

      
      this.newRule.dId = this.$store.state.selectedDevice.dId;
      this.newRule.deviceName = this.$store.state.selectedDevice.name;
      this.newRule.variableFullName = this.$store.state.selectedDevice.template.widgets[
        this.selectedWidgetIndex
      ].variableFullName;
      this.newRule.variable = this.$store.state.selectedDevice.template.widgets[
        this.selectedWidgetIndex
      ].variable;

      

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      var toSend = {
        newRule: this.newRule
      };

      this.$axios
        .post("/alarm-rule", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.newRule.variable = null;
            this.newRule.condition = null;
            this.newRule.value = null;
            this.newRule.triggerTime = null;
            this.selectedWidgetIndex = null;

            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: "Alarma creada"
            });

            this.$store.dispatch("getDevices");

            return;
          }
        })
        .catch(e => {
          this.$notify({
            type: "default",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error"
          });
          console.log(e);
          return;
        });
    }
  }
};
</script>
