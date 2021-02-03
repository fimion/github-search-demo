<template>
  <SearchBar v-model:query="query" @submit="flush"/>
  <pre>{{results}}</pre>
</template>
<script>
import SearchBar from "./components/SearchBar.vue";
import useDebouncedFetch from "./features/useDebouncedFetch.js";
import {computed, ref, unref} from 'vue'
export default {
  components: {SearchBar},
  setup(){
    const query = ref('');

    const url = computed(()=>'https://api.github.com/search/users?q='+encodeURIComponent(unref(query)));

    const {results, flush, error} = useDebouncedFetch(url);

    return {
      query,
      results,
      flush,
      error,
    };
  }
}
</script>

<style>

</style>
