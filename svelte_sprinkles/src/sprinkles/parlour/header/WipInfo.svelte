<div class="wip">
  <button class="trigger">🚧</button>
  <div class="tooltip">
    <div class="admonition admonition-warning">
      <strong class="admonition-heading">🚧 This page is still under construction!</strong>
      <span>Illustrations (added in Blabber 1.5) are not yet available in this editor.</span>
    </div>
  </div>
</div>

<style>
  .wip {
    position: relative;
    background: padding-box color-mix(in srgb, var(--color-warning), transparent 90%);
    height: 100%;
    flex-basis: 2.6em;
    padding-right: 1em;
    flex-grow: 0;
    margin: 0;
  }

  .trigger {
    align-self: start;
    font-size: 30px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    outline: none;
  }

  .tooltip {
    visibility: hidden;
    position: absolute;
    top: 100%;
    left: 0;
    width: 60vw;
    background-color: var(--base-background-color);
  }
  .wip:focus-within {
    outline: auto;
  }
  .wip:hover .tooltip, .wip:focus-within .tooltip {
    visibility: visible;
  }
</style>