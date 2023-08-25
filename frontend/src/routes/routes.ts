import { RouteRecordRaw } from 'vue-router';
import CreateCategory from '../views/category/CreateCategory.vue';
import ListCategories from '../views/category/ListCategories.vue';
import UpdateCategory from '../views/category/UpdateCategory.vue';
import Home from '../views/Home.vue';
import Status from '../views/Status.vue';

const routes: RouteRecordRaw[] = [
    { path: '/', component: Home, name: 'home' },
    { path: '/status', component: Status, name: 'status' },
    { path: '/categories', component: ListCategories, name: 'list-categories' },
    { path: '/categories/create', component: CreateCategory, name: 'create-category' },
    { path: '/categories/:categoryId/update', component: UpdateCategory, name: 'update-category' },
];

export default routes;