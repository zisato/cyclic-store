<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 justify-content-center">
            <h4>Create product</h4>
        </div>
        <div class="container px-4 px-lg-5 mt-5">
            <form @submit.prevent="submitForm">
                <div class="mb-3">
                    <label for="product[name]" class="form-label">Name</label>
                    <input type="text" class="form-control" name="product[name]" v-model="product.name"/>
                </div>
                <div class="mb-3">
                    <button type="submit" class="btn btn-primary me-1">Submit</button>
                    <router-link class="btn btn-secondary" :to="{ name: 'list-seller-products' }">Cancel</router-link>
                </div>
            </form>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { v1 } from 'uuid'
import { ApiClientProductRepository } from '../../repositories/ApiClientProductRepository'

const router = useRouter()
const product = ref({ name: '' })

async function submitForm(): Promise<void> {
    const productRepository = new ApiClientProductRepository()

    const newProduct = {
        id: v1().toString(),
        name: product.value.name
    }

    await productRepository.create(newProduct)

    router.push({ name: 'list-seller-products' })
}
</script>