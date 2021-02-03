<template>
  <form v-bind="$attrs" @submit.prevent="$emit('submit', $event)">
    <label for="SearchBar">Search:</label>
    <input type="text" name="search" id="SearchBar" v-model="query"/>
    <button>Go</button>
  </form>
</template>
<script>
import {computed, unref} from 'vue';

export default {
  name: "SearchBar",
  props:{
    query:{
      type:String,
      required: true,
    },
  },
  emits:{
    'update:query':{
      type: String,
    },
    'submit':{
      type: Event,
    }
  },
  setup(props, {emit}){
    const query = computed({ get:()=>unref(props.query),set:(v)=>emit('update:query', v)})
    return {
      query,
    }
  }
}
</script>

<style scoped>

</style>
