<template>
  <!-- Navbar mobile -->
  <base-nav
    v-model="showMenu"
    class="navbar-absolute top-navbar"
    type="warning"
    :transparent="true"
  >
    <div slot="brand" class="navbar-wrapper">
      <div
        class="navbar-toggle d-inline"
        :class="{ toggled: $sidebar.showSidebar }"
      >
        <button type="button" class="navbar-toggler" @click="toggleSidebar">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </button>
      </div>
      <div style="font-size:20px;">
        <span
          >{{ user_name
          }}<i
            class="fas fa-lock"
            style="margin-left:10px; cursor:pointer;"
            @click="lock()"
          ></i
        ></span>
      </div>
    </div>

    <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
      <el-select
        class="select-primary"
        placeholder="Seleccione Dispositivo"
        @change="selectDevice()"
        v-model="selectedDevice"
        v-if="user_type != 2"
      >
        <el-option
          v-for="(device, index) in $store.state.devices"
          :value="index"
          :label="device.name"
          :key="device._id"
        >
        </el-option>
      </el-select>

      <div style="font-size:20px; margin-top:3px">
        <i
          v-if="this.pushNotif == true"
          class="fas fa-bell"
          style="margin-left:15px; cursor:pointer;"
          @click="unsubscribe()"
        ></i>
        <i
          v-if="this.pushNotif == false"
          class="far fa-bell-slash"
          style="margin-left:15px; cursor:pointer;"
          @click="subscribe()"
        ></i>
      </div>

      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        title-classes="nav-link"
        class="nav-item"
      >
        <template slot="title">
          <div
            v-if="$store.state.notifications.length > 0"
            class="notification d-none d-lg-block d-xl-block"
          ></div>
          <i class="far fa-comment-alt"></i>
          <p class="d-lg-none">NOTIFICACIONES</p>
        </template>

        <li
          @click="notificationReaded(notification._id)"
          v-for="notification in $store.state.notifications"
          class="nav-link"
        >
          <a href="#" class="nav-item dropdown-item">
            <b style="color:orangered">{{ unixToDate(notification.time) }}</b>
            <div style="margin-left:50px">
              <b>Dispositivo: </b> {{ notification.deviceName }} <br />
              <b>Variable: </b> {{ notification.variableFullName }} <br />
              <b>Condición: </b> {{ notification.condition }} <br />
              <b>Limite: </b> {{ notification.value }} <br />
              <b>Valor: </b> {{ notification.payload.value }}
            </div>
          </a>
        </li>
      </base-dropdown>

      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        class="nav-item"
        title-classes="nav-link"
        menu-classes="dropdown-navbar"
      >
        <template slot="title">
          <!--<div class="photo"><img src="img/Logo.png" /></div>-->
          <i class="fas fa-user-cog"></i>
          <b class="caret d-none d-lg-block d-xl-block"></b>
         
        </template>
        <li class="nav-link">
          <a href="#" @click="profile()" class="nav-item dropdown-item"
            >PERFIL</a
          >
        </li>
        <!-- <li class="nav-link">
          <a href="#" @click="devices_status()" class="nav-item dropdown-item"
            >SOLICITAR CONEXIONES</a
          >
        </li> -->
        <div class="dropdown-divider"></div>
        <li class="nav-link">
          <a href="#" @click="logOut()" class="nav-item dropdown-item"
            >CERRAR SESIÓN</a
          >
        </li>
      </base-dropdown>
    </ul>
  </base-nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import { BaseNav, Modal } from "@/components";
import { Select, Option } from "element-ui";

//import { getPublicKey } from "./../../js/app";

