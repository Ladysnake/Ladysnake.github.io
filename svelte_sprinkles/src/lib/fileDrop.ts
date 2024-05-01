import type {Action, ActionReturn} from "svelte/action";

export const setupFileDrop: Action<HTMLElement, (file: File) => void> = (node: HTMLElement, loadFile: (file: File) => void): ActionReturn<(file: File) => void> => {
  let draggingInWindow = 0;
  let draggingInDropZone = 0;

  function onDrop(e: DragEvent) {
    e.preventDefault();
    try {
      if (e.dataTransfer?.items && e.dataTransfer.items.length) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[0].kind === 'file') {
          loadFile(e.dataTransfer.items[0].getAsFile()!);
        }
      } else if (e.dataTransfer?.files.length) {
        // Use DataTransfer interface to access the file(s)
        loadFile(e.dataTransfer.files[0]);
      }
    } finally {
      node.classList.remove('active', 'hovered');
      draggingInWindow = 0;
      draggingInDropZone = 0;
    }
  }

  function onDragEnter(e: DragEvent) {
    if (!(draggingInWindow++)) {
      node.classList.add('active');
    }
    if ((e.target as HTMLElement).classList.contains('drop-zone') && !(draggingInDropZone++)) {
      node.classList.add('hovered');
    }
  }

  function onDragLeave(e: DragEvent) {
    if (!(--draggingInWindow)) {
      node.classList.remove('active');
    }
    if ((e.target as HTMLElement).classList.contains('drop-zone') && !(--draggingInDropZone)) {
      node.classList.remove('hovered');
    }
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  node.addEventListener('dragover', onDragOver);
  node.addEventListener('drop', onDrop);
  document.body.addEventListener('dragenter', onDragEnter);
  document.body.addEventListener('dragleave', onDragLeave);

  return {
    destroy() {
      document.body.removeEventListener('dragenter', onDragEnter);
      document.body.removeEventListener('dragleave', onDragLeave);
    }
  }
}
