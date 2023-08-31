<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 justify-content-center">
            <h4>Create category</h4>
        </div>
        <div class="container px-4 px-lg-5 mt-5">
            <form @submit.prevent="submitForm">
                <div class="mb-3">
                    <label for="category[name]" class="form-label">Name</label>
                    <input type="text" class="form-control" name="category[name]" v-model="category.name"/>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { v1 } from 'uuid'
import { ApiClientCategoryRepository } from '../../repositories/ApiClientCategoryRepository'

const router = useRouter()
const category = ref({ name: '' })

async function submitForm(): Promise<void> {
    const categoryRepository = new ApiClientCategoryRepository()

    const newCategory = {
        id: v1().toString(),
        name: category.value.name
    }

    await categoryRepository.create(newCategory)

    router.push({ name: 'list-categories' })
}
</script>
../../repositories/apiClientCategoryRepository