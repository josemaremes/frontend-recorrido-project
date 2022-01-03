<template>
  <q-page class="my-page-height">
    <q-card class="q-ma-none q-mx-md q-mt-xs q-mb-none q-pa-none">
      <div class="row">
        <div class="col-12">
          <q-card-section class="text-h6"> Contratos </q-card-section>
        </div>
        <div class="col-12">
          <q-table
            :columns="tableColumns"
            dense
            rows-per-page-label="Registros por Página"
            :filter="filter"
            :loading="loading"
            :rows="contractList"
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
                @click="store.commit('contracts/setShowDialog', true)"
              />
              <q-btn
                class="q-mx-md q-my-sm"
                color="blue-10"
                :disable="loading"
                label="Refrescar"
                icon="refresh"
                size="sm"
                @click="refreshTable"
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
                  @click="
                    store.commit('contracts/setDeleteDialog', {
                      contractId: props.row.id,
                      deleteDialog: true,
                    })
                  "
                >
                  <q-tooltip
                    anchor="top middle"
                    :offset="[10, 10]"
                    self="bottom middle"
                    >Eliminar Contrato</q-tooltip
                  >
                </q-btn>
              </q-td>
            </template>
            <template v-slot:no-data="{}">
              <div class="full-width row flex-center q-gutter-sm">
                <span>No hay información de contratos registrados</span>
              </div>
            </template>
          </q-table>
        </div>
      </div>
    </q-card>
    <create-dialog></create-dialog>
    <delete-dialog></delete-dialog>
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
import CreateDialog from "./CreateDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Contracts",
  components: {
    CreateDialog,
    DeleteDialog,
  },
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const store = useStore();
    const loading = ref(false);
    const filter = ref("");
    const tableColumns = ref([
      {
        name: "contract_name",
        label: "Empresa",
        align: "left",
        field: "contract_name",
        sortable: true,
      },
      {
        name: "service",
        align: "left",
        label: "Servicio",
        field: "service_name",
        sortable: true,
      },
      {
        name: "open_close_day",
        align: "left",
        label: "Día Inicial - Día Final",
        field: "open_close_day",
        sortable: true,
      },
      {
        name: "open_close_schedule",
        align: "left",
        label: "Hora Inicial - Hora Final",
        field: "open_close_schedule",
        sortable: true,
      },
      { name: "actions", label: "Acciones", field: "", align: "left" },
    ]);

    // Obtener propiedades del store
    const contractList = markRaw(
      computed(() => store.getters["contracts/contractList"])
    );
    const token = markRaw(computed(() => store.getters["auth/token"]));

    /**
     * Obtiene un listado de todos los contratos que se han creado hasta la fecha
     */
    async function getContracts() {
      try {
        // Mostrar componente de carga
        loading.value = true;
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Obteniendo listado de contratos...",
        });

        // Obtener contratos
        const {
          data: { contracts },
        } = await app.$api.get("contracts", {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });

        // Guardar información en el store
        store.commit("contracts/setContractList", contracts);

        // Ocultar componente de carga
        loading.value = false;
        app.$q.loading.hide();
      } catch (error) {
        loading.value = false;
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar obtener el listado de contratos",
          "error"
        );
      }
    }

    /**
     * Hace una consulta a la base de datos para refrescar los datos en la tabla
     */
    async function refreshTable() {
      // Inicializar información en el store
      store.commit("contracts/setDefaultState");

      // Hacer nueva búsqueda
      await getContracts();
    }

    onMounted(getContracts);

    return {
      contractList,
      filter,
      loading,
      store,
      tableColumns,
      refreshTable,
    };
  },
});
</script>
