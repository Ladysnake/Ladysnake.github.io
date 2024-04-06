import {dialogueData, dialogueStart} from "../dialogueDataStore";
import type {DataSetEdges, DataSetNodes, Network, Node} from "vis-network";
import {darkModeEnabled} from "../../../lib/darkMode";
import {derived} from "svelte/store";
import type BlabberDialogue from "../model/BlabberDialogue";
import {hsvToRgbString} from "./color-transform";
import type {Action, ActionReturn} from "svelte/action";

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

interface DynamicImports {
  DataSet: any,
  Network: any,
}

interface GraphEvents {
  'on:select': (e: CustomEvent<string>) => void,
}

export const setupGraph: Action<HTMLElement, DynamicImports, GraphEvents> = (
    container: HTMLElement,
    { DataSet, Network }: DynamicImports,
): ActionReturn<DynamicImports, GraphEvents> => {
  interface Props {
    darkMode: boolean;
    dialogue: BlabberDialogue;
    startState: string;
  }

  const props = derived(
      [darkModeEnabled, dialogueData, dialogueStart],
      ([darkMode, dialogue, startState]) => ({darkMode, dialogue, startState} as Props)
  );

  function renderGraph({darkMode, dialogue, startState}: Props) {
    container.textContent = '';

    if (!dialogue.data.states) return;

    const nodes: DataSetNodes = new DataSet();
    const edges: DataSetEdges = new DataSet();
    for (const [state, stateData] of Object.entries(dialogue.states)) {
      const color = colorGen(state, darkMode);

      const node: Node = { id: state, label: state, color }
      if (stateData.type === 'end_dialogue') {
        node.shape = 'box';
        (node.shapeProperties ??= {}).borderRadius = 0;
        node.borderWidth = 2;
      } else if (stateData.type === 'ask_confirmation') {
        node.shape = 'box';
        (node.shapeProperties ??= {}).borderDashes = true;
      } else if (state === startState) {
        node.shape = 'circle';
        node.borderWidth = 2;
      } else {
        node.shape = 'ellipse';
      }
      node.font = {
        color: getComputedStyle(container).getPropertyValue('--base-text-color'),
      }
      node.opacity = 1.0;

      nodes.add(node);

      for (const { next, text, condition } of (stateData.choices ?? [])) {
        edges.add({
          from: state,
          to: next,
          color,
          title: JSON.stringify(text),
          dashes: condition != undefined,
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
        tooltipDelay: 18,
      },
    }
    const network = new Network(container, networkData, networkOptions) as Network;
    network.on('doubleClick', e => {
      if (e.nodes?.length) {
        container.dispatchEvent(new CustomEvent('select', {
          detail: e.nodes[0],
        }));
      }
    });
    network.on('select', e => network.setOptions({
      interaction: {
        zoomView: !!(e.nodes?.length || e.edges?.length),
      }
    }));
  }

  const cleanup = props.subscribe(renderGraph);

  return {
    destroy: cleanup
  };
}
