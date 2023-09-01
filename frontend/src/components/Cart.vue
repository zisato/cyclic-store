<template>
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 ms-lg-4">
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="cartNavbarDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="bi-cart-fill me-1"></i>
                Cart
                <span class="badge bg-dark text-white ms-1 rounded-pill">
                    {{ cart.items.length }}
                </span>
            </a>

            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cartNavbarDropdown">
                <li>
                    <span class="dropdown-item">
                        <div class="container">
                            <div class="row">
                                <div class="col">
                                    <table>
                                        <tbody>
                                            <tr v-for="item in cart.items ">
                                                <td class="pe-2">
                                                    <!-- <img v-bind:src="imageSrc(item.image)" alt="" /> -->
                                                </td>
                                                <td class="pe-4">
                                                    <span class="text-black">{{ item.name }}</span>
                                                    <br />
                                                    <span class="text-muted">Quantity: {{ item.quantity }}</span>
                                                </td>
                                                <td>
                                                    <button class="btn-close"
                                                        v-on:click="removeItemFromCart(item.productId)"></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </span>
                </li>

                <li v-show="cartHasItems()">
                    <hr class="dropdown-divider">
                </li>

                <li v-show="cartHasItems()">
                    <div class="d-flex d-grid gap-2 col-8 mx-auto" v-on:click="checkoutCart()">
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
