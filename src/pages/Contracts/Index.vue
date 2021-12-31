<template>
  <q-page class="q-ma-none q-pa-none my-page-height">
    <q-card class="q-ma-none q-mx-xs q-mt-xs q-mb-none q-pa-none">
      <div class="row">
        <div class="col">
          <q-card-section class="text-h6"> Contracts </q-card-section>
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
  watch,
} from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Contracts",
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const store = useStore();

    const contractList = markRaw(
      computed(() => store.getters["contracts/contractList"])
    );

    /**
     * Obtiene un listado de todos los contratos que se han creado hasta la fecha
     */
    async function getContracts() {
      try {
        // Show componente de carga
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
        } = await app.$api.get("contracts");

        // Guardar información en el store
        store.commit("contracts/setContractList", contracts);

        // Ocultar componente de carga
        app.$q.loading.hide();
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire("Error", error.message, "error");
      }
    }

    onMounted(getContracts);

    return {
      contractList,
    };
  },
});
</script>
