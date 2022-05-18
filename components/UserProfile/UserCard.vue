<template>
  <card class="card-user">
    <p class="card-text"></p>
    <div class="author">
      <div class="block block-one"></div>
      <div class="block block-two"></div>
      <div class="block block-three"></div>
      <div class="block block-four"></div>
      <a href="javascript:void(0)">
        <img class="avatar" src="img/Logo.png" alt="..." />
        <h5 class="title">{{user.username}}</h5>
      </a>
      <p class="description">{{user.email}}</p>
    </div>
    <!-- <div class="card-description">
      Do not be scared of the truth because we need to restart the human
      foundation in truth And I love you like Kanye loves Kanye I love Rick
      Owens’ bed design but the back is...
    </div> -->
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
      }
    };
  }
};
</script>
<style></style>
