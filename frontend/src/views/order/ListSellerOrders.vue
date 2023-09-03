<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5">
            <div class="row">
                <div class="container d-flex">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody v-for="(order, index) in orders">
                            <th scope="row">{{index}}</th>
                            <td>{{order.status}}</td>
                            <td>
                                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <!--
                                    <router-link class="btn btn-sm btn-primary"
                                        :to="{ name: 'complete-order', params: { orderId: order.id } }">Edit</router-link>
                                    -->
                                </div>
                            </td>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td class="border-bottom-0">
                                    <div class="justify-content-start">
                                        Total: {{orders.length}}
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
import { Order } from '../../models/Order'
import { ApiClientOrderRepository } from '../../repositories/ApiClientOrderRepository'

const orders = ref<Array<Order>>([])

const orderRepository = new ApiClientOrderRepository()

onMounted(async () => {
    orders.value = await orderRepository.findByCurrentUser()
})
</script>
