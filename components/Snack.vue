<template>
  <div>
    <ClientOnly>
      <VSnackbar
        :color="type"
        location="top right"
        :timeout="6000"
        v-model="show"
        rounded="lg"
        transition="slide-y-transition"
      >
        <div class="d-flex">
          <div class="mr-3">
            <VIcon size="24" :icon="icon" />
          </div>
          <div>
            <p class="text-subtitle-2 font-weight-bold">{{ title }}</p>
            <p>{{ message }}</p>
          </div>
        </div>

        <template #actions>
          <VBtn @click="show = false" size="small">
            <VIcon size="small" icon="fluent:dismiss-12-regular" />
          </VBtn>
        </template>
      </VSnackbar>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const show = useShowSnack();
const title = useSnackTitle();
const message = useSnackMessage();
const type = useSnackType();

// get icon from type
const icon = computed(() => {
  switch (type.value) {
    case 'success':
      return 'fluent:checkmark-starburst-24-filled';
    case 'info':
      return 'fluent:info-24-filled';
    case 'warning':
      return 'fluent:warning-24-filled';
    case 'error':
      return 'fluent:dismiss-circle-24-filled';
    default:
      return 'fluent:checkmark-starburst-24-filled';
  }
});
</script>
