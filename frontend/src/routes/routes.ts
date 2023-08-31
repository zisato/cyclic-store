import CreateCategory from '../views/category/CreateCategory.vue';
import CreateProduct from '../views/product/CreateProduct.vue';
import Home from '../views/Home.vue';
import ListCategories from '../views/category/ListCategories.vue';
import ListSellerProducts from '../views/product/ListSellerProducts.vue';
import Login from '../views/Login.vue';
import Products from '../views/Products.vue';
import { RouteRecordRaw } from 'vue-router';
import Status from '../views/Status.vue';
import Stores from '../views/Stores.vue';
import UpdateCategory from '../views/category/UpdateCategory.vue';

const routes: RouteRecordRaw[] = [
    { path: '/', component: Home, name: 'home' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/status', component: Status, name: 'status' },
    { path: '/stores', component: Stores, name: 'list-stores' },
    { path: '/stores/:storeId/products', component: Products, name: 'list-products-by-store' },
    
    { path: '/admin/products', component: ListSellerProducts, name: 'list-seller-products' },
    { path: '/admin/products/create', component: CreateProduct, name: 'create-product' },
    { path: '/categories', component: ListCategories, name: 'list-categories' },
    { path: '/categories/create', component: CreateCategory, name: 'create-category' },
    { path: '/categories/:categoryId/update', component: UpdateCategory, name: 'update-category' },
];

export default routes;