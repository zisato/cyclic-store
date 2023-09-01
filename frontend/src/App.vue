<template>
  <main role="main" class="d-flex flex-column vh-100">
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container px-4 px-lg-5">
          <a class="navbar-brand" href="#!">Brand name</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <Navbar />
            <Cart />
          </div>
        </div>
      </nav>
    </header>

    <router-view class="container"></router-view>
  </main>
</template>

<script setup lang="ts">
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from './components/Navbar.vue'
import Cart from './components/Cart.vue'
</script>
