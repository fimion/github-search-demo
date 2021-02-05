<template>
  <form v-bind="$attrs" @submit.prevent="$emit('submit', query)">
    <label for="SearchBar">Search:</label>
    <input type="text" name="search" id="SearchBar" v-model="query" v-autofocus />
    <button>Go</button>
  </form>
</template>
<script>
import {ref, defineComponent} from 'vue';
import Autofocus from "../directives/v-autofocus.js"
export default defineComponent({
  name: "SearchBar",
  directives:{Autofocus},
  emits:{
    'submit':{
      type: String,
    }
  },
  setup(){
    const query = ref('')
    return {
      query,
    }
  }
});
</script>

<style scoped>

</style>
