<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 justify-content-center">
            <h4>Update product</h4>
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
import { onMounted, ref } from 'vue'
import { ApiClientProductRepository } from '../../repositories/ApiClientProductRepository'
import { Product } from '../../models/Product';

const router = useRouter()
const productRepository = new ApiClientProductRepository()
const product = ref<Product>({
    id: '',
    name: '',
})
const productId = router.currentRoute.value.params.productId as string

onMounted(async () => {
    product.value = await productRepository.getById(productId)
})

async function submitForm(): Promise<void> {
    const productRepository = new ApiClientProductRepository()

    const updatedProduct: Product = {
        id: productId,
        name: product.value.name
    }

    await productRepository.update(updatedProduct)

    router.push('/admin/products')
}
</script>