<script context="module" lang="ts">
  import type {DataSet} from 'vis-data';
  import type {Network} from 'vis-network';
  import {darkModeEnabled} from "../../../lib/darkMode";

  /**
   * https://stackoverflow.com/a/52171480
   */
  function cyrb53(str: string, seed: number = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
  }
</script>
<script lang="ts">
  import {hsvToRgbString} from "./color-transform";
  import {dialogueData} from "../dialogueDataStore";
  import {fade} from "svelte/transition";

  export let selectedState: string | undefined;
  export let mainView;

  function colorGen(str: string, darkMode: boolean) {
    const hash = cyrb53(str);
    const hue = (hash % 1000) / 1000;
    const saturation = darkMode ? 0.8 : 0.5;
    return {
      background: hsvToRgbString(hue, saturation, darkMode ? 0.6 : 1.0),
      border: hsvToRgbString(hue, saturation, darkMode ? 1.0 : 0.8),
      highlight: hsvToRgbString(hue, saturation, darkMode ? 0.9 : 1.0),
    };
  }

  function setupGraph(container: HTMLElement, { DataSet, Network }: any) {
    function renderGraph(darkMode: boolean) {
      container.textContent = '';

      if (!$dialogueData.data.states) return;

      container.style.height = '85vh';

      const nodes = new DataSet() as DataSet<any>;
      const edges = new DataSet() as DataSet<any>;
      for (const [state, stateData] of Object.entries($dialogueData.states)) {
        const color = colorGen(state, darkMode);
        let shape;
        const shapeProperties: Record<string, unknown> = {};
        if (stateData.type === 'end_dialogue') {
          shape = 'box';
          shapeProperties.borderRadius = 0;
        } else if (stateData.type === 'ask_confirmation') {
          shape = 'box';
          shapeProperties.borderDashes = true;
        } else {
          shape = 'ellipse';
        }
        const font = {
          color: getComputedStyle(container).getPropertyValue('--base-text-color'),
        }
        const opacity = 1.0;

        nodes.add({ id: state, label: state, font, color, opacity, shape, shapeProperties });

        for (const { next, text } of (stateData.choices ?? [])) {
          edges.add({
            from: state, to: next, color, title: JSON.stringify(text),
          });
        }
      }

      const networkData = { nodes, edges }
      const networkOptions = {
        edges: {
          arrows: 'to',
        },
        interaction: {
          zoomView: false,
        },
      }
      const network = new Network(container, networkData, networkOptions) as Network;
      network.on('doubleClick', e => {
        if (e.nodes?.length) {
          mainView = true;
          selectedState = e.nodes[0];
        }
      });
      network.on('select', e => network.setOptions({
        interaction: {
          zoomView: !!(e.nodes?.length || e.edges?.length),
        }
      }));
    }
    // The render function will be immediately called as part of the subscription
    darkModeEnabled.subscribe(renderGraph);
  }
</script>

<!--Vis Network is so massive we have to load it in separate chunks-->
{#await Promise.all([import('vis-data'), import('vis-network')]) }
  Loading...
{:then [{DataSet}, {Network}]}
<div id="dialogue-graph" use:setupGraph={{DataSet, Network}} transition:fade>
  <p>
    Import a dialogue or create some states in the table view to get started
  </p>
</div>
{/await}
