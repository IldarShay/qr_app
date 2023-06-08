<script setup>
import svgComponent from "@/components/svgComponent.vue";
import model from "@/assets/model";
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

// variables
const router = useRouter();
const count = ref(0);
const modelStores = model;
const isAuth = ref(localStorage.getItem("auth"));

authentication();

modelStores.forEach((store) => {
  store.id = count.value++;
});

const tradeStores = ref(JSON.parse(localStorage.getItem("stores")) || modelStores);
watchEffect(() => localStorage.setItem("stores", JSON.stringify(tradeStores.value)));
// function

function authentication() {
  if (isAuth.value) return false;
  else {
    router.push({ name: "auth" });
  }
}

function showInfoStore(store) {
  !store.show ? (store.show = true) : delete store.show;
  const index = findIndex(store);
  tradeStores.value[index] = { ...store };
  localStorage.setItem("stores", JSON.stringify(tradeStores.value));
}

function addStore(e) {
  const store = {
    name: "Название",
    amount: "Количество",
    x: e.pageX / 10,
    y: (e.pageY - 86) / 10,
    id: Date.now(),
  };
  tradeStores.value.push(store);
  localStorage.setItem("stores", JSON.stringify(tradeStores.value));
}

function deleteStore(store) {
  const index = findIndex(store);
  tradeStores.value.splice(index, 1);
  localStorage.setItem("stores", JSON.stringify(tradeStores.value));
}

function resetModel() {
  tradeStores.value = modelStores;
  localStorage.setItem("stores", JSON.stringify(tradeStores.value));
  location.reload();
}

function exitModel() {
  localStorage.removeItem("auth");
  router.push({ name: "auth" });
}

function startDrag(e, id) {
  e.dataTransfer.dropEffect = "move";
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("storeID", id);
}

function onDrop(e) {
  const storeID = e.dataTransfer.getData("storeID");
  const index = tradeStores.value.findIndex((store) => store.id == storeID);
  const x = e.pageX / 10;
  const y = (e.pageY - 100) / 10;
  const store = { ...tradeStores.value[index], x, y };
  tradeStores.value.splice(index, 1, store);
  localStorage.setItem("stores", JSON.stringify(tradeStores.value));
}
// reusable function

function findIndex(store) {
  const index = tradeStores.value.findIndex((el) => {
    return el.id === store.id;
  });
  return index;
}
</script>

<template>
  <div class="container">
    <div class="buttons">
      <button @click="exitModel" class="btn">Выйти</button>
      <button @click="resetModel" class="btn">Сбросить модель</button>
    </div>
    <div
      class="store-name"
      v-for="store in tradeStores"
      :key="store.id"
      :id="store.id"
      :style="{
        top: store.y * 10 + 74 + 'px',
        left: store.x * 10 - 12 + 'px',
      }"
    >
      <div class="buttons">
        <a class="add-icons">
          <i
            @click="showInfoStore(store)"
            class="material-icons"
            draggable="true"
            @dragstart="startDrag($event, store.id)"
            @dragenter.prevent
            @dragover.prevent
            >adjust</i
          >
        </a>
      </div>
      <div :class="{ out: store.show }" class="info-store">
        <input v-model="store.name" class="input-info" />
        <input v-model="store.amount" class="input-info" />
        <i @click="deleteStore(store)" class="tiny material-icons">delete</i>
      </div>
    </div>
    <div class="svgElement">
      <svgComponent
        @dblclick="addStore"
        @drop="onDrop($event)"
        @dragenter.prevent
        @dragover.prevent
      >
      </svgComponent>
    </div>
  </div>
</template>

<style lang="scss">
.container {
  margin: 0;
  width: fit-content;
}
.btn {
  margin: 25px;
}
#svgElement {
  left: 0px;
  z-index: 0;
}
.store-name {
  z-index: 100;
  position: absolute;
  width: fit-content;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  a {
    margin: 0;
    padding: 0;
    color: black;
  }
}
.add-icons {
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0);
  border: none;
  padding: 0;
}

.material-icons {
  width: 24px;
  height: 24px;
  text-shadow: none;
  cursor: pointer;
}
.info-store {
  display: none;
}
.out {
  width: 120px;
  display: flex;
  flex-direction: column;
  .input-info {
    width: 80px;
    height: 20px;
    margin: 0;
    padding: 0;
    color: black;
    font-size: 14px;
    font-weight: 500;
    text-shadow: 1px 1px 2px black;
    border: none;
    box-sizing: border-box;
  }
}
</style>
