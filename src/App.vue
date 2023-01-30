<template>
  <!-- TODO: remove this nesting with desktop version -->
  <div class="app__container">
    <div class="app__pages">
      <pages>
        <music-recommendations-page />
        <playlists-page />
        <search-page />
        <player-page />
        <saved-page />
        <profile-page />
        <playlist-page />
        <saved-playlist-page />
        <queue-page />
      </pages>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect } from 'vue';
import PlayerPage from './content/PlayerPage/PlayerPage.vue';
import ProfilePage from './content/ProfilePage.vue';
import MusicRecommendationsPage from './content/MusicRecommendationsPage.vue';
import SearchPage from './content/SearchPage/SearchPage.vue';
import PlaylistsPage from './content/PlaylistsPage.vue';
import Pages from './Pages/Pages.vue';
import PlaylistPage from './content/PlaylistPage.vue';
import SavedPage from './content/SavedPage.vue';
import SavedPlaylistPage from './content/SavedPlaylistPage.vue';
import QueuePage from './content/QueuePage.vue';
import { musicStorage } from './music-storage';
import { useIsOnline } from './helpers/hooks/use-is-online';

export default defineComponent({
  components: {
    Pages,
    PlayerPage,
    MusicRecommendationsPage,
    ProfilePage,
    SearchPage,
    PlaylistsPage,
    PlaylistPage,
    SavedPage,
    SavedPlaylistPage,
    QueuePage,
  },
  name: 'App',
  setup() {
    const isOnline = useIsOnline();

    watchEffect(() => {
      if (isOnline.value) {
        musicStorage.updateSavedPlaylists().then(console.log);
      }
    });
  },
});
</script>

<style lang="scss" scoped>
.app {
  &__pages {
    width: 100vw;
    height: 100vh;

    @media screen and (min-width: 525px) {
      width: 425px;
      height: 700px;
    }
  }
  &__container {
    width: 100vw;
    height: 100vh;

    @media screen and (min-width: 525px) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
