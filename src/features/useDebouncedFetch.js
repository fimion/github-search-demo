import {ref, unref, toRefs, watch, computed} from 'vue';
import debounce from 'lodash.debounce';
import fetchWrapper from "../utils/fetchWrapper.js"

/**
 * @typedef {import('@vue/reactivity').Ref} Ref
 */

/**
 * @typedef {object} ResultsObject
 * @property {Ref<object>} results - a reference to the current results of the api call
 * @property {function} flush - a way to trigger the debounced call immediately
 * @property {function} cancel - a way to cancel the debounced function call.
 */

/**
 * creates a debounced fetch call that stores the results in a ref
 *
 * @param {Ref<string>|string} url
 * @param {Ref<object>|object} [options={}]
 * @return {ResultsObject}
 */
export default function useDebouncedFetch(url, options= ref({})){
  const results = ref({});
  const error = ref(null);

  const delay = computed(()=>(toRefs(unref(options))?.delay || 500))
  const opts = computed(()=>{
    const {delay, ...opts} = toRefs(unref(options));
    return opts;
  })

  const fetchCall = debounce(async (url,options)=>{
    try {
      results.value =  await fetchWrapper(url, options);
      error.value = null;
    }catch (e) {
      error.value = e;
      results.value = {};
    }
  }, unref(delay))

  watch([url, opts],([url, opts])=> {
    fetchCall(unref(url), unref(opts))
  });

  return {
    results,
    error,
    flush: fetchCall.flush,
    cancel: fetchCall.cancel,
  }

}

