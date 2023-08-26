<template>
  <main role="main" class="d-flex flex-column vh-100">
    <div>
      <Login />
      <router-link :to="{ name: 'home' }">Go to Home</router-link>
      <br />
      <router-link :to="{ name: 'status' }">Go to Status</router-link>
      <br />
      <router-link :to="{ name: 'list-categories' }">Go to list categories</router-link>
      <br />
      <router-link :to="{ name: 'create-category' }">Go to create Category</router-link>
    </div>

    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login.vue'
</script>
