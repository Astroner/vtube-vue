<template>
  <pages>
    <player-page />
    <music-recommendations-page />
    <playlists-page />
    <search-page />
    <profile-page />
  </pages>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlayerPage from './content/PlayerPage/PlayerPage.vue';
import ProfilePage from './content/ProfilePage.vue';
import MusicRecommendationsPage from './content/MusicRecommendationsPage.vue';
import SearchPage from './content/SearchPage/SearchPage.vue';
import PlaylistsPage from './content/PlaylistsPage.vue';
import Pages from './Pages/Pages.vue';

export default defineComponent({
  components: {
    Pages,
    PlayerPage,
    MusicRecommendationsPage,
    ProfilePage,
    SearchPage,
    PlaylistsPage,
  },
  name: 'App',
});
</script>

<style lang="scss">

</style>
