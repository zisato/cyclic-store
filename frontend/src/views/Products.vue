<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 justify-content-center">
            <h4>{{ store.name }}</h4>
        </div>
        <div class="container px-4 px-lg-5 mt-5">
            <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                <div class="col mb-5" v-show="emptyProducts()">
                    <h5 class="fw-bolder">Empty products</h5>
                </div>
                <div class="col mb-5" v-for="product in products">
                    <div class="card h-100">
                        <!-- Product image-->
                        <!-- <img class="card-img-top" v-bind:src="imageSrc(product.image)" alt="" /> -->
                        <!-- Product details-->
                        <div class="card-body p-4">
                            <div class="text-center">
                                <!-- Product name-->
                                <h5 class="fw-bolder">{{ product.name }}</h5>
                            </div>
                        </div>
                        <!-- Product actions-->
                        <!-- <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <button class="btn btn-outline-dark mt-auto" v-on:click="addItemToCart(product)">Add to
                                    cart</button>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { Product } from '../models/Product'
import { ApiClientProductRepository } from '../repositories/ApiClientProductRepository'
import { ApiClientStoreRepository } from '../repositories/ApiClientStoreRepository'

const store = ref({ name: '' })
const products = ref<Array<Product>>([])

function emptyProducts(): boolean {
    return products.value.length === 0;
}

onMounted(async () => {
    const router = useRouter()
    const storeId = router.currentRoute.value.params.storeId as string

    const storeRepository = new ApiClientStoreRepository()
    store.value = await storeRepository.getById(storeId)

    const productRepository = new ApiClientProductRepository()
    products.value = await productRepository.findByStoreId(storeId)
})
</script>
  