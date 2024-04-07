<script lang="ts">
import {loadDialogueFile} from "./dialogueIo";
import type {HtmlLogger} from "../../../lib/htmlLogger";
import { setupFileDrop } from "../../../lib/fileDrop";
import {createEventDispatcher} from "svelte";
import BlabberDialogue from "../model/BlabberDialogue";

export let ioLogger: HtmlLogger;

const dispatch = createEventDispatcher<{
  'load': BlabberDialogue,
}>();
</script>
<div
  class="drop-zone"
  role="region"
  aria-label="File drop zone for importing dialogue"
  use:setupFileDrop={(f) => loadDialogueFile(f, ioLogger, dispatch)}
>
  <svg inline-src="octicon-upload"/>
  Drop a dialogue file <strong class="drop-zone">here</strong> to import
</div>

<style>
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
  }

  .drop-zone:global(.hovered) {
    color: var(--button-selected-outline);
  }

  .drop-zone:global(.active) {
    visibility: visible;
  }

  strong {
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
</style>