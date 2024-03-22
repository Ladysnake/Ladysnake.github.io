<div id="dialogue-import-export" class:landingPage>
  <input id="dialogue-import" type="file" accept="application/json"/>
  <label class="btn btn-info" for="dialogue-import">
    <span class="icon"><OcticonUpload/></span>
    Import JSON dialogue file
  </label>
  <i>Or drop a dialogue file in this area to import</i>
  <div class="drop-zone">
    <span class="icon"><OcticonUpload/></span>
    Drop a dialogue file <strong class="drop-zone">here</strong> to import
  </div>
  <p class="dialogue-io-log info-log">{info}</p>
  <p class="dialogue-io-log warning-log">{warning}</p>
  <p class="dialogue-io-log error-log">{error}</p>
</div>

<script lang="ts">
  import OcticonUpload from "../../../assets/OcticonUpload.svelte";

  let info: string = '';
  let warning: string = '';
  let error: string = '';

  export let landingPage = false;
</script>

<style>
  #dialogue-import-export.landingPage {
    outline: none;
    border: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #dialogue-import-export {
    position: relative;
    display: flex;
    justify-content: space-around;
    padding: 1rem;
    background-color: var(--base-background-color);
    border-top: 1px solid var(--button-outline);
    outline: 2px solid var(--base-background-color);
  }

  .icon {
    margin-right: 1rem;
  }

  div.drop-zone {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 80%;
    visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--button-background);
    font-weight: bold;
    font-size: large;

    &.hovered {
      color: var(--button-selected-outline);
    }

    &.active {
      visibility: visible;
    }

    & strong {
      margin: 0 0.5rem 0 0.5rem;
      font-weight: bolder;
      font-size: larger;

      &::before {
        content: '>';
        margin-right: 0.3rem;
      }

      &::after {
        content: '<';
        margin-left: 0.3rem;
      }
    }
  }

  #dialogue-import {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;

    & + label {
      display: flex;
      align-items: center;
    }
  }

  .dialogue-io-log {
    text-align: center;
    font-weight: bold;
    width: 100%;
    margin: 0;
  }

  .error-log {
    background-color: var(--color-invalid);
  }

  .warning-log {
    background-color: var(--color-warning);
  }

  .info-log {
    background-color: var(--color-primary);
  }
</style>
