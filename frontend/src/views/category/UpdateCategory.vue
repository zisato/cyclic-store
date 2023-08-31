<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 justify-content-center">
            <h4>Update category</h4>
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
import { onMounted, ref } from 'vue'
import { ApiClientCategoryRepository } from '../../repositories/ApiClientCategoryRepository'

const router = useRouter()
const category = ref({ name: '' })
const categoryId = router.currentRoute.value.params.categoryId as string
const categoryRepository = new ApiClientCategoryRepository()

onMounted(async () => {
    const categoryById = await categoryRepository.findById(categoryId)
    if (!categoryById) {
        throw new Error(`Category with id ${categoryId} not found`)
    }

    category.value = categoryById
})

async function submitForm(): Promise<void> {
    const newCategory = {
        id: categoryId,
        name: category.value.name
    }

    await categoryRepository.update(newCategory)

    router.push({ name: 'list-categories' })
}
</script>
../../repositories/apiClientCategoryRepository