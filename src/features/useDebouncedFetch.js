import {ref, unref, toRefs, watch, computed} from 'vue';
import debounce from 'lodash.debounce';

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

  const fetchCall = debounce(async (url, options)=>{
    try {
      const response = await fetch(url, options);
      if(response.ok){
        error.value = null;
        results.value = await response.json();
      }else{
        results.value = {};
        error.value = {
          status: response.status,
          statusText: response.statusText,
          body: await response.json(),
        }
      }

    } catch (e) {
      results.value = {};
      error.value = {
        status: 0,
        statusText: 'InternalError',
        body: e.toString(),
      }
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

