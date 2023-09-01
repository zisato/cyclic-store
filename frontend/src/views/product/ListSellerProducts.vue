<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5">
            <div class="row">
                <div class="container d-flex justify-content-end">
                    <router-link class="btn btn-outline-dark mt-auto" :to="{ name: 'create-product' }">
                        Create product
                    </router-link>
                </div>
                <div class="container d-flex">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody v-for="(product, index) in products">
                            <th scope="row">{{index}}</th>
                            <td>{{product.name}}</td>
                            <td>
                                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <router-link class="btn btn-sm btn-primary"
                                        :to="{ name: 'update-product', params: { productId: product.id } }">Edit</router-link>
                                </div>
                            </td>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td class="border-bottom-0">
                                    <div class="justify-content-start">
                                        Total: {{products.length}}
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Product } from '../../models/Product'
import { ApiClientProductRepository } from '../../repositories/ApiClientProductRepository'

const products = ref<Array<Product>>([])

const productRepository = new ApiClientProductRepository()

onMounted(async () => {
    products.value = await productRepository.findByCurrentUser()
})
</script>
