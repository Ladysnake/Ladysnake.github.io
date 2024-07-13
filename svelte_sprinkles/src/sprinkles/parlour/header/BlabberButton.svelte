<script lang="ts">
  export let href: string;
</script>

<a href={href} title="Blabber Documentation">
  <img src="/img/blabber.png" alt="Blabber Logo" width="400" height="400"/>
</a>

<style>
  a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: var(--button-size);
    width: var(--button-size);
  }
  img {
    height: 70%;
    border-radius: 5px;
    width: auto;
  }
</style>
