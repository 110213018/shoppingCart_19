<template>
  <v-container>
    <v-card class="mb-5">
      <v-card-title>
        <h1>Products</h1>
      </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th v-for="header in productsHeaders" :key="header.value">
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product._id">
              <td>{{ product.name }}</td>
              <td>{{ product.intro }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.stock }}</td>
              <td>{{ product.seller }}</td>
              <td>
                {{ product.quantity }}
              </td>
              <td>
                <v-btn color="secondary" @click="product.quantity++">+</v-btn>
                <v-btn color="secondary" @click="product.quantity--" v-if="product.quantity !== 0">-</v-btn>
                <v-btn color="primary" @click="addProductToCart(product._id, product.quantity)">Add To Cart</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
    <v-card class="mb-5">
      <v-card-title>
        <h1>Cart</h1>
      </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th v-for="header in cartHeaders" :key="header.value">
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in cart" :key="product._id">
              <td>{{ product.pid }}</td>
              <td>{{ product.quantity }}</td>
              <td>
                <v-btn color="primary" @click="deleteProductFromCart(product._id)">Remove From Cart</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-text>
        <v-btn color="primary" @click="checkout()">Checkout</v-btn>
      </v-card-text>
    </v-card>
    <v-card class="mb-5">
      <v-card-title>
        <h1>Orders</h1>
      </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th v-for="header in ordersHeaders" :key="header.value">
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td>
                <v-chip-group>
                  <v-chip v-for="p in order.products" :key="p.id">{{ `${p.name} * ${p.quantity}` }}</v-chip>
                </v-chip-group>
              </td>
              <td>{{ order.seller }}</td>
              <td>{{ status[order.status] }}</td>
              <td>
                <v-rating v-model="order.review" color="orange-lighten-1" active-color="blue"></v-rating>
              </td>
              <td>
                <v-btn color="primary" @click="updateReview(order._id, order.review)">Update Review</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { getProducts, getCart, deleteFromCart, addToCart, cleanCart, createOrders, getOrders, updateOrderReview } from '@/api';
import { useAuthStore } from '@/store/app';

const store = useAuthStore();
const token = store.token;
let products = ref([]);
let cart = ref([]);
let orders = ref([]);
const productsHeaders = ref([
  { title: 'Name', value: 'name' },
  { title: 'Intro', value: 'intro' },
  { title: 'Price', value: 'price' },
  { title: 'Stock', value: 'stock' },
  { title: 'Seller', value: 'seller' },
  { title: 'Quantity', value: 'quantity' },
  { title: 'Actions', value: 'actions' },
]);
const cartHeaders = ref([
  { title: 'Name', value: 'name' },
  { title: 'Quantity', value: 'quantity' },
  { title: 'Actions', value: 'actions' },
]);
const ordersHeaders = ref([
  { title: 'Products', value: 'name' },
  { title: 'Seller', value: 'seller' },
  { title: 'Status', value: 'status' },
  { title: 'Review', value: 'Review' },
  { title: 'Actions', value: 'actions' },
]);
const status = ref([
  'Pending',
  'Processing',
  'To Logistics',
  'To Customer',
  'Done',
]);

async function addProductToCart(id, quantity) {
  await addToCart(token, id, quantity);
  cart.value = await getCart(token);
}

async function deleteProductFromCart(id) {
  await deleteFromCart(token, id);
  cart.value = await getCart(token);
}

async function checkout() {
  const c = await getCart(token);
  await createOrders(token, c);
  await cleanCart(token);
  products.value = await getProducts();
  for (const product of products.value) {
    product.quantity = 0;
  }
  cart.value = await getCart(token);
  orders.value = await getOrders(token);
}

async function updateReview(id, review) {
  await updateOrderReview(token, id, review);
  orders.value = await getOrders(token);
}

onMounted(async () => {
  products.value = await getProducts();
  for (const product of products.value) {
    product.quantity = 0;
  }
  cart.value = await getCart(token);
  orders.value = await getOrders(token);
});
</script>
