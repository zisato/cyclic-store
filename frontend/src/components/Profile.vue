<template>
  <ul class="navbar-nav ms-auto mb-2 mb-lg-0 ms-lg-4" v-show="isLogged()">
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="profileNavbarDropdown" role="button" data-bs-toggle="dropdown"
        data-bs-auto-close="outside" aria-expanded="false">
        <i class="bi-cart-fill me-1"></i>
          <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5b5f4a76%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5b5f4a76%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2274.41666603088379%22%20y%3D%22104.55999994277954%22%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" class="rounded-circle" height="25" loading="lazy">
      </a>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileNavbarDropdown">
        <li v-show="isLogged()">
            <a class="dropdown-item" href="#" @click.prevent="logOut">
              Logout
            </a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useUserStore } from '../store/UserStore'
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

function isLogged(): boolean {
  return userStore.user !== null
}

function logOut(): void {
  userStore.clear()

  if (router.currentRoute.value.name === 'home') {
    router.go(0)
  } else {
    router.push({ name: 'home' })
  }
}
</script>
