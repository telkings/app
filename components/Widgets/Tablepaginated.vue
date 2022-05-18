<template>
  <div class="">
    <div class="row">
      <card card-body-classes="table-full-width">
        <div>
          <div
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <el-select
              class="select-primary mb-3 pagination-select"
              v-model="pagination.perPage"
              placeholder="Per page"
            >
              <el-option
                class="select-primary"
                v-for="item in pagination.perPageOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>

            <base-input>
              <el-input
                type="search"
                class="mb-3 search-input"
                clearable
                prefix-icon="el-icon-search"
                placeholder="Buscar"
                v-model="searchQuery"
                aria-controls="datatables"
              >
              </el-input>
            </base-input>
          </div>
          <!-- se puede reemplazar queriedData por devices[index] -->
          <el-table :data="queriedData">
            <el-table-column
              v-for="column in tableColumns"
              :key="column.label"
              :min-width="column.minWidth"
              :prop="column.prop"
              :label="column.label"
              sortable
            >
            </el-table-column>
          </el-table>
        </div>
        <div
          slot="footer"
          class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
        >
          <div class="">
            <p class="card-category">
              Dato {{ from + 1 }} - {{ to }} de {{ total }} datos
            </p>
          </div>
          <base-pagination
            class="pagination-no-border"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
          >
          </base-pagination>
        </div>
      </card>
    </div>
    <p class="card-title">
      <i class="fas fa-file-download"></i>Descargar reporte en pdf
    </p>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

import { BasePagination } from "@/components";
import Fuse from "fuse.js";

export default {
  name: "paginated",
  props: ['data'],
  components: {
    BasePagination,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
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
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      searchQuery: "",
      propsToSearch: ["variable", "value"],
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
          label: "Ubicación",
          minWidth: 140
        }
      ],
      tableData: [],
      searchedData: [],
      fuseSearch: null
    };
  },

  mounted() {

    this.tableData = this.data;
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["variable", "value"],
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
  }
};
</script>
<style lang="scss">
.pagination-select,
.search-input {
  width: 200px;
}
</style>
