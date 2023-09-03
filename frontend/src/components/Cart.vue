<template>
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 ms-lg-4">
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="cartNavbarDropdown" role="button" data-bs-toggle="dropdown"
                data-bs-auto-close="outside" aria-expanded="false">
                <i class="bi-cart-fill me-1"></i>
                Cart
                <span class="badge bg-dark text-white ms-1 rounded-pill">
                    {{ cart.items.length }}
                </span>
            </a>

            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cartNavbarDropdown">
                <li class="justify-content-center">
                    <div class="dropdown-item bg-body" style="width: max-content;">
                        <table class="table table-sm mb-0">
                            <tbody>
                                <tr v-show="!cartHasItems()">
                                    <td class="border-bottom-0">
                                        <div class="row">
                                            <div class="col-12">
                                                <span class="text-black">Empty cart</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="mb-1" v-for="item, index in cart.items">
                                    <td :class="{ 'border-bottom-0': index === cart.items.length - 1 }">
                                        <div class="row">
                                            <div class="col-12">
                                                <span class="text-black">{{ item.name }}</span>
                                            </div>
                                        </div>
                                        <div class="row justify-content-end">
                                            <div class="col-5"> 
                                                <div class="input-group input-group-sm">
                                                    <span @click.prevent="removeQuantity(item.productId)"
                                                        class="input-group-text bg-body border-end-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                                                            <path
                                                                d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                                        </svg>
                                                    </span>
                                                    <input type="text" disabled v-model="item.quantity"
                                                        class="form-control bg-body border-end-0 border-start-0" style="text-align: center;" />
                                                    <span @click.prevent="addQuantity(item.productId)"
                                                        class="input-group-text bg-body border-start-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                                            <path
                                                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="col-2">
                                                <button class="btn-close align-middle"
                                                    v-on:click="removeItemFromCart(item.productId)"></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </li>

                <li v-show="cartHasItems()">
                    <hr class="dropdown-divider">
                </li>

                <li v-show="cartHasItems()">
                    <div class="d-flex d-grid gap-2 col-8 mx-auto justify-content-center" v-on:click="checkoutCart()">
                        <button class="btn btn-outline-secondary">
                            Complete order
                        </button>
                    </div>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCartStore } from '../store/CartStore';
import { useUserStore } from '../store/UserStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const cartStore = useCartStore();
const cart = storeToRefs(cartStore).cart

function addQuantity(productId: string): void {
    cartStore.addQuantity(productId)
}

function removeQuantity(productId: string): void {
    cartStore.removeQuantity(productId)
}

function removeItemFromCart(productId: string): void {
    cartStore.removeItem(productId)
}

async function checkoutCart(): Promise<void> {
    cartStore.clear()
}

function cartHasItems(): boolean {
    return cart.value.items.length > 0
}

onMounted(async () => {
    if (userStore.hasUser) {
        cart.value = cartStore.cart
    }
})
</script>
