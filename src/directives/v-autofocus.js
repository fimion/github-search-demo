/**
 * A directive that can be used in Vue to automatically apply focus to an element
 *
 * @name Autofocus
 * @example
 * <template>
 *   <input type="text" v-autofocus />
 * </template>
 * <script>
 *   import Autofocus from '../directives/v-autofocus';
 *   export default {
 *     directives:[Autofocus]
 *   }
 * </script>
 */
const Autofocus = {
  /**
   * causes the element to be focused when inserted into the DOM
   *
   * @param {HTMLElement} el - the element v-autofocus is applied to
   */
  mounted(el){
    el.focus()
  }
};

export default Autofocus;
