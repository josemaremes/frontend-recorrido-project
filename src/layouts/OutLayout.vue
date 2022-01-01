<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="text-center text-body q-pa-sm">
      Proyecto práctico sugerido por
      <a style="color: white" href="https://www.recorrido.cl/es"
        >Recorrido.cl</a
      >
      para la asignación de turnos del personal actual
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "OutLayout",
});
</script>
