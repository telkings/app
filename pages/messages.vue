<template>
  <div class="col-md-12">
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">NOTIFICACIONES PUSH</h4>
          <p>
            Usted puede enviar notificaciones push a un cliente en particular o
            a un grupo determinado!
          </p>
        </div>

        <div class="row">
          <div class="col-12">
            <base-input
              label="ASUNTO"
              type="text"
              placeholder="Ej: Nueva actualización de la web"
              v-model="newNotif.title"
            >
            </base-input>
          </div>

          <div class="col-12">
            <base-input
              label="MENSAJE"
              type="text"
              placeholder="Ej: Ahora dispone de avisos mediante notificaciones push"
              v-model="newNotif.message"
            >
            </base-input>
          </div>

          <div class="col-12">
            <slot name="label">
              <label> CLIENTE </label>
            </slot>

            <el-select
              v-model="newNotif.subscription"
              placeholder="Seleccione el cliente"
              class="select-primary"
              style="width:100%"
            >
              <el-option
                v-for="client in clients"
                :key="client.subscription"
                class="text-dark"
                :value="client.subscription"
                :label="client.email"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="row pull-left">
          <div class="col-12">
            <base-button
              @click="sendNotif()"
              type="warning"
              class="mb-3"
              size="lg"
              >ENVIAR NOTIFICACIÓN PUSH</base-button
            >
          </div>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

export default {
  middleware: "admin",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      clients: [],
      newNotif: {
        title: "",
        message: "",
        subscription: ""
      }
    };
  },
  mounted() {
    this.getsuscriptions();
  },
  methods: {
    async sendNotif() {
      if (
        this.newNotif.title == "" ||
        this.newNotif.message == "" ||
        this.newNotif.subscription == ""
      ) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Debe completar todo el formulario"
        });
      } else {
        const axiosHeaders = {
          headers: {
            token: this.$store.state.auth.token
          }
        };

        try {
          const res = await this.$axios.post(
            "/new-message",
            this.newNotif,
            axiosHeaders
          );

          if (res.data.status == "success") {
            this.newNotif.title = "";
            this.newNotif.message = "";
            this.newNotif.subscription = "";

            this.getsuscriptions();
          }
        } catch (error) {
          this.$notify({
            type: "default",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error al enviar notificaciones"
          });
          console.log(error);
          return;
        }
      }
    },
    async getsuscriptions() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      try {
        const res = await this.$axios.get("/suscriptions", axiosHeaders); //hago llamado a endpoint clients

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          this.clients = res.data.subscriptions; //lo que recupero de mongo se lo asigno a la variable clients

          if (this.clients.length > 1) {
            console.log(
              "La cantidad de suscripciones es: " + this.clients.length
            );
            console.log(this.clients.length + 1);
            const clientsnotif = {
              userId: "SEGURIT",
              email: "TODOS LOS CLIENTES",
              subscription: "0"
            };
            this.clients[this.clients.length] = clientsnotif;
          }
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error al listar clientes"
        });
        console.log(error);
        return;
      }
    }
  }
};
</script>
