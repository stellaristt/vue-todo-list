<script setup>
import { onMounted, ref } from 'vue'
import { useListStore } from '../stores/list'
import axios from 'axios';
import Cookies from 'js-cookie';

const store = useListStore()
const title = ref('')
const description = ref('')
const data = ref({})
const loading = ref(false)

const handleDelete = (id) => {
  store.deleteItem(id)
}

const handleSubmit = async () => {
  const data = { title: title.value, description: description.value, category: "A" };
  await store.addItem(data);
  clearForm();
};

const clearForm = () => {
  title.value = '';
  description.value = '';
};

onMounted(async () => {
  await store.fetchList();
});

const getItem = (id) => {
  data.value = store.showItemById(id)

  title.value = data.value.title
  description.value = data.value.description
}

const handleUpdate = (id) => {
  let data = {
    title: title.value,
    description: description.value
  }
  store.updateItem(id, data)
  clearForm()
}

const handleCheckboxChange = async (item) => {
  try {
    const token = Cookies.get('jwt_token');
    const updatedItem = { ...item, completed: !item.completed }
    await axios.put(`http://localhost:3500/api/todo/${item.id}`, updatedItem, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
    store.updateItem(item.id, updatedItem)
  } catch (error) {
    console.error('Error updating completed status:', error)
  }
}
</script>

<template>
  <main>
    <h1 class="text-3xl font-bold">To Do List!</h1>

    <div class="mt-6">
      <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Title</label
      >
      <input
        v-model="title"
        type="title"
        id="title"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="title"
        required
      />
    </div>
    <div class="mt-6">
      <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Description</label
      >
      <input
        v-model="description"
        type="description"
        id="description"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Description"
        required
      />
    </div>

    <div class="mt-6">
      <button
        @click="handleSubmit"
        v-if="Object.keys(data).length === 0"
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Submit
      </button>
      <button
        @click="handleUpdate(data.id)"
        v-else
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Update
      </button>
    </div>

    <h5 class="font-bold text-2xl mt-6 mb-3">Tasks</h5>
    <div class="flex flex-col">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div v-if="loading" class="mt-4">Loading...</div>
        <table
          v-else
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Title</th>
              <th scope="col" class="px-6 py-3">Description</th>
              <th scope="col" class="px-6 py-3">Completed</th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in store.list" :key="item.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td class="px-6 py-4">{{ item.title }}</td>
              <td class="px-6 py-4">{{ item.description }}</td>
              <td class="px-6 py-4">
                <input :checked="item.completed === true" id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" @change="handleCheckboxChange(item)">
              </td>
              <td class="px-6 py-4 text-right">
                <p
                  @click="getItem(item.id)"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </p>
                <p
                  @click="handleDelete(item.id)"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Delete
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<style></style>
