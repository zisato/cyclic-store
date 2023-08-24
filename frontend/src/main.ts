import App from './App.vue';
import { createApp } from 'vue';
import CreateCategory from './views/CreateCategory.vue';
import Home from './views/Home.vue';
import Status from './views/Status.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    { path: '/', component: Home },
    { path: '/status', component: Status },
    { path: '/categories/create', component: CreateCategory },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
  
const app = createApp(App);

app.use(router);

app.mount('#app');
