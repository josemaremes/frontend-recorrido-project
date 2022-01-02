<template>
  <q-dialog v-model="deleteDialog" persistent>
    <q-card class="custom-width">
      <q-card-section class="row bg-blue-10 text-white">
        <div class="text-h6">Eliminar Usuario</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="
            store.commit('users/setDeleteDialog', {
              userId: null,
              deleteDialog: false,
            })
          "
        />
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section v-if="userList.length > 3" class="text-justify">
        Esta acción eliminará el usuario número {{ userId }} de la base de
        datos. Por favor tenga en cuenta que una vez eliminada esta información
        ya no podrá ser recuperada.
      </q-card-section>
      <q-card-section v-else class="text-justify">
        El número mínimo de usuarios que se deben mantener en la Base de Datos
        corresponde a 3. En caso de que quieras eliminar un usuario debes
        crearlo desde la vista de registro.
      </q-card-section>

      <q-card-actions class="q-pa-md">
        <q-btn
          color="blue-10 full-width"
          label="Confirmar"
          @click="deleteUser"
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
    const userId = markRaw(computed(() => store.getters["users/userId"]));
    const userList = markRaw(computed(() => store.getters["users/userList"]));
    const deleteDialog = markRaw(
      computed(() => store.getters["users/deleteDialog"])
    );
    const token = markRaw(computed(() => store.getters["auth/token"]));

    /**
     * Elimina la información de un usuario si es posible.
     */
    async function deleteUser() {
      try {
        // Sólo se pueden borrar usuarios si existen más de 3
        if (userList.value.length === 3) {
          store.commit("users/setDeleteDialog", {
            userId: null,
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
          message: "Eliminando usuario...",
        });

        // Eliminar usuario
        await app.$api.delete(`users/${userId.value}`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });

        // Setear valores y cerrar
        store.commit("users/setDeleteUserId", userId.value);
        store.commit("users/setDeleteDialog", {
          userId: null,
          deleteDialog: false,
        });

        // Ocultar componente de carga
        app.$q.loading.hide();

        // Mostrar mensaje de éxito
        app.$Swal.fire(
          "Success",
          "El usuario fue eliminado con éxito",
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
      userId,
      userList,
      deleteDialog,
      store,
      deleteUser,
    };
  },
});
</script>
<style lang="scss">
.custom-width {
  width: 600px;
  height: 230px;
}
</style>
