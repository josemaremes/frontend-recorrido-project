<template>
  <q-dialog v-model="deleteDialog" persistent>
    <q-card class="custom-width">
      <q-card-section class="row bg-blue-10 text-white">
        <div class="text-h6">Eliminar Contrato</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="
            store.commit('contracts/setDeleteDialog', {
              contractId: null,
              deleteDialog: false,
            })
          "
        />
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="text-justify">
        Esta acción eliminará el contrato número {{ contractId }} de la base de
        datos. Por favor tenga en cuenta que una vez eliminada esta información
        ya no podrá ser recuperada.
      </q-card-section>
      <q-card-actions class="q-pa-md">
        <q-btn
          color="blue-10 full-width"
          label="Confirmar"
          @click="deleteContract"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, markRaw } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "CreateDialog",
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const store = useStore();

    // Obtener propiedades del store
    const contractId = markRaw(
      computed(() => store.getters["contracts/contractId"])
    );
    const deleteDialog = markRaw(
      computed(() => store.getters["contracts/deleteDialog"])
    );
    const token = markRaw(computed(() => store.getters["auth/token"]));

    /**
     * Elimina la información de un contrato.
     */
    async function deleteContract() {
      try {
        // Show componente de carga
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Eliminando contrato...",
        });

        // Eliminar contrato
        await app.$api.delete(`contracts/${contractId.value}`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });

        // Setear valores y cerrar
        store.commit("contracts/setDeleteContractId", contractId.value);
        store.commit("contracts/setDeleteDialog", {
          contractId: null,
          deleteDialog: false,
        });

        // Ocultar componente de carga
        app.$q.loading.hide();

        // Mostrar mensaje de éxito
        app.$Swal.fire(
          "Success",
          "El contrato fue eliminado con éxito",
          "success"
        );
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar eliminar el contrato en la Base de Datos",
          "error"
        );
      }
    }

    return {
      contractId,
      deleteDialog,
      store,
      deleteContract,
    };
  },
});
</script>
<style lang="scss" scoped>
.custom-width {
  width: 600px;
  height: 220px;
}
</style>
