<template>
  <div class="githubcities">
    <h1>
      GitHubCities
    </h1>
    <div>More GeoCities for your GitHub</div>
    <SearchBar @submit="triggerQuery"/>
    <template v-if="status === FETCH_STATUS.RESOLVED">
      <h2>Results ({{ results.userCount }})</h2>
      <page-buttons @next="changePage" :page-info="results.pageInfo"/>
      <ul class="user-list">
        <li class="user" v-for="user in users"
            :key="user.id">
          <div class="follows">
            <span v-if="user.following">Following: {{user.following.totalCount}}</span>
            <span v-if="user.followers">Followers: {{user.followers.totalCount}}</span>
          </div>
          <a class="user-box"
             :href="user.url">
            <img v-if="user.avatarUrl" class="avatar"
                 :src="user.avatarUrl"
                 :alt="`avatar for ${user.name}`">
            {{ user.name }} (@{{ user.login }})
          </a>
          <p>{{user.bio}}</p>
          <p v-if="user.status">Status: {{user.status.message}}</p>
        </li>
      </ul>
      <page-buttons @next="changePage" :page-info="results.pageInfo"/>
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
import PageButtons from "./components/PageButtons.vue"
import fetchWrapper from "./utils/fetchWrapper.js"
import {computed, ref, toRefs, defineComponent} from 'vue'

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
  components: {SearchBar,PageButtons},
  setup() {
    const query = ref('')
    const status = ref(FETCH_STATUS.READY)
    const results = ref({})
    const cursor = ref(null)


    const searchUrl = computed(() => {
      const q = encodeURIComponent(query.value)
      const cur = cursor.value ? `&${cursor.value}` : ''
      return `/api/search?q=${q}${cur}`
    })

    const users = computed(()=>(results.value?.users || []).filter((e)=>!!e.id));


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
      if(cur === results.value?.pageInfo.endCursor){
        cursor.value = 'next';
      }
      if(cur === results.value?.pageInfo.startCursor){
        cursor.value = 'prev';
      }
      if(cursor.value){
        cursor.value += '='+cur
      }
      await callSearch();
      window.scrollTo({top:0});
    }


    return {
      query,
      results,
      status,
      changePage,
      triggerQuery,
      FETCH_STATUS,
      users
    }
  },
})
</script>

<style>



:root {
  --min-user-width: 150px;
  --text-color:darkblue;
  --background-color:hotpink;
  color:var(--text-color);
  background-color:var(--background-color);
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Pangolin', cursive;
}

a, a:link, a:visited, a:hover, a:active, a:focus{
  color: var(--text-color);
}

.githubcities{
  display:flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.user-list {
  display: grid;
  min-width: 100vw;
  grid-gap: 10px;
  grid-template-columns: minmax(var(--min-user-width), auto);
}

.user {
  --text-color: darkorchid;
  display: inline-block;
  margin: 10px;
  border: royalblue 5px groove;
  background-color:aqua;
  color:var(--text-color)
}


.user>p{
  text-align: center;
}
.follows{
  display:flex;
  flex-flow: row nowrap;
  justify-content: space-around;
}
.user-box {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.avatar {
  max-width: var(--min-user-width);
  border-radius: 50%;
  border: darkblue 5px solid;
}
@media screen and (min-width: 480px){
  .user-list{
    grid-template-columns: minmax(var(--min-user-width), auto) minmax(var(--min-user-width), auto);
  }
}

@media screen and (min-width: 768px){
  .user-list{
    grid-template-columns: minmax(var(--min-user-width), 1fr) minmax(var(--min-user-width), 1fr) minmax(var(--min-user-width), 1fr);
  }
}

</style>
