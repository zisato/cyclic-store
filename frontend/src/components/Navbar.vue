<template>
    <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
        <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'home' }">Home</router-link>
        </li>

        <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'status' }">Status</router-link>
        </li>

        <li class="nav-item dropdown" v-show="isLogged()">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                My Store
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li v-show="isLogged() && !isSeller()">
                    <a class="dropdown-item" href="#" v-on:click="createStore">Create store</a>
                </li>

                <li v-show="isLogged() && isSeller()">
                    <router-link class="dropdown-item" :to="{ name: 'list-seller-products' }">List products</router-link>
                    <router-link class="dropdown-item" :to="{ name: 'list-seller-orders' }">List orders</router-link>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { useUserStore } from '../store/UserStore'
import { ApiClientStoreRepository } from '../repositories/ApiClientStoreRepository';
import { v1 } from 'uuid'
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

async function createStore(): Promise<void> {
  userStore.addSellerRole()

  const storeId = v1().toString()
  const storeRepository = new ApiClientStoreRepository();
  const store = {
    id: storeId,
    name: 'Store'
  }
  await storeRepository.create(store)
  userStore.addStoreId(storeId)

  if (router.currentRoute.value.name === 'home') {
    router.go(0)
  } else {
    router.push({ name: 'home' })
  }
}

function isLogged(): boolean {
  return userStore.user !== null
}

function isSeller(): boolean {
  return userStore.isSeller
}
</script>