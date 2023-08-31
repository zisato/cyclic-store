<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5">
            <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                <div class="col mb-5" v-for="store in stores">
                    <div class="card h-100">
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h5 class="fw-bolder">{{ store.name }}</h5>
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <router-link class="btn btn-outline-dark mt-auto"
                                    :to="{ name: 'list-products-by-store', params: { storeId: store.id } }">Products</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { Store } from '../models/Store'
import { ApiClientStoreRepository } from '../repositories/ApiClientStoreRepository'
import { useUserStore } from '../store/UserStore'

const userStore = useUserStore()
const router = useRouter()
let stores = ref<Array<Store>>([])

onMounted(async () => {
    if (!userStore.hasUser) {
        return router.push({ name: 'home' })
    }

    const storeRepository = new ApiClientStoreRepository()
    stores.value = await storeRepository.findAll()
})
</script>
  