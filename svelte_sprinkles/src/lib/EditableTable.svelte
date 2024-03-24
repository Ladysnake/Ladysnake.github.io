<script context="module" lang="ts">
  function shiftElementBackward<E>(arr: E[], index: number) {
    if (index <= 0) throw Error('Cannot shift backward the first element of an array');
    const ret = [...arr];
    ret[index] = arr[index - 1];
    ret[index - 1] = arr[index];
    return ret;
  }
  function shiftElementForward<E>(arr: E[], index: number) {
    if ((index + 1) >= arr.length) throw Error('Cannot shift forward the last element of an array');
    const ret = [...arr];
    ret[index] = arr[index + 1];
    ret[index + 1] = arr[index];
    return ret;
  }

  function deleteElement<E>(arr: E[], index: number) {
    if (index < 0 || index >= arr.length) throw Error('Invalid index ' + index + ' for array ' + JSON.stringify(arr));
    const ret = [...arr];
    ret.splice(index, 1);
    return ret;
  }
</script>
<script lang="ts" generics="T">
  import type {Writable} from "svelte/store";

  export let items: Writable<T[]>;

  function moveUp(index: number) {
    $items = shiftElementBackward($items, index);
  }

  function moveDown(index: number) {
    $items = shiftElementForward($items, index);
  }

  function deleteRow(index: number) {
    $items = deleteElement($items, index);
  }
</script>
<div class="table-editable">
  <table>
    <thead>
    <tr>
      <th>Text</th>
      <th class="table-buttons">Next State</th>
      <th class="table-buttons">Sort</th>
      <th class="table-buttons">Remove</th>
    </tr>
    </thead>
    <tbody>
    {#each $items as item, index}
      <tr>
        <slot item={item} index={index}/>
        <td class="table-buttons">
          <span class="table-up"><button disabled={index === 0} on:click={() => moveUp(index)}>🔼</button></span>
          <span class="table-down"><button disabled={index + 1 >= $items.length} on:click={() => moveDown(index)}>🔽</button></span>
        </td>
        <td class="table-buttons">
          <span class="table-remove"><button type="button" on:click={() => deleteRow(index)}>❌</button></span>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>
