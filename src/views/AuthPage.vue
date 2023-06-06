<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const login = ref("");
const password = ref("");
let isAuth = ref(localStorage.getItem("auth") || null);
if (isAuth.value === true) {
  router.push({
    name: "MapView",
  });
}

function userAuth() {
  if (login.value === "test" && password.value === "test") {
    isAuth = true;
    localStorage.setItem("auth", isAuth);
    router.push({
      name: "MapView",
    });
  } else return false;
}
</script>

<template>
  <form @submit.prevent="userAuth()" class="col s12 auth">
    <div class="row">
      <div class="input-field col s12">
        <input v-model="login" id="login" type="text" class="validate" />
        <label for="login">Логин</label>
      </div>
    </div>
    <div class="row">
      <div class="input-field col s12">
        <input v-model="password" id="password" type="text" class="validate" />
        <label for="password">Пароль</label>
      </div>
    </div>
    <button type="submit" class="btn" data-target="modalWindow">Войти</button>
  </form>
</template>

<style scoped lang="scss">
form {
  width: 40%;
  margin: 150px auto;
}
</style>
