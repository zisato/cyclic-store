<template>
  <main role="main" class="d-flex flex-column vh-100">
    <div>
      <router-link to="/">Go to Home</router-link>
      <br />
      <router-link to="/status">Go to Status</router-link>
      <br />
      <router-link to="/categories/create">Go to create Category</router-link>
    </div>

    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
</script>
