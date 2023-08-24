import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import CreateCategory from '../views/category/CreateCategory.vue';
import ListCategories from '../views/category/ListCategories.vue';
import Home from '../views/Home.vue';
import Status from '../views/Status.vue';

const routes: Array<RouteRecordRaw> = [
    { path: '/', component: Home, name: 'home' },
    { path: '/status', component: Status, name: 'status' },
    { path: '/categories', component: ListCategories, name: 'list-categories' },
    { path: '/categories/create', component: CreateCategory, name: 'create-category' },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;