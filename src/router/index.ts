import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import EnrolledTeamsView from '../views/EnrolledTeamsView.vue';
import MyTeamView from '../views/MyTeamView.vue';
import AdminDashboardView from '../views/admin/AdminDashboardView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/teams',
      name: 'enrolled-teams',
      component: EnrolledTeamsView,
    },
    {
      path: '/my-team',
      name: 'my-team',
      component: MyTeamView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
