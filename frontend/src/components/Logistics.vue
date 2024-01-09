<template>
  <v-container>
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
                <v-btn color="primary" @click="updateStatus(order._id, 3)">Delivering</v-btn>
                <v-btn color="primary" @click="updateStatus(order._id, 4)">Finish</v-btn>
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

import { updateOrderStatus, getOrders } from '@/api';
import { useAuthStore } from '@/store/app';

const store = useAuthStore();
const token = store.token;
let orders = ref([]);
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

async function updateStatus(id, status) {
  await updateOrderStatus(token, id, status);
  orders.value = await getOrders(token);
}

onMounted(async () => {
  orders.value = await getOrders(token);
});
</script>
