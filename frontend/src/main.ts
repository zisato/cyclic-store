import { createRouter, createWebHistory } from 'vue-router';

import { ApiClientError } from './clients/api-client';
import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import routes from './routes/routes'
import { useUserStore } from './store/UserStore';
import { TokenLocalStorage } from './storage/TokenLocalStorage';

const app = createApp(App);
const router = createRouter({
    history: createWebHistory(),
    routes,
});

app
    .use(router)
    .use(createPinia());

app.config.errorHandler = (error: unknown) => {
    if (error instanceof ApiClientError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
            const userStore = useUserStore()

            userStore.clear()
            TokenLocalStorage.remove();

            router.push({ name: 'home' });
        }
    }
};

app.mount('#app');
