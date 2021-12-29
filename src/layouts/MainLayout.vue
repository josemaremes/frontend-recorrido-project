<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="custom-background">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          Sistema Práctico de Asignación de Turnos
        </q-toolbar-title>
        <div>Creado con Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      style="background-color: #42a5f5; color: white"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label class="text-center">
          <q-avatar size="70px">
            <img src="~assets/dashboard.png" />
          </q-avatar>
        </q-item-label>
        <q-separator />
        <q-item
          v-for="view in views"
          :key="view.title"
          clickable
          v-ripple
          :to="view.link"
          :active="activeView === view.title"
          active-class="active-link"
        >
          <q-item-section avatar>
            <q-icon color="#fff" :name="view.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ view.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container class="custom-background">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",
  setup() {
    const activeView = ref("Turnos Confirmados");
    const leftDrawerOpen = ref(false);
    const views = ref([
      {
        title: "Contratos",
        icon: "gavel",
        link: "/contracts",
      },
      {
        title: "Disponibilidad de Horas",
        icon: "calendar_view_week",
        link: "/available-hours",
      },
      {
        title: "Servicios",
        icon: "miscellaneous_services",
        link: "/services",
      },
      {
        title: "Turnos Confirmados",
        icon: "event_available",
        link: "/work-shifts",
      },
      {
        title: "Usuarios",
        icon: "people",
        link: "/users",
      },
    ]);

    /**
     * Función que permite mostrar u ocultar la barra izzquierda del dashboard.
     */
    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }
    return {
      activeView,
      leftDrawerOpen,
      views,
      toggleLeftDrawer,
    };
  },
});
</script>

<style lang="scss">
.active-link {
  color: #fff;
  background: #000;
}

.custom-background {
  background-color: #1d1d1d;
}
</style>
