$(".tag-editor").each(function () {
    const $tableID = $(this).find('.table-editable');
    const $tableBody = $tableID.find('tbody');

    const newTr = `
    <tr>
      <td class="pt-3-half" contenteditable="true"></td>
      <td class="pt-3-half table-buttons"><span class="table-up"><button>🔼</button></span><span class="table-down"><button>🔽</button></span></td>
      <td class="table-buttons"><span class="table-remove"><button type="button">❌</button></span></td>
    </tr>
    `;
    $(this).on('click', '.table-add', function () {
        $tableBody.append(newTr);
        $tableBody.find("tr:last > td:first").focus();
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
    // A few jQuery helpers for exporting only
    jQuery.fn.pop = [].pop;
    jQuery.fn.shift = [].shift;
});
$('#export-btn').on('click', function () {
    const zip = new JSZip();
    const data = zip.folder("data");
    const log = $('#export-log');
    let dirty = false;

    log.text('Generating your datapack...');

    $(".tag-editor").each(function () {
        const $rows = $(this).find('tr:not(:hidden) td:first');
        const values = $rows.toArray().map(function (row) {
            return row.textContent;
        });
        if (values.length) { // Output the result
            data.file($(this).attr('data-tag-modid') + "/tags/" + $(this).attr('data-tag-path'), JSON.stringify({
                replace: false,
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
        zip.generateAsync({type: "blob"}).then(function (content) {
            // see FileSaver.js
            saveAs(content, "my_datapack.zip");
            log.text('Done!');
        }).catch(e => log.text('Uh oh [' + e + ']'));
    } else {
        log.text('There is nothing to export!');
    }
});
