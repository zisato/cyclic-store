<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5 mx-auto">
            <div class="d-flex justify-content-center">
                <Login v-show="!isLogged()" />
            </div>
        </div>
    </section>
</template>
  
<script setup lang="ts">
import Login from '../components/Login.vue'
import { useUserStore } from '../store/UserStore'

const userStore = useUserStore();

function isLogged(): boolean {
  return userStore.user !== null
}
</script>