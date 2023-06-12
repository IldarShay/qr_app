import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "auth",
    component: () => import("@/views/AuthPage.vue"),
    requiresAuth: false,
  },
  {
    path: "/map",
    name: "MapView",
    component: () => import("@/views/MapView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem("auth") !== null;
  if (to.meta.requiresAuth && !isAuth) {
    next("/");
  } else if (!to.meta.requiresAuth && isAuth) {
    next("/map");
  } else {
    next();
  }
});

export default router;
