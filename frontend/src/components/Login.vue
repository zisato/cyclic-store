<template>
    <a
          class="nav-link"
          href="#"
          @click.prevent="login"
      >
          LogIn
  </a>
</template>

<script setup lang="ts">
import { ApiClient } from '../clients/api-client';

type LoginCallbackReponse = {
  id: string;
  attributes: {
    roles: string[];
  };
}
async function login(): Promise<void> {
  const id = '54321';
  const token = '12345';
  const apiClient = new ApiClient();
  const response = await apiClient.post<LoginCallbackReponse>('/login/callback', {
    data: {
        id,
        attributes: {
            token
        }
    }
  });

  const user = response.body;
  console.log(user);
}

</script>
