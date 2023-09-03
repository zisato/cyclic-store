<template>
  <div class="col-3">
    <div class="input-group">
      <input class="form-control" type="text" v-model="mockedToken" />
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" @click.prevent="mockLogin">Login</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import { useUserStore } from '../store/UserStore'

type LoginCallbackReponse = {
  clientId: string
  credential: string
}

const mockedToken = ref<string>('mock-credential')
const router = useRouter()

async function mockLogin(): Promise<void> {
  const response = {
    clientId: 'mock-client-id',
    credential: mockedToken.value
  }

  return loginCallback(response)
}

async function loginCallback(response: LoginCallbackReponse): Promise<void> {
  const userStore = useUserStore();

  await userStore.fetchByToken(response.credential)

  router.push({ name: 'home' })
}
</script>
