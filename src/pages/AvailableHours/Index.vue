<template>
  <q-page class="my-page-height">
    <q-card class="q-ma-none q-mx-xs q-mt-xs q-mb-none q-pa-none">
      <div class="row">
        <div class="col">
          <q-card-section class="text-h6"> Available Hours </q-card-section>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
  watch,
} from "vue";

export default defineComponent({
  name: "AvailableHours",
});
</script>
