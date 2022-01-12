function initEditor({ element, rowTemplate, rowInitializer = () => {}, rowSwapListener = () => {} }) {
    const $tableBody = element.querySelector('.table-editable tbody');

    const appendRow = () => {
        const newTr = document.createElement('tr');
        newTr.innerHTML = rowTemplate;
        $tableBody.append(newTr);
        const $input = newTr.querySelector("input");
        $input.focus();
        // Stop editing when pressing enter
        $input.addEventListener('keydown', function(e) {
            if (e.code === 'Enter') {
                $input.blur();
            }
        });
        newTr.querySelector('.table-remove').addEventListener('click', function () {
            $tableBody.removeChild(newTr);
        });
        newTr.querySelector('.table-up').addEventListener('click', () => {
            if ($tableBody.firstElementChild !== newTr) {
                const previousIndex = newTr.rowIndex;
                $tableBody.insertBefore(newTr, newTr.previousElementSibling);
                rowSwapListener(newTr, previousIndex - 1, newTr.rowIndex - 1);
            }
        });
        newTr.querySelector('.table-down').addEventListener('click', () => {
            if ($tableBody.lastElementChild !== newTr) {
                const previousIndex = newTr.rowIndex;
                $tableBody.insertBefore(newTr.nextElementSibling, newTr);
                rowSwapListener(newTr, previousIndex - 1, newTr.rowIndex - 1);
            }
        });
        rowInitializer(newTr);
        return newTr;
    }
    element.querySelectorAll('.table-add').forEach(a => a.addEventListener('click', appendRow));
    return appendRow;
}
