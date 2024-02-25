<script>
import axios from 'axios'
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3500/auth/login', {
          username: this.username,
          password: this.password
        })
        const token = response.data.data.token
        console.log(token)
        this.setAuthToken(token)
        this.$router.push('/list')
      } catch (error) {
        console.error('Error logging in:', error.response.data.message)
      }
    },
    setAuthToken(token) {
      Cookies.set('jwt_token', token, { expires: 1 })
    }
  }
}
</script>

<template>
  <div
    class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
  >
    <form @submit.prevent="login" class="space-y-6">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Login</h5>
      <div>
        <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Username</label
        >
        <input
          type="username"
          name="username"
          id="username"
          v-model="username"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="Masukkan Username"
          required
        />
      </div>
      <div>
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Password</label
        >
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          placeholder="Masukkan Password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Sign In
      </button>
    </form>
  </div>
</template>
