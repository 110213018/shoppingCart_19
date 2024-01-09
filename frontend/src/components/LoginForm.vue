<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field v-model="username" label="Username" prepend-icon="mdi-account" type="text"></v-text-field>
              <v-text-field v-model="password" id="password" label="Password" prepend-icon="mdi-lock" type="password"></v-text-field>
              <v-select v-model="role" :items="roles" label="Role" prepend-icon="mdi-account-switch"></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login">Login</v-btn>
            <v-btn color="secondary" @click="register">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/app';

let username = ref('');
let password = ref('');
let role = ref('');
let roles = ref([1, 2, 3]);

const store = useAuthStore();

async function login() {
  await store.login(username.value, password.value);
}

async function register() {
  await store.register(username.value, password.value, role.value);
}
</script>
