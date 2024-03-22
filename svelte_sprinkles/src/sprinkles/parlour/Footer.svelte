<script lang="ts">
  import importIcon from '../../assets/octicon-upload.svg';
  import exportIcon from '../../assets/octicon-download.svg';

  let fileInput: FileList | null = null;
  let toggleIcon: string = '';
  let infoLog: string = '';
  let warningLog: string = '';
  let errorLog: string = '';

  function toggleView(): void {
    // TODO
  }

  function exportDialogue(): void {
    // TODO
  }

  function dragAndDropAction(node: HTMLElement) {
    let draggingInWindow = 0;
    let draggingInDropZone = 0;

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      try {
        if (e.dataTransfer?.items && e.dataTransfer.items.length) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[0].kind === 'file') {
            loadDialogueFile(e.dataTransfer.items[0].getAsFile());
          }
        } else if (e.dataTransfer?.files.length) {
          // Use DataTransfer interface to access the file(s)
          loadDialogueFile(e.dataTransfer.files[0]);
        }
      } finally {
        node.classList.remove('active', 'hovered');
        draggingInWindow = 0;
        draggingInDropZone = 0;
      }
    };

    const handleDragEnter = (e: DragEvent) => {
      if (!(draggingInWindow++)) {
        node.classList.add('active');
      }
      if ((e.target as HTMLElement).classList.contains('drop-zone') && !(draggingInDropZone++)) {
        node.classList.add('hovered');
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      if (!(--draggingInWindow)) {
        node.classList.remove('active');
      }
      if ((e.target as HTMLElement).classList.contains('drop-zone') && !(--draggingInDropZone)) {
        node.classList.remove('hovered');
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    node.addEventListener('drop', handleDrop);
    document.body.addEventListener('dragenter', handleDragEnter);
    document.body.addEventListener('dragleave', handleDragLeave);
    node.addEventListener('dragover', handleDragOver);

    return {
      destroy() {
        node.removeEventListener('drop', handleDrop);
        document.body.removeEventListener('dragenter', handleDragEnter);
        document.body.removeEventListener('dragleave', handleDragLeave);
        node.removeEventListener('dragover', handleDragOver);
      },
    };
  }
</script>
<div class="dialogue-footer">
    <div id="dialogue-import-export">
        <input id="dialogue-import" type="file" accept="application/json" bind:files={fileInput} />
        <label class="btn btn-info" for="dialogue-import">
            <img src={importIcon} alt="Import" />
            Import JSON dialogue file
        </label>
        <button id="dialogue-view-toggle" class="btn btn-success" on:click={toggleView}>
            <img src={toggleIcon} alt="Toggle" />
            Toggle Graph View
        </button>
        <button class="btn btn-warning" id="dialogue-export" on:click={exportDialogue}>
            <img src={exportIcon} alt="Export" />
            Export JSON dialogue file
        </button>
        <div class="drop-zone" role="region" aria-label="File drop zone for importing dialogue" use:dragAndDropAction>
            <img src={importIcon} alt="Import" />
            Drop a dialogue file <strong class="drop-zone">here</strong> to import
        </div>
    </div>
    <p class="dialogue-io-log info-log">{infoLog}</p>
    <p class="dialogue-io-log warning-log">{warningLog}</p>
    <p class="dialogue-io-log error-log">{errorLog}</p>
</div>