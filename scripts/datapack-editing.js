$('.tag-editor-toggle').removeClass('hidden');  // poggies, we have JS
$('.tag-export').removeClass('hidden');
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
    $(this).on('click', '.table-add', function () {
        $tableBody.append(newTr);
        const input = $tableBody.find("tr:last input:first");
        input.focus();
        // Stop editing when pressing enter
        input.keypress(function(e) {
            if (e.keyCode === 13) {
                $(this).blur();
            }
        });
    });
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
$('#export-btn').on('click', async function () {
    const zip = new JSZip();
    const logElement = document.querySelector('#export-log');
    const log = (msg) => logElement.textContent = msg;

    const data = zip.folder("data");
    let dirty = false;

    log('Generating your datapack...');

    try {
        document.querySelectorAll('.tag-editor').forEach((editor) => {
            const replace = editor.querySelector('.tag-replace').checked;
            const values = Array.from(editor.querySelectorAll('input[type=text]'), (input) => input.value);
            if (values.length || replace) { // Output the result
                data.file(`${editor.dataset.tagModid}/tags/${editor.dataset.tagPath}`, JSON.stringify({
                    replace,
                    values
                }));
                dirty = true;
            }
        });
        if (dirty) {
            zip.file('pack.mcmeta', JSON.stringify({
                pack: {
                    description: 'Custom datapack for Requiem configuration',
                    pack_format: 4
                }
            }));
            saveAs(await zip.generateAsync({type: "blob"}), "my_datapack.zip");
            log('Done!');
        } else {
            log('There is nothing to export!');
        }
    } catch (e) {
        log(`Uh oh [${e}]`);
    }
});
