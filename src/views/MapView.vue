<script setup>
import svgComponent from "@/components/svgComponent.vue";
import model from "@/hooks/model";
import router from "@/router";
import { ref } from "vue";

// variables
const count = ref(0);
function authentication() {
  if (localStorage.getItem("auth")) return false;
  else {
    router.push({ name: "auth" });
  }
}
authentication();
const modelStores = model;
modelStores.map((store) => {
  store.id = Math.ceil(Math.random() * 10 ** 10);
});
const tradeStores = ref(JSON.parse(localStorage.getItem("stores")) || modelStores);
const nameNewStore = ref("Название");
const amountProduct = ref("Количество");
localStorage.setItem("stores", JSON.stringify(tradeStores.value));
setTimeout(() => {
  const svgElement = document.getElementById("svgElement");
  svgElement.addEventListener("dblclick", addStore);
  const storeListElement = document.querySelector(".trade-stores");
  const storeElement = document.querySelector(".store-name");
}, 0);

// function

function showInfoStore(e) {
  const curEl = e.target.nextElementSibling;
  curEl.classList.toggle("out");
}

function addStore(e) {
  const store = {
    name: nameNewStore.value,
    amount: amountProduct.value,
    x: e.pageX / 10,
    y: e.pageY / 10 - 10,
    id: Date.now(),
  };
  tradeStores.value.push(store);
  localStorage.setItem("stores", JSON.stringify(tradeStores.value));
}

function deleteStore(e) {
  const nameStore = e.target.closest("#info").textContent.split(" ").splice(0, 1).join("");
  e.target.closest("li").remove();
  let stores = JSON.parse(localStorage.getItem("stores"));
  const index = stores.findIndex((store) => {
    return store.name === nameStore;
  });
  stores.splice(index, 1);
  localStorage.setItem("stores", JSON.stringify(stores));
}

function resetModel() {
  localStorage.setItem("stores", JSON.stringify(modelStores));
  location.reload();
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

function startDrag(e, store) {
  console.log(store);
  e.dataTransfer.dropEffect = "move";
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("storeID", store.id);
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
</script>

<template>
  <div
    class="container"
    draggable="true"
    @drop="onDrop($event)"
    @dragenter.prevent
    @dragover.prevent
  >
    <button @click="exitModel" class="btn">Выйти</button>
    <button @click="resetModel" class="btn">Сбросить модель</button>
    <ul class="trade-stores">
      <li
        v-for="store in tradeStores"
        class="store-name"
        :key="store.id"
        :id="store.id"
        :style="{
          top: store.y * 10 + 88 + 'px',
          left: store.x * 10 - 12 + 'px',
        }"
        draggable="true"
        @dragstart="startDrag($event, store)"
      >
        <i @click="showInfoStore" class="material-icons">adjust</i>
        <span class="out" id="info" contenteditable="true" @input="onInputName">
          {{ `${store.name} - ${store.amount} шт.` }}
          <i @click="deleteStore" class="material-icons">delete</i>
        </span>
      </li>
    </ul>
    <svgComponent id="svgElement"> </svgComponent>
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
  cursor: move;
  span {
    color: black;
    font-weight: 500;
    text-shadow: 1px 1px 2px black;
  }
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
