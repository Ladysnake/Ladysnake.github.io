<script context="module" lang="ts">
  interface PlayerInfo {
    icon: string;
    username: string;
    uuid: string;
    mojangDataUrl: string;
  }
</script>
<script lang="ts">
  import type {PlayerDbResponse} from "./PlayerDbResponse.js";

  let uuidOrUsername: string = '';
  let log: string = '';
  let loading = false;
  let playerInfo: PlayerInfo | undefined;

  async function handleSubmit() {
    const replacedUrl = new URL(window.location.href);
    replacedUrl.search = '?q=' + uuidOrUsername;
    window.history.pushState(null, '', replacedUrl);
    await fetchData();
  }

  async function fetchData() {
    try {
      log = '';
      loading = true;
      const response = await fetch(`https://playerdb.co/api/player/minecraft/${uuidOrUsername}`);
      const dbResponse: PlayerDbResponse = await response.json();
      const playerData = dbResponse.data.player;
      if (!playerData) {
        log = `${dbResponse.message} (${dbResponse.code})`;
      } else {
        playerInfo = {
          icon: playerData.avatar,
          username: playerData.username,
          uuid: playerData.id,
          // We can't fetch from that, CORS won't allow us - best we can do is display a link
          mojangDataUrl: `https://sessionserver.mojang.com/session/minecraft/profile/${playerData.id}?unsigned=false`,
        }
        window.history.replaceState(playerInfo, '');
      }
    } catch (e) {
      console.error(e);
      log = 'Could not connect to the PlayerDB API';
    } finally {
      loading = false;
    }
  }

  async function loadFromQuery(e?: PopStateEvent) {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    const state = e?.state;
    if (query) {
      uuidOrUsername = query;
      if (typeof state === 'object' && state.icon && state.username && state.uuid && state.mojangDataUrl) {
        playerInfo = state;
      } else {
        await fetchData();
      }
    }
  }

  loadFromQuery();
</script>
<svelte:window on:popstate={loadFromQuery}/>
<form on:submit|preventDefault={handleSubmit}>
  <fieldset disabled={loading}>
    <label>
      UUID or Username
      <input type="text" bind:value={uuidOrUsername}/>
    </label>
    <input type="submit"/><br/>
    <output>{log}</output>
  </fieldset>
</form>
<hr/>
{#if playerInfo}
  <h2>
    <img src={playerInfo.icon} alt={`Head of player ${playerInfo.username}`} width="32" height="32"/>
    <span>
    {playerInfo.username}
  </span>
  </h2>
  <p><span class="uuid-label">UUID: </span><code>{playerInfo.uuid}</code></p>
  <p><a href={playerInfo.mojangDataUrl}>Get the full JSON serialized form for Blabber's illustrations</a></p>
{/if}

<style>
  h2 {
    border-bottom: none;
  }

  h2 img {
    vertical-align: middle;
  }

  h2 span {
    vertical-align: middle;
  }

  .uuid-label {
    font-weight: bold;
  }
</style>
