import { defineStore } from 'pinia';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useListStore = defineStore('list', {
  state: () => ({
    list: [],
  }),

  actions: {
    async fetchList() {
      try {
        const token = Cookies.get('jwt_token');
        const response = await axios.get('http://localhost:3500/api/todo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        this.setList(response.data.data);
      } catch (error) {
        console.error('Failed to fetch list:', error);
      }
    },
    
    async addItem(data) {
      try {
        const token = Cookies.get('jwt_token');
        await axios.post('http://localhost:3500/api/todo', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.addToList(data);
      } catch (error) {
        console.error('Failed to add item:', error);
      }
    },
    
    async updateItem(id, data) {
      try {
        const token = Cookies.get('jwt_token');
        await axios.put(`http://localhost:3500/api/todo/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.updateList(id, data);
      } catch (error) {
        console.error('Failed to update item:', error);
      }
    },
    
    async deleteItem(id) {
      try {
        const token = Cookies.get('jwt_token');
        await axios.delete(`http://localhost:3500/api/todo/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.removeFromList(id);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    },

    showItemById(id){
      return this.list.find(item => item.id === id);
  },

    setList(data) {
      this.list = data;
    },

    addToList(item) {
      let id = this.list.length + 1
      let data = {
        id: id++,
        title: item.title,
        description: item.description
      }
      this.list.push(data);
    },

    updateList(id, newData) {
      const index = this.list.findIndex(item => item.id === id);
      if (index !== -1) {
        this.list[index] = { ...this.list[index], ...newData };
      }
    },

    removeFromList(id) {
      this.list = this.list.filter(item => item.id !== id);
    },
  },
});
