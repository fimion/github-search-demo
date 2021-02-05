<template>
  <div class="githubcities">
    <h1>GitHubCities</h1>
    <SearchBar @submit="triggerQuery"/>
    <template v-if="status === FETCH_STATUS.RESOLVED">
      <h2>Results ({{ results.userCount }})</h2>
      <ul class="user-list">
        <li class="user" v-for="user in results.users"
            :key="user.id">
          <a class="user-box"
             :href="user.url">
            <img class="avatar"
                 :src="user.avatarUrl"
                 :alt="`avatar for ${user.name}`">
            {{ user.name }} (@{{ user.login }})
          </a>
        </li>
      </ul>
    </template>
    <template v-if="status===FETCH_STATUS.ERROR">
      <h2>Oh no! :(</h2>
      <pre>
    {{ results }}
    </pre>
    </template>
  </div>
</template>
<script>
import SearchBar from "./components/SearchBar.vue"
import fetchWrapper from "./utils/fetchWrapper.js"
import {computed, ref, reactive, defineComponent} from 'vue'

/**
 * @typedef {import('@vue/reactivity').Ref} Ref
 * @typedef {import('@vue/reactivity').UnwrapRef} UnwrapRef
 */

const FETCH_STATUS = Object.freeze({
  READY: 'READY',
  LOADING: 'LOADING',
  RESOLVED: 'RESOLVED',
  ERROR: 'ERROR',
})


export default defineComponent({
  components: {SearchBar},
  setup() {
    const query = ref('')
    const status = ref(FETCH_STATUS.READY)
    const results = ref({})
    const cursor = ref(null)


    const searchUrl = computed(() => {
      const q = encodeURIComponent(query.value)
      const cur = cursor.value ? `&cursor=${cursor.value}` : ''
      return `/api/search?q=${q}${cur}`
    })


    const callSearch = async () => {
      try {
        results.value = await fetchWrapper(searchUrl.value)
        status.value = FETCH_STATUS.RESOLVED
      } catch (e) {
        status.value = FETCH_STATUS.ERROR
        results.value = e
      }
      return results
    }
    /**
     *
     * @param {string} q
     * @returns {Promise<Ref<UnwrapRef<Object>>>}
     */
    const triggerQuery = async (q) => {
      if (q !== '') {
        cursor.value = null
        status.value = FETCH_STATUS.LOADING
        query.value = q
        return await callSearch()
      }
    }

    const changePage = async (cur) => {
      cursor.value = cur
      return await callSearch()
    }


    return {
      query,
      results,
      status,
      changePage,
      triggerQuery,
      FETCH_STATUS,
    }
  },
})
</script>

<style>

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Pangolin', cursive;
}

:root {
  --min-user-width: 100px;
}

.githubcities{
  display:flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.user-list {
  display: grid;
  max-width: 100%;
  grid-gap: 10px;
  grid-template-columns: minmax(var(--min-user-width), auto) minmax(var(--min-user-width), auto) minmax(var(--min-user-width), auto);
}

.user {
  display: inline-block;
  margin: 10px;
}

.user-box {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  border: indigo 5px inset;

}

.avatar {
  max-width: var(--min-user-width);
  border-radius: 50%;
  border: seagreen 5px solid;
}
</style>
