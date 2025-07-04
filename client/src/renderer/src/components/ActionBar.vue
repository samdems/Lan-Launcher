<script lang="ts" setup>
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { useGameStore } from '../stores/useGameStore.js';

const actionBarPanel = useTemplateRef<HTMLElement>('actionBarPanel');
const gameStore = useGameStore();
const height = 72;

onMounted(() => {
  if (actionBarPanel.value) {
    actionBarPanel.value.closest('.parallax')?.addEventListener('scroll', updateShadow);
  }
});

onUnmounted(() => {
  if (actionBarPanel.value) {
    actionBarPanel.value.closest('.parallax')?.removeEventListener('scroll', updateShadow);
  }
});

function updateShadow() {
  if (actionBarPanel.value) {
    const t = actionBarPanel.value.getBoundingClientRect();
    if (t.y == height) {
      actionBarPanel.value.classList.add('shadow-md');
    } else {
      actionBarPanel.value.classList.remove('shadow-md');
    }
  }
}
</script>

<template>
  <div
    ref="actionBarPanel"
    class="flex flex-row gap-4 border-2 border-base-200 p-4 justify-between items-center sticky top-0 z-10"
  >
    <select
      v-if="gameStore.selectedGame?.type === 'zip'"
      v-model="gameStore.selectedGame.selectedArchive"
      class="select select-bordered w-64"
    >
      <option disabled value="">Select an archive</option>
      <option
        v-for="archive in gameStore.selectedGame?.archives"
        :key="archive.id"
        :value="archive.id"
      >
        {{ archive.name }} => {{ archive.version }} ({{ archive.os }})
      </option>
    </select>
    <div v-if="gameStore.selectedGame?.type !== 'zip'"></div>
    <button
      v-if="gameStore.selectedGame?.type !== 'zip'"
      class="btn btn-warning"
      @click="gameStore.play"
    >
      Launch in {{ gameStore.selectedGame?.type }}
    </button>

    <div v-if="gameStore.selectedGame?.type === 'zip'" class="flex gap-2">
      <button
        v-if="gameStore.selectedArchive?.isInstalled"
        class="btn btn-error w-24"
        @click="gameStore.uninstallArchive"
      >
        Uninstall
      </button>
      <button v-else class="btn btn-primary w-24" @click="gameStore.installArchive">Install</button>
      <button
        class="btn btn-warning"
        :disabled="!gameStore.selectedArchive?.isInstalled"
        @click="gameStore.play"
      >
        Play
      </button>
    </div>
  </div>
</template>
