<template>
  <main role="main" class="d-flex flex-column vh-100">
    <div>
      <Login v-show="!isLogged()" />

      <a v-show="isLogged()" class="nav-link" href="#" @click.prevent="logOut">
        LogOut
      </a>

      <a v-show="isLogged() && !isSeller()" class="nav-link" href="#" @click.prevent="createStore">
        Create store
      </a>

      <router-link :to="{ name: 'home' }">Go to Home</router-link>
      <br />
      <router-link :to="{ name: 'status' }">Go to Status</router-link>
      <br />
      <router-link v-show="isSeller()" :to="{ name: 'list-categories' }">Go to list categories</router-link>
      <br />
      <router-link v-show="isSeller()" :to="{ name: 'create-category' }">Go to create Category</router-link>
    </div>

    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login.vue'
import { useUserStore } from './store/UserStore'

const userStore = useUserStore();

function createStore(): void {

}

function logOut(): void {
  userStore.clear()
}

function isLogged(): boolean {
  return userStore.user !== null
}

function isSeller(): boolean {
  return userStore.isSeller
}
</script>
