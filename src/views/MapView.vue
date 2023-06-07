<script setup>
import svgComponent from "@/components/svgComponent.vue";
import model from "@/assets/model";
import { ref } from "vue";
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

localStorage.setItem("stores", JSON.stringify(tradeStores.value));

// function

function authentication() {
  if (isAuth.value) return false;
  else {
    router.push({ name: "auth" });
  }
}

function showInfoStore(store) {
  !store.show ? (store.show = true) : delete store.show;
  const index = findIndex(tradeStores.value, store);
  tradeStores.value[index] = { ...store };
  console.log(index);
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
  const index = findIndex(tradeStores.value, store);
  tradeStores.value.splice(index, 1);
  localStorage.setItem("stores", JSON.stringify(tradeStores.value));
}

function resetModel() {
  tradeStores.value = modelStores;
  localStorage.setItem("stores", JSON.stringify(tradeStores.value));
}

function onInputName(e) {
  const inputName = e.target.textContent.split(" ").splice(0, 1).join("");
  const inputAmount = e.target.textContent.split(" ").splice(2, 1).join("");
  const id = +e.target.parentNode.getAttribute("id");
  let stores = JSON.parse(localStorage.getItem("stores"));
  const index = stores.findIndex((store) => {
    return store.id === id;
  });
  stores[index].name = inputName;
  stores[index].amount = inputAmount;
  localStorage.setItem("stores", JSON.stringify(stores));
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
    <button @click="exitModel" class="btn">Выйти</button>
    <button @click="resetModel" class="btn">Сбросить модель</button>
    <div class="trade-stores">
      <div
        v-for="store in tradeStores"
        class="store-name"
        :key="store.id"
        :id="store.id"
        :style="{
          top: store.y * 10 + 74 + 'px',
          left: store.x * 10 - 12 + 'px',
        }"
        draggable="true"
        @dragstart="startDrag($event, store.id)"
        @dragenter.prevent
        @dragover.prevent
      >
        <div class="buttons">
          <a class="add-icons">
            <i @click="showInfoStore(store)" class="material-icons">adjust</i>
          </a>
        </div>
        <span :class="{ out: !store.show }" id="info" contenteditable="true" @input="onInputName">
          {{ `${store.name} - ${store.amount} шт.` }}
          <i @click="deleteStore(store)" class="material-icons">delete</i>
        </span>
      </div>
    </div>
    <svgComponent @dblclick="addStore" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
    </svgComponent>
  </div>
</template>

<style lang="scss">
.container {
  margin: 0;
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
  span {
    color: black;
    font-weight: 500;
    text-shadow: 1px 1px 2px black;
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
.out {
  display: none;
  align-items: start;
}
.out:active {
  border: 0px;
}
</style>
