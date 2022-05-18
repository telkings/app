<template>
  <div>
    <!-- NEW QUERY FORM -->
    <div class="row">
      <div class="col-sm-12">
        <card v-if="$store.state.devices.length > 0">
          <div slot="header">
            <h4 class="card-title">
              Consultar Historicos
            </h4>
          </div>

          <div class="row">
            <div class="col-md-4">
              <card>
                <h4 slot="header" class="card-title">
                  Dispositivo: {{ $store.state.selectedDevice.name }}
                </h4>
                <base-input>
                  <el-select
                    required
                    class="select-success"
                    placeholder="Variable"
                    v-model="selectedWidgetIndex"
                  >
                    <el-option
                      v-for="(widget, index) in $store.state.selectedDevice
                        .template.widgets"
                      :key="index"
                      class="text-dark"
                      :value="index"
                      :label="widget.variableFullName"
                    ></el-option>
                  </el-select>
                </base-input>
              </card>
            </div>

            <div class="col-md-4">
              <card>
                <h4 slot="header" class="card-title">Desde:</h4>
                <base-input>
                  <el-date-picker
                    type="datetime"
                    placeholder="Date Time Picker"
                    v-model="hncConfig.query.from"
                  >
                  </el-date-picker>
                </base-input>
              </card>
            </div>
            <div class="col-md-4">
              <card>
                <h4 slot="header" class="card-title">Hasta:</h4>
                <base-input>
                  <el-date-picker
                    type="datetime"
                    placeholder="Date Time Picker"
                    v-model="hncConfig.query.to"
                  >
                  </el-date-picker>
                </base-input>
              </card>
            </div>
          </div>

          <br /><br />
          <div class="row pull-right">
            <div class="col-12">
              <base-button
                @click="queryHistory()"
                native-type="submit"
                type="primary"
                class="mb-3"
                size="lg"
                :disabled="$store.state.devices.length == 0"
              >
                Consultar
              </base-button>
            </div>
          </div>
        </card>

        <card v-else>
          You need to select a device firts
        </card>
      </div>
    </div>

    <!-- DASHBOARD PREVIEW -->
    <div class="row">
      <div
        v-for="(widget, index) in widgets"
        :key="index"
        :class="[widget.column]"
      >
        <i
          aria-hidden="true"
          class="fa fa-trash text-warning pull-right"
          @click="deleteWidget(index)"
          style="margin-bottom: 10px;"
        ></i>
        <Charthistory
          v-if="widget.widget == 'historychart'"
          :config="widget"
        ></Charthistory>
      </div>
    </div>
  </div>
</template>

<script>
import { TimeSelect, DatePicker, Select, Option } from "element-ui";
import { Table, TableColumn } from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    [DatePicker.name]: DatePicker,
    [TimeSelect.name]: TimeSelect,
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      selectedWidgetIndex: null,
      widgets: [],

      hncConfig: {
        userId: "sampleuserid",

        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        query: {
          dId: null,
          deviceName: null,
          status: true,
          variableFullName: null,
          variable: null,
          from: null,
          to: null
        },

        datas: [],

        variableFullName: "temperature",
        variable: "varname",
        variableType: "input",
        variableSendFreq: "30",
        unit: "Watts",
        class: "success",
        column: "col-lg-6",
        decimalPlaces: 2,
        widget: "historychart",
        icon: "fa-sun",
        chartTimeAgo: 60,
        demo: true
      }
    };
  },

  mounted() {
    this.getNow();
  },
  beforeDestroy() {
    //this.$nuxt.$off(this.topic + "/sdata");
  },
  methods: {
    queryHistory() {
      if (this.selectedWidgetIndex == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Variable must be selected"
        });
        return;
      }

      if (this.hncConfig.query.from == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " FROM must be selected"
        });
        return;
      }

      if (this.hncConfig.query.to == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " TO must be selected"
        });
        return;
      }

      this.hncConfig.datas = [];

      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          dId: this.$store.state.selectedDevice.dId,
          variable: this.$store.state.selectedDevice.template.widgets[
            this.selectedWidgetIndex
          ].variable,
          chartTimeFrom: this.hncConfig.query.from,
          chartTimeTo: this.hncConfig.query.to
        }
      };
      const unixTo = (new Date(this.hncConfig.query.from) / 1000).toFixed(0);
      console.log(unixTo);
      console.log(
        this.$store.state.selectedDevice.template.widgets[
          this.selectedWidgetIndex
        ].variable
      );
      console.log(this.$store.state.selectedDevice.dId);
      console.log(this.hncConfig.query.from);

      this.$axios
        .get("/get-query-history", axiosHeaders)
        .then(res => {
          //this.chartOptions.series[0].data = [];
          const data = res.data.data;
          console.log(res.data);

          data.forEach(element => {
            var aux = [];

            aux.push(
              element.time + new Date().getTimezoneOffset() * 60 * 1000 * -1
            );
            aux.push(element.value);
            this.hncConfig.datas.push(aux);
          });
          console.log(this.hncConfig.datas);

          (this.hncConfig.variableFullName = this.$store.state.selectedDevice.template.widgets[
            this.selectedWidgetIndex
          ].variableFullName),
            (this.hncConfig.unit = this.$store.state.selectedDevice.template.widgets[
              this.selectedWidgetIndex
            ].unit),
            (this.hncConfig.icon = this.$store.state.selectedDevice.template.widgets[
              this.selectedWidgetIndex
            ].icon),
            (this.hncConfig.class = this.$store.state.selectedDevice.template.widgets[
              this.selectedWidgetIndex
            ].class),
            this.widgets.push(JSON.parse(JSON.stringify(this.hncConfig)));

          this.isMounted = true;

          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },

    //Delete Widget
    deleteWidget(index) {
      this.widgets.splice(index, 1);
    },

    getNow() {
      this.nowTime = Date.now();
      setTimeout(() => {
        this.getNow();
      }, 1000);
    }
  }
};
</script>
