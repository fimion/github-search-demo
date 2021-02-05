<template>
  <div class="page-buttons">
    <button @click="$emit('next', pageInfo.startCursor)"
            :disabled="!pageInfo.hasPreviousPage">
      Previous
    </button>
    <button @click="$emit('next', pageInfo.endCursor)"
            :disabled="!pageInfo.hasNextPage">
      Next
    </button>
  </div>
</template>

<script>
import {toRefs} from 'vue';
export default {
  name: "PageButtons",
  props:{
    /**
     * @type {Object}
     * @property {string} endCursor
     * @property {boolean} hasNextPage
     * @property {boolean} hasPreviousPage
     * @property {string} startCursor
     */
    pageInfo:{
      type:Object,
      required:true,
    },
  },
  emits:{
    next:{
      type:String,
    }
  },
}
</script>

<style scoped>
  .page-buttons{
    min-width:100%;
    display:flex;
    flex-flow: row nowrap;
    justify-content: space-around;
  }
  .page-buttons button{
    font-size: 2em;
  }
</style>
