<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5">
            <div class="row">
                <div class="container d-flex justify-content-end">
                    <router-link class="btn btn-outline-dark mt-auto" :to="{ name: 'create-category' }">
                        Create category
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
                        <tbody>
                            <tr v-for="(category, index) in categories">
                                <th scope="row">{{index}}</th>
                                <td>{{category.name}}</td>
                                <td>
                                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <router-link class="btn btn-sm btn-primary" :to="{ name: 'update-category', params: { categoryId: category.id } }">Edit</router-link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td class="border-bottom-0">
                                    <div class="justify-content-start">
                                        Total: {{categories.length}}
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
import { Category } from '../../models/category'
import { ApiClientCategoryRepository } from '../../repositories/api-client-category-repository'

const categories = ref<Array<Category>>([])

onMounted(async () => {
    const categoryRepository = new ApiClientCategoryRepository()
    categories.value = await categoryRepository.findAll()
})
</script>
