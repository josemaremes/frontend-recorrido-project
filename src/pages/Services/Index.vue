<template>
  <q-page class="my-page-height">
    <q-card class="q-ma-none q-mx-md q-mt-xs q-mb-none q-pa-none">
      <div class="row">
        <div class="col-12">
          <q-card-section class="text-h6"> Services </q-card-section>
        </div>
        <div class="col-12">
          <q-table
            :columns="tableColumns"
            dense
            :filter="filter"
            :loading="loading"
            :rows="serviceList"
            row-key="id"
            style="height: calc(100vh - 130px)"
          >
            <template v-slot:top>
              <div class="row">
                <div class="col-12">
                  <q-input
                    v-model="filter"
                    filled
                    dense
                    borderless
                    placeholder="Buscar"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>
              <q-space></q-space>
              <q-btn
                color="blue-10"
                :disable="loading"
                label="Crear"
                icon="add"
                size="sm"
              />
              <q-btn
                class="q-mx-md q-my-sm"
                color="blue-10"
                :disable="loading"
                label="Refrescar"
                icon="refresh"
                size="sm"
              />
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  class="q-px-xs"
                  color="grey"
                  dense
                  flat
                  icon="delete"
                  round
                >
                  <q-tooltip
                    anchor="top middle"
                    :offset="[10, 10]"
                    self="bottom middle"
                    >Eliminar Servicio</q-tooltip
                  >
                </q-btn>
              </q-td>
            </template>
            <template v-slot:no-data="{}">
              <div class="full-width row flex-center q-gutter-sm">
                <span>No hay información disponible</span>
              </div>
            </template>
          </q-table>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  markRaw,
  onMounted,
  ref,
} from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Services",
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const store = useStore();
    const loading = ref(false);
    const filter = ref("");
    const showDialog = ref(false);
    const tableColumns = ref([
      {
        name: "id",
        label: "Identificador",
        align: "left",
        field: "id",
        sortable: true,
      },
      {
        name: "service_name",
        align: "left",
        label: "Nombre",
        field: "service_name",
        sortable: true,
      },
      {
        name: "created_at",
        align: "left",
        label: "Fecha de Creación",
        field: "created_at",
        sortable: true,
      },
      { name: "actions", label: "Acciones", field: "", align: "left" },
    ]);

    // Obtener propiedades del store
    const serviceList = markRaw(
      computed(() => store.getters["services/serviceList"])
    );
    const token = markRaw(computed(() => store.getters["auth/token"]));

    /**
     * Obtiene un listado de todos los servicios que se han creado hasta la fecha
     */
    async function getServices() {
      try {
        // Show componente de carga
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Obteniendo listado de servicios...",
        });

        // Obtener servicios
        const {
          data: { services },
        } = await app.$api.get("services", {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });

        // Guardar información en el store
        store.commit("services/setServiceList", services);

        // Ocultar componente de carga
        app.$q.loading.hide();
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar obtener el listado de servicios",
          "error"
        );
      }
    }

    onMounted(getServices);

    return {
      filter,
      loading,
      serviceList,
      tableColumns,
    };
  },
});
</script>
