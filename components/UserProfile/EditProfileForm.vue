<template>
  <card>
    <form @submit.prevent="updateProfile">
      <div class="row">
        <div class="col-md-6">
          <base-input
            type="text"
            label="EMPRESA"
            :disabled="true"
            placeholder="Company"
            v-model="user.company"
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            type="text"
            label="CLIENTE"
            :disabled="true"
            placeholder="Username"
            v-model="user.username"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <base-input
            type="email"
            label="EMAIL"
            :disabled="true"
            placeholder="mike@email.com"
            v-model="user.email"
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            type="password"
            label="CONTRASEÑA ACTUAL"
            placeholder=""
            v-model="user.password"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <base-input
            type="password"
            label="NUEVA CONTRASEÑA"
            placeholder=""
            v-model="user.new_password"
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            type="password"
            label="CONFIRMAR CONTRASEÑA"
            placeholder=""
            v-model="user.confirm_password"
          >
          </base-input>
        </div>
      </div>      

      <base-button native-type="submit" type="warning" class="btn-fill">
        Guardar
      </base-button>
    </form>
  </card>
</template>
<script>
export default {
  data() {
    return {
      user: {
        company: 'TELKINGS',
        username: this.$store.state.auth.userData.name.toUpperCase(),
        email: this.$store.state.auth.userData.email.toUpperCase(),
        password: '',
        confirm_password: '',
        new_password: ''
      }
    };
  },
  methods: {
    updateProfile() {

      if(this.user.new_password == this.user.confirm_password){
        const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

       const toSend = {
        user: this.user,
        ad: false
      };

      this.$axios
        .put("/updatepassword", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {

            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: "Contraseña modificada"
            });

           $nuxt.$router.push('/dashboard');

            return;
          }
        })
        .catch(e => {
          console.log(e.response.data);

           this.$notify({
               type: "warning",
               icon: "tim-icons icon-alert-circle-exc",
               message: "Contraseña no modificada"
             });
         
        });
      }
      else{
        this.$notify({
               type: "warning",
               icon: "tim-icons icon-alert-circle-exc",
               message: "Las contraseñas ingresadas no coinciden"
             });
      }
      
      

    }
  }
};
</script>
<style></style>
