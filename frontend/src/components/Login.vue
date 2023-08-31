<template>
  <a class="nav-link" href="#" @click.prevent="mockLogin">
    LogIn
  </a>
</template>

<script setup lang="ts">
import { TokenStorage } from '../storage/TokenStorage'
import { useUserStore } from '../store/UserStore'
import { ApiClientUserRepository } from '../repositories/ApiClientUserRepository';

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
  const userRepository = new ApiClientUserRepository()
  userStore.user = await userRepository.getByToken(response.credential)

  const tokenStorage = new TokenStorage();
  tokenStorage.set({ token: response.credential })
}
</script>
