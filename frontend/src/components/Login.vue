<template>
  <a class="nav-link" href="#" @click.prevent="mockLogin">
    LogIn
  </a>
</template>

<script setup lang="ts">
import { useUserStore } from '../store/UserStore'

type LoginCallbackReponse = {
  clientId: string
  credential: string
}

const userStore = useUserStore();

async function mockLogin(): Promise<void> {
  const response = {
    clientId: 'mock-client-id',
    credential: 'mock-credential'
  }

  return loginCallback(response)
}

async function loginCallback(response: LoginCallbackReponse): Promise<void> {
  await userStore.fetchByToken(response.credential)
}
</script>
