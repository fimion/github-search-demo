<template>
  <form v-bind="$attrs" @submit.prevent="$emit('submit', query)">
    <label :for="id">Search:</label>
    <input type="text"
           name="search"
           :id="id"
           v-model="query"
           v-autofocus/>
    <button>Go</button>
  </form>
</template>
<script>
import {ref, defineComponent} from 'vue'
import Autofocus from "../directives/v-autofocus.js"

let ID_COUNTER = 0
export default defineComponent({
  name: "SearchBar",
  directives: {Autofocus},
  emits: {
    'submit': {
      type: String,
    },
  },
  setup() {
    const query = ref('')
    const id = `SearchBar-${ID_COUNTER}`
    ID_COUNTER++
    return {
      query,
      id,
    }
  },
})
</script>

<style scoped>

</style>