export default {
  components: {
    CollapseTransition,
    BaseNav,
    Modal,
    [Option.name]: Option,
    [Select.name]: Select
  },
  computed: {
    routeName() {
      const { path } = this.$route;
      let parts = path.split("/");
      if (parts == ",") {
        return "Dashboard";
      }
      return parts.map(p => this.capitalizeFirstLetter(p)).join(" ");
    },
    isRTL() {
      return this.$rtl.isRTL;
    }
  },
  data() {
    return {
      user_type: this.$store.state.auth.userData.type,
      user_name: this.$store.state.auth.userData.name,
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: "",
      selectedDevice: null,
      pushNotif: null,
      registersw: null
    };
  },
  mounted() {
    this.$store.dispatch("getDevices");
    this.$nuxt.$on("selectedDeviceIndex", this.updateSelectedDeviceIndex);
    this.sw(); // Service Worker Support
    this.startGeolocation();
  },
  beforeDestroy() {
    this.$nuxt.$off("selectedDeviceIndex");
  },
  methods: {
    //////////////////////////////////////////////////////

    geolocation(position) {
      const { latitude, longitude } = position.coords;
     // console.log(position.coords);//DEBUGEO
     // console.log("latitud: " + latitude);//DEBUGEO
     // console.log("longitud: " + longitude);//DEBUGEO
    },
    handleError(error) {
      const { code } = error;
      switch (code) {
        case GeolocationPositionError.TIMEOUT:
          // Handle timeout.
          break;
        case GeolocationPositionError.PERMISSION_DENIED:
          //console.log("Permiso denegado");//DEBUGEO
          // User denied the request.
          break;
        case GeolocationPositionError.POSITION_UNAVAILABLE:
          //console.log("Posición no disponible");//DEBUGEO
          // Position not available.
          break;
      }
    },
    startGeolocation() {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          this.geolocation,
          this.handleError
        );

        // Posicion en tiempo real
        // location debe ser una varibale de data()
        // const location = navigator.geolocation.watchPosition(position => {
        //   const { latitude, longitude } = position.coords;

        //   console.log(position.coords);
        //   console.log("latitud: " + latitude);
        //   console.log("longitud: " + longitude);
        // });

        // detener la geolocalización

        //  stopGeolocation(){
        //   navigator.geolocation.clearWatch(this.location);
        //  },

        // navigator.geolocation.getCurrentPosition(pos => {
        //   console.log(pos);

        //   const lat = pos.coords.latitude;
        //   const lng = pos.coords.longitude;

        //   console.log("latitud: " + lat);
        //   console.log("longitud: " + lng);
        // });
      }
    },

    ////////////////////////////////////////////////////////////////////////////

    msg() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        message: "hola"
      };

      this.$axios
        .post("/new-message", toSend, axiosHeaders)
        .then(res => {
          //console.log("mensaje enviado");//DEBUGEO
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    setUnsubscribeButton() {
      this.pushNotif = true;
    },
    setSubscribeButton() {
      this.pushNotif = false;
    },
    unsubscribe() {
      //console.log("unsuscribe notif push");//DEBUGEO

      this.registersw.pushManager.getSubscription().then(subs => {
        subs.unsubscribe().then(() => {
          //console.log("Unsubscribed", subs.endpoint);//DEBUGEO
          this.setSubscribeButton();
          //console.log(subs);//DEBUGEO
          const axiosHeaders = {
            headers: {
              token: this.$store.state.auth.token
            }
          };

          this.$axios
            .post("/unsubscription", subs, axiosHeaders)
            .then(async res => {
              // Listen Push Notifications
            })
            .catch(e => {
              console.log(e);
              return;
            });
        });
      });
    },
    async subscribe() {
     // console.log("Suscribiendo...");//DEBUGEO

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      this.$axios
        .get("/key", axiosHeaders)
        .then(async res => {
          // Listen Push Notifications
          //console.log("Listening Push Notifications");//DEBUGEO
          const subscription = await this.registersw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(res.data)
          });

          //console.log(subscription);//DEBUGEO

          this.$axios
            .post("/subscription", subscription, axiosHeaders)
            .then(async res => {
             // console.log("Subscribed!");//DEBUGEO
            })
            .then(this.setUnsubscribeButton)
            .catch(e => {
              console.log(e);
              this.unsubscribe();
              return;
            });
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    async verificasubscription() {
      //console.log("VERIFICANDO SUSCRIPCIONES DE SW...");//DEBUGEO
      // Service Worker
      //console.log("Registering a Service worker...");//DEBUGEO
      this.registersw = await navigator.serviceWorker.register(
        "/custom-sw.js",
        {
          scope: "/"
        }
      );

      navigator.serviceWorker.ready
        .then(function(registration) {
          //console.log("service worker registered!!");//DEBUGEO

          return registration.pushManager.getSubscription();
        })
        .then(subscription => {
          if (subscription) {
            //console.log("Already subscribed", subscription.endpoint);//DEBUGEO
            this.setUnsubscribeButton();
          } else {
            this.setSubscribeButton();
          }
        });
    },
    urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
    sw() {
      if ("serviceWorker" in navigator) {
        //console.log("SW DISPONIBLE EN EL NAVEGADOR PARA SER REGISTRADO");//DEBUGEO
        this.pushNotif = false;
        this.verificasubscription().catch(err => console.log(err));
      }
    },
    lock() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        lock: "1"
      };

      this.$axios
        .put("/lock", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            //console.log(res.data);//DEBUGEO

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
    },
    updateSelectedDeviceIndex(index) {
      this.selectedDevice = index;
    },
    notificationReaded(notifId) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      var auto;

      const toSend = {
        notifId: notifId
      };

      this.$axios
        .put("/notifications", toSend, axiosHeaders)
        .then(res => {
          this.$store.dispatch("getNotifications");
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    logOut() {
      console.log("logout");

      localStorage.clear();

      const auth = {};
      this.$store.commit("setAuth", auth);

      window.location.href = "/login";
    },
    profile() {
      window.location.href = "/perfil";
    },
    devices_status() {
      alert("SOLICITANDO ESTADO DE CONEXIÓN A DISPOSITIVOS");
    },
    selectDevice() {
      const device = this.$store.state.devices[this.selectedDevice];

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        dId: device.dId
      };

      this.$axios
        .put("/device", toSend, axiosHeaders)
        .then(res => {
          this.$store.dispatch("getDevices");
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    //UNIX A FECHA
    unixToDate(ms) {
      var d = new Date(parseInt(ms)),
        yyyy = d.getFullYear(),
        mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
        dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
        ampm = "AM",
        time;

      if (hh > 12) {
        h = hh - 12;
        ampm = "PM";
      } else if (hh === 12) {
        h = 12;
        ampm = "PM";
      } else if (hh == 0) {
        h = 12;
      }

      // ie: 2013-02-18, 8:35 AM
      time = dd + "/" + mm + "/" + yyyy + ", " + h + ":" + min + " " + ampm;

      return time;
    },
    capitalizeFirstLetter(string) {
      if (!string || typeof string !== "string") {
        return "";
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    }
  }
};
</script>
<style scoped>
.top-navbar {
  top: 0px;
}
</style>
