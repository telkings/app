<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <card>
          <template slot="header">
            <h3 class="card-title">REPORTES</h3>
          </template>
          <collapse :multiple-active="false">
            <div v-for="(device, index) in this.countDevices">
              <collapse-item :title="device.toUpperCase()">
                <Tablepaginated :data="tableData[index]"></Tablepaginated>
              </collapse-item>
            </div>
          </collapse>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

import { BasePagination } from "@/components";
import users from "../util/mock-users-historial";
import Fuse from "fuse.js";

import { TabPane, Tabs, Collapse, CollapseItem } from "@/components";

export default {
  name: "paginated",
  name: "panels",
  middleware: "authenticated",
  components: {
    BasePagination,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
    TabPane,
    Tabs,
    Collapse,
    CollapseItem
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.tableData.length;
    }
  },
  data() {
    return {
      activeName: "first",
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      searchQuery: "",
      propsToSearch: ["name", "email", "age"],
      tableColumns: [
        {
          prop: "time",
          label: "Fecha",
          minWidth: 140
        },
        {
          prop: "variable",
          label: "Variable",
          minWidth: 140
        },
        {
          prop: "value",
          label: "Valor medido",
          minWidth: 120
        },
        {
          prop: "dId",
          label: "Dispositivo",
          minWidth: 140
        },
        {
          prop: "userId",
          label: "Plantilla",
          minWidth: 140
        }
      ],
      tableData: [],
      searchedData: [],
      fuseSearch: null,
      countDevices: [],
      devices: []
    };
  },

  mounted() {
    this.getDataClients();

    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["name", "email"],
      threshold: 0.3
    });
  },

  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
    searchQuery(value) {
      let result = this.tableData;
      if (value !== "") {
        result = this.fuseSearch.search(this.searchQuery);
      }
      this.searchedData = result;
    }
  },

  methods: {
    async getDataClients() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      try {
        const res = await this.$axios.get("/datadevices", axiosHeaders); //hago llamado a endpoint clients

        if (res.data.status == "success") {
          // // si la respuesta fue exitosa

          let data = res.data.data;
          let nameDevices = [];

          let deviceselected = [];

          if (data.length != 0) {
            for (var i = 0; i < data.length; i++) {
              let date = new Date(data[i].time);

              data[i].time =
                date.getDate() +
                "/" +
                (date.getMonth() + 1) +
                "/" +
                date.getFullYear() +
                " " +
                date.getHours() +
                ":" +
                date.getMinutes();

              nameDevices.push(data[i].dId);
            }

            this.countDevices = this.wordsfinder(nameDevices);

            for (let j = 0; j < this.countDevices.length; j++) {
              for (let n = 0; n < data.length; n++) {
                if (data[n].dId == this.countDevices[j]) {
                  deviceselected.push(data[n]);
                }
              }
              this.devices.push(deviceselected);
              deviceselected = [];
            }

            this.tableData = this.devices;
          }
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error al listar datos de dispositivos"
        });
        console.log(error);
        return;
      }
    },
    wordsfinder(arr) {
      var a = [],
        prev;

      arr.sort();
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
          a.push(arr[i]);
        }
        prev = arr[i];
      }

      return a;
    }
  }
};
</script>
<style lang="scss">
.pagination-select,
.search-input {
  width: 200px;
}
</style>
