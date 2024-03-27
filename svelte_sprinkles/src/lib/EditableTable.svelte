<script context="module" lang="ts">
  import type {Readable} from "svelte/store";

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

  export type KeyExtractor<T> = (item: T, index: number) => unknown;
</script>
<script lang="ts" generics="T">
  import type {Writable} from "svelte/store";
  import {afterUpdate, beforeUpdate} from "svelte";

  export let items: Writable<T[]>;
  export let keyExtractor: KeyExtractor<T>;

  function moveUp(index: number) {
    $items = shiftElementBackward($items, index);
  }

  function moveDown(index: number) {
    $items = shiftElementForward($items, index);
  }

  function deleteRow(index: number) {
    $items = deleteElement($items, index);
  }

  let table: HTMLTableElement;

  // Ensures focus is preserved when swapping table rows
  let activeElement: HTMLElement | null;

  beforeUpdate(() => {
    activeElement = document.activeElement as HTMLElement | null;
  });

  afterUpdate(() => {
    if (activeElement && table.contains(activeElement)) {
      if ((activeElement as any).disabled) {
        if (activeElement.classList.contains('sort-up')) {
          (activeElement.parentElement?.querySelector('.sort-down') as HTMLElement)?.focus();
        } else if (activeElement.classList.contains('sort-down')) {
          (activeElement.parentElement?.querySelector('.sort-up') as HTMLElement)?.focus();
        }
      } else {
        activeElement.focus();
      }
    }
    activeElement = null;
  });
</script>
<div class="table-editable">
  <table bind:this={table}>
    <thead>
    <tr>
      <slot name="head"/>
      <th class="col-sort">Sort</th>
      <th class="col-remove">Remove</th>
    </tr>
    </thead>
    <tbody>
    {#each $items as item, index (keyExtractor?.(item, index) ?? index)}
      <tr>
        <slot name="row" item={item} index={index}/>
        <td class="col-sort">
          <button class="sort-up" disabled={index === 0} on:click={() => moveUp(index)}><svg inline-src="octicon-arrow-up"/></button>
          <button class="sort-down" disabled={index + 1 >= $items.length} on:click={() => moveDown(index)}><svg inline-src="octicon-arrow-down"/></button>
        </td>
        <td class="col-remove">
            <button type="button" on:click={() => deleteRow(index)}>
            <svg inline-src="octicon-x"/>
          </button>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>
<style>
  table {
    width: 100%;
  }
</style>
