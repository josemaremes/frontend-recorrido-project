<template>
  <q-dialog v-model="deleteDialog" persistent>
    <q-card class="custom-width">
      <q-card-section class="row bg-blue-10 text-white">
        <div class="text-h6">Eliminar Servicio</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="
            store.commit('services/setDeleteDialog', {
              serviceId: null,
              deleteDialog: false,
            })
          "
        />
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="text-justify">
        Esta acción eliminará el servicio número {{ serviceId }} de la base de
        datos. Por favor tenga en cuenta que una vez eliminada esta información
        ya no podrá ser recuperada. Se recomienda no eliminar servicios que
        estén asociados a un contrato.
      </q-card-section>
      <q-card-actions class="q-pa-md">
        <q-btn
          color="blue-10 full-width"
          label="Confirmar"
          @click="deleteService"
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
    const serviceId = markRaw(
      computed(() => store.getters["services/serviceId"])
    );
    const serviceList = markRaw(
      computed(() => store.getters["services/serviceList"])
    );
    const deleteDialog = markRaw(
      computed(() => store.getters["services/deleteDialog"])
    );
    const token = markRaw(computed(() => store.getters["auth/token"]));

    /**
     * Elimina la información de un usuario si es posible.
     */
    async function deleteService() {
      try {
        // Sólo se pueden borrar servicios que no tengan contratos
        // asignados
        if (serviceList.value.length === 3) {
          store.commit("users/setDeleteDialog", {
            serviceId: null,
            deleteDialog: false,
          });
          return;
        }

        // Show componente de carga
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Eliminando servicio...",
        });

        // Eliminar usuario
        await app.$api.delete(`services/${serviceId.value}`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });

        // Setear valores y cerrar
        store.commit("services/setDeleteServiceId", serviceId.value);
        store.commit("services/setDeleteDialog", {
          serviceId: null,
          deleteDialog: false,
        });

        // Ocultar componente de carga
        app.$q.loading.hide();

        // Mostrar mensaje de éxito
        app.$Swal.fire(
          "Success",
          "El servicio fue eliminado con éxito",
          "success"
        );
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar eliminar el servicio en la Base de Datos",
          "error"
        );
      }
    }

    return {
      serviceId,
      serviceList,
      deleteDialog,
      store,
      deleteService,
    };
  },
});
</script>
<style lang="scss" scoped>
.custom-width {
  width: 600px;
  height: 230px;
}
</style>
