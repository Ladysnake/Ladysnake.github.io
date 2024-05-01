<script lang="ts">
  export let danger = false;

  let dialog: HTMLDialogElement;
  let arg: any | undefined = undefined;
  let sendResult: (result: boolean) => void = () => {};
  let failPrevious: (reason: string) => void = () => {};

  export async function confirm(dialogArg: any) {
    return new Promise<boolean>((resolve, reject) => {
      failPrevious('A new dialog opened without closing the old one');
      sendResult = resolve;
      failPrevious = reject;
      arg = dialogArg;
      dialog.showModal();
    }).finally(() => {
      // ensure arg can be garbage-collected after settlement
      arg = undefined;
      sendResult = () => {};
      failPrevious = () => {};
    });
  }
</script>

<dialog bind:this={dialog} on:close={() => sendResult(false)} class:dialog-danger={danger}>
  <form class="dialog-form" method="dialog" on:submit={() => sendResult(true)}>
    {#if arg !== undefined}
      <slot arg={arg}/>
    {/if}
    <div class="dialog-exit">
      <button class="btn btn-default" on:click|preventDefault={() => dialog.close()}>Cancel</button>
      <button class="btn {danger ? 'btn-danger' : 'btn-info'}">Confirm</button>
    </div>
  </form>
</dialog>

<style>
</style>
