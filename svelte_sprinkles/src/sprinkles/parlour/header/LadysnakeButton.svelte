<script lang="ts">
  export let href: string;
</script>

<a href={href} title="Home">
  <img class="ladysnake-logo-small" src="/img/ladysnake-icon-dark.png" alt="Ladysnake Logo" width="200" height="200"/>
</a>

<style>
  a {
    height: var(--button-size);
    width: var(--button-size);
    display: inline-block;
    vertical-align: middle;
  }

  img {
    width: auto;
    height: 100%;
  }
</style>
