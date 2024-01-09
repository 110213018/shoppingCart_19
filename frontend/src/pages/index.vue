<template>
  <LoginForm v-if="store.token === null"/>
  <Buyer v-if="store.token !== null && store.user.role === 1"/>
  <Sale v-if="store.token !== null && store.user.role === 2"/>
  <Logistics v-if="store.token !== null && store.user.role === 3"/>
</template>

<script setup>
import { useAuthStore } from '@/store/app';

const store = useAuthStore();
</script>
