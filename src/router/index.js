import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "auth",
    component: () => import("@/views/AuthPage.vue"),
  },
  {
    path: "/map",
    name: "MapView",
    component: () => import("@/views/MapView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
