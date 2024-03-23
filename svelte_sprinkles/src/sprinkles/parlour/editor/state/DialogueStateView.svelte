<script lang="ts">
  import DialogueStateProperties from "./DialogueStateProperties.svelte";

  export let state: string;
</script>
<div class="main" id="dialogue-state-pane">
  <h3>State Properties: {state}</h3>
  <DialogueStateProperties state={state}/>
  <!-- Editable table -->
  <div class="card dialogue-choice-editor not-dialogue-ending">
    <h3 class="no_toc card-header font-weight-bold py-4 dialogue-editor-header">
      Available Choices
      <span class="table-add float-right mb-3 mr-2"><button type="button"
                                                            class="btn btn-success btn-rounded btn-sm my-0">New choice</button></span>
    </h3>
    <div class="card-body">
      <div class="table-editable">
        <table class="table table-bordered table-responsive-md table-striped text-center">
          <thead>
          <tr>
            <th class="text-center">Text</th>
            <th class="text-center table-buttons">Next State</th>
            <th class="text-center table-buttons">Sort</th>
            <th class="text-center table-buttons">Remove</th>
          </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<style>
  #dialogue-state-pane {
    width: 100%;
    padding-top: 1rem;
  }
</style>