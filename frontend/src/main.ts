import App from './App.vue';
import { createApp } from 'vue';
import Home from './views/Home.vue';
import Status from './views/Status.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    { path: '/', component: Home },
    { path: '/status', component: Status },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
  
const app = createApp(App);

app.use(router);

app.mount('#app');
