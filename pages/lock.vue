<template>
  <div class="container lock-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-lock card-white text-center">
        <img style=" width: 120px;
            height: 120px;
            border-radius: 50%;
            margin-top: -60px;
            box-shadow: $box-shadow-raised;" 
        slot="header" src="img//emilyz.jpg" alt="..." />

        <h4 class="card-title-text">{{$store.state.auth.userData.name.toUpperCase()}}</h4>
        <base-input
          name="password"
          type="password"
          v-model="user.password"
          placeholder="Password"
          addon-left-icon="tim-icons icon-lock-circle"
        >
        </base-input>

        <base-button @click="unlock()" class="mb-3" native-type="submit" type="warning" size="lg" block>
          DESBLOQUEAR
        </base-button>
      </card>
    </div>
  </div>
</template>
<script>
export default {
  middleware: "lock",
  name: 'lock-page',
  layout: 'auth',

  data() {
    return {
      user: {
        password: ""
      }
    };
  },

  mounted() {
    this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: "Cuenta bloqueda"
            });
  },

  methods: {
    unlock(){
      //window.location.href = "/dashboard";

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

       const toSend = {
        user: this.user,
        lock: '0'
      };
     
      this.$axios
        .put("/unlock", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {

            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: "Cuenta desbloqueada"
            });

            const auth = {
              token: this.$store.state.auth.token,
              userData: res.data.userData
            }

            //token to de store - token a la tienda
            this.$store.commit('setAuth', auth);

            //set auth object in localStorage - Grabamos el token en localStorage
            localStorage.setItem('auth', JSON.stringify(auth));

           $nuxt.$router.push('/dashboard');

            return;
          }
        })
        .catch(e => {
          console.log(e.response.data);

          this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message: "Contraseña incorrecta"
            });
         
        });


    }
  }
};
</script>
<style></style>