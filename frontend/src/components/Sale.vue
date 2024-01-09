<template>
  <v-container>
    <v-card class="mb-5">
      <v-card-title>
        <h1>Products</h1>
      </v-card-title>
      <v-card-text>
        <v-table>
          <tbody>
            <tr v-for="product in products" :key="product._id">
              <td>
                <v-text-field v-model="product.name" label="Name"></v-text-field>
              </td>
              <td>
                <v-text-field v-model="product.intro" label="Intro"></v-text-field>
              </td>
              <td>
                <v-text-field v-model="product.price" label="Price"></v-text-field>
              </td>
              <td>
                <v-text-field v-model="product.stock" label="Stock"></v-text-field>
              </td>
              <td>
                <v-btn color="primary"
                  @click="updateProductContent(product._id, product.name, product.intro, product.price, product.stock)">Update</v-btn>
                <v-btn color="primary" @click="deleteProductContent(product._id)">Delete</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
    <v-card class="mb-5">
      <v-card-title>
        <h1>Add a Product</h1>
      </v-card-title>
      <v-card-text>
        <v-table>
          <tbody>
            <tr>
              <td>
                <v-text-field v-model="newProduct.name" label="Name"></v-text-field>
              </td>
              <td>
                <v-text-field v-model="newProduct.intro" label="Intro"></v-text-field>
              </td>
              <td>
                <v-text-field v-model="newProduct.price" label="Price"></v-text-field>
              </td>
              <td>
                <v-text-field v-model="newProduct.stock" label="Stock"></v-text-field>
              </td>
              <td>
                <v-btn color="primary"
                  @click="addNewProduct(newProduct.name, newProduct.intro, newProduct.price, newProduct.stock)">Add</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
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
              <td>{{ order.buyer }}</td>
              <td>{{ status[order.status] }}</td>
              <td>
                <v-rating v-model="order.review" color="orange-lighten-1" active-color="blue" readonly></v-rating>
              </td>
              <td>
                <v-btn color="primary" @click="updateStatus(order._id, 1)">Processing</v-btn>
                <v-btn color="primary" @click="updateStatus(order._id, 2)">To Logistics</v-btn>
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

import { getProductsBySId, updateProduct, deleteProduct, addProduct, updateOrderStatus, getOrders } from '@/api';
import { useAuthStore } from '@/store/app';

const store = useAuthStore();
const token = store.token;
const sid = store.user.id;
let products = ref([]);
let orders = ref([]);
let newProduct = ref({
  name: "",
  intro: "",
  price: 0,
  stock: 0,
});
const ordersHeaders = ref([
  { title: 'Products', value: 'name' },
  { title: 'Buyer', value: 'buyer' },
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

async function addNewProduct(name, intro, price, stock) {
  await addProduct(token, name, intro, price, stock);
  products.value = await getProductsBySId(sid);
}

async function updateProductContent(id, name, intro, price, stock) {
  await updateProduct(token, id, name, intro, price, stock);
  products.value = await getProductsBySId(sid);
}

async function deleteProductContent(id) {
  await deleteProduct(token, id);
  products.value = await getProductsBySId(sid);
}

async function updateStatus(id, status) {
  await updateOrderStatus(token, id, status);
  orders.value = await getOrders(token);
}

onMounted(async () => {
  products.value = await getProductsBySId(sid);
  orders.value = await getOrders(token);
});
</script>
