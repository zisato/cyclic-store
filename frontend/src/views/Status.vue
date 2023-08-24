<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5 mx-auto">
            <div class="d-flex justify-content-center">
                <h4>Status: {{ status }}</h4>
            </div>
        </div>
    </section>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ApiClient } from '../clients/api-client';

const status = ref<string>('loading');

onMounted(async () => {
  const apiClient = new ApiClient()
  const response = await apiClient.get<{ status: string }>('/status')

  status.value = response.body.status
})
</script>