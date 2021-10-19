document.querySelectorAll('.data-editor-toggle').forEach(toggle => {
    toggle.classList.remove('hidden');  // poggies, we have JS
    const input = toggle.querySelector('input');
    const target = $(input.dataset.target);
    input.addEventListener('change', function() {
        target.collapse(input.checked ? 'show' : 'hide');
    });
    // The CSS transition can be a bit slow compared to a furious clicker, so things may get out of sync
    target.on('hidden.bs.collapse', function() {
        input.checked = false;
    });
    target.on('shown.bs.collapse', function() {
        input.checked = true;
    });
});
$('.gamerule-editor').each(function() {
    const output = $(this).find('.gamerule-value');
    $(this).on('click', 'input', function() {
        output.text($(this).val());
        $('.gamerule-export').removeClass('hidden');
    });
});
$('.tag-editor').each(function () {
    const $tableID = $(this).find('.table-editable');
    const $tableBody = $tableID.find('tbody');

    const newTr = `
    <tr>
      <td class="input-cell"><input type="text" placeholder="#mod-id:tag, mod-id:thingy" pattern="#?([a-z0-9_.-]+:)?[a-z0-9/._-]*"/><span class="error-message">Not a valid identifier!</span></td>
      <td class="table-buttons"><span class="table-up"><button>🔼</button></span><span class="table-down"><button>🔽</button></span></td>
      <td class="table-buttons"><span class="table-remove"><button type="button">❌</button></span></td>
    </tr>
    `;
    const appendRow = () => {
        $tableBody.append(newTr);
        const $input = $tableBody.find("tr:last input:first");
        $input.focus();
        // Stop editing when pressing enter
        $input.keypress(function(e) {
            if (e.keyCode === 13) {
                $(this).blur();
            }
        });
        $(this).off('shown.bs.collapse', appendRow);
        $('.tag-export').removeClass('hidden');
    }
    $(this).on('shown.bs.collapse', appendRow);
    $(this).on('click', '.table-add', appendRow);
    $tableID.on('click', '.table-remove', function () {
        $(this).parents('tr').detach();
    });
    $tableID.on('click', '.table-up', function () {
        const $row = $(this).parents('tr');
        if ($row.index() > 0) {
            $row.prev().before($row.get(0));
        }
    });
    $tableID.on('click', '.table-down', function () {
        const $row = $(this).parents('tr');
        $row.next().after($row.get(0));
    });
});
(() => {
    function writeDatapackMeta(zip) {
        zip.file('pack.mcmeta', JSON.stringify({
            pack: {
                description: 'Custom datapack for Requiem configuration',
                pack_format: 4
            }
        }));
    }

    $('#gamerule-export-btn').on('click', async function () {
        const zip = new JSZip();
        const logElement = document.querySelector('#gamerule-export-log');
        const log = (msg) => logElement.textContent = msg;
        log('Generating your datapack...');

        try {
            const commands = Array.from(document.querySelectorAll('.gamerule-editor'), (editor) => {
                return editor.querySelector('input:checked:not([data-default])');
            }).filter(it => it).map(it => `gamerule ${it.dataset.gameruleName} ${it.value}`);

            if (commands.length) {
                zip.file("data/requiem-cfg/functions/gamerule-init.mcfunction", commands.join("\n"));
                zip.file("data/minecraft/tags/functions/load.json", JSON.stringify({
                    replace: false,
                    values: ["requiem-cfg:gamerule-init"]
                }));
                writeDatapackMeta(zip);
                saveAs(await zip.generateAsync({type: "blob"}), "requiem-gamerule-config.zip");
                log('Done!');
            } else {
                log('There is nothing to export!');
            }
        } catch (e) {
            log(`Uh oh [${e}]`);
        }
    });
    $('#export-btn').on('click', async function () {
        const zip = new JSZip();
        const logElement = document.querySelector('#export-log');
        const log = (msg) => logElement.textContent = msg;
        const errors = [];

        const data = zip.folder("data");
        let dirty = false;

        log('Generating your datapack...');

        try {
            document.querySelectorAll('.tag-editor').forEach((editor) => {
                const replace = editor.querySelector('.tag-replace').checked;

                if (editor.querySelector('input[type=text]:invalid')) {
                    errors.push(`Invalid identifiers in ${editor.dataset.tagModid}:${editor.dataset.tagPath}`);
                    return;
                }

                const values = Array.from(editor.querySelectorAll('input[type=text]'), (input) => input.value).filter(it => it);
                if (values.length || replace) { // Output the result
                    data.file(`${editor.dataset.tagModid}/tags/${editor.dataset.tagPath}`, JSON.stringify({
                        replace,
                        values
                    }));
                    dirty = true;
                }
            });
            if (errors.length) {
                logElement.innerHTML = `There were errors preventing the creation of your datapack:
<ol>
    ${errors.map(err => `<li>${err}</li>`).join('\n')}
</ol>`
            } else if (dirty) {
                zip.file('pack.mcmeta', JSON.stringify({
                    pack: {
                        description: 'Custom datapack for Requiem configuration',
                        pack_format: 4
                    }
                }));
                saveAs(await zip.generateAsync({type: "blob"}), "requiem-tag-config.zip");
                log('Done!');
            } else {
                log('There is nothing to export!');
            }
        } catch (e) {
            log(`Uh oh [${e}]`);
        }
    });
})();