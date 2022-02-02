import {loadDialogueFromSession, setupDialogueIo, storeDialogueToSession} from "./dialogue-common.js";
import BlabberDialogue from "./blabber-dialogue.js";
import {DataSet, Network} from "/scripts/vis-network.min.js";
import {hsvToRgbString} from "./color-transform.js";

(() => {
    const dialogue = new BlabberDialogue();

    document.getElementById('dialogue-editor').hidden = false;
    const container = document.getElementById('dialogue-graph');

    /**
     * https://stackoverflow.com/a/52171480
     *
     * @param {string} str a string to hash
     * @param {number=0} seed
     * @returns {number}
     */
    const cyrb53 = function(str, seed = 0) {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
        h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1>>>0);
    };

    function colorGen(str) {
        const hash = cyrb53(str);
        const hue = (hash % 1000) / 1000;
        const saturation = darkMode.enabled ? 0.8 : 0.5;
        return {
            background: hsvToRgbString(hue, saturation, darkMode.enabled ? 0.6 : 1.0),
            border: hsvToRgbString(hue, saturation, darkMode.enabled ? 1.0 : 0.8),
            highlight: hsvToRgbString(hue, saturation, darkMode.enabled ? 0.9 : 1.0),
        };
    }

    function renderGraph() {
        if (!dialogue.data.states) return;

        container.textContent = '';

        const nodes = new DataSet();
        const edges = new DataSet();
        for (const state of dialogue.states()) {
            const color = colorGen(state);
            const stateData = dialogue.stateData(state);
            let shape;
            const shapeProperties = {};
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
            }
        }
        const network = new Network(container, networkData, networkOptions);
        network.on('doubleClick', e => {
            if (e.nodes?.length) {
                storeDialogueToSession(dialogue, e.nodes[0]);
                dialogue.data.states = null;
                const a = document.createElement('a');
                a.href = '../dialogue_generator';
                a.click();
            }
        });
    }

    function loadDialogueData(newData, restoreSelectedState) {
        dialogue.data = newData;
        renderGraph();
        if (!restoreSelectedState) container.scrollIntoView({ behavior: 'smooth' });
    }

    setupDialogueIo(dialogue, loadDialogueData);

    darkMode.addListener(renderGraph);

    document.getElementById('dialogue-view-toggle').addEventListener('click', () => {
        storeDialogueToSession(dialogue);
        dialogue.data.states = null;
        const a = document.createElement('a');
        a.href = '../dialogue_generator';
        a.click();
    });

    const sessionDialogue = loadDialogueFromSession();
    if (sessionDialogue) loadDialogueData(sessionDialogue.data, sessionDialogue.selected);
})();
