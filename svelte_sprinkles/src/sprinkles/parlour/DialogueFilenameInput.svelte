<script lang="ts">
  export let value: string;

  function onKeyDown(e: KeyboardEvent & { currentTarget: HTMLElement }) {
    if (e.key.indexOf('Enter') >= 0) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }

  function stripHtml(e: Event & { currentTarget: HTMLElement }) {
    let target = e.currentTarget;
    setTimeout(() => {
      if (target.innerHTML !== target.textContent) {
        target.innerHTML = target.textContent ?? 'unnamed';
      }
    })
  }

  function save(e: Event & { currentTarget: HTMLElement }) {
    if (e.currentTarget.textContent?.length) {
      value = e.currentTarget.textContent;
    } else {
      value = 'unnamed';
    }
    e.currentTarget.textContent = value;
  }
</script>

<span
  id="dialogue-filename"
  contenteditable="true"
  role="textbox"
  tabindex="0"
  on:keydown={onKeyDown}
  on:beforeinput={stripHtml}
  on:blur={save}
>{value}</span>
