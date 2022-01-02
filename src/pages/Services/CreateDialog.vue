<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="custom-width">
      <q-card-section class="row bg-blue-10 text-white">
        <div class="text-h6">Crear Servicio</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="store.commit('services/setShowDialog', false)"
        />
      </q-card-section>
      <q-separator></q-separator>
      <q-form class="q-gutter-none" @submit="createService">
        <q-card-section class="q-pb-xs">
          <q-input
            color="black"
            bottom-slots
            clearable
            filled
            ref="serviceName"
            v-model="service.serviceName"
            label="Nombre del Servicio"
            lazy-rules
            :rules="[
              (val) => val.length > 0 || 'Debes colocar un nombre válido',
            ]"
          >
            <template v-slot:prepend>
              <q-icon color="black" name="spellcheck" size="sm" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions class="q-pa-md">
          <q-btn color="blue-10 full-width" label="Crear" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  markRaw,
  ref,
} from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "CreateDialog",
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const store = useStore();
    const service = ref({
      serviceName: "",
    });

    // Obtener propiedades del store
    const showDialog = markRaw(
      computed(() => store.getters["services/showDialog"])
    );
    const token = markRaw(computed(() => store.getters["auth/token"]));

    /**
     * Crea la información de un servicio en la Base de Datos.
     */
    async function createService() {
      try {
        // Show componente de carga
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Creando nuevo servicio...",
        });

        // Crear servicio
        let response = (
          await app.$api.post(
            "services",
            { service_name: service.value.serviceName },
            {
              headers: {
                Authorization: `Bearer ${token.value}`,
              },
            }
          )
        ).data;

        // Setear valores y cerrar
        store.commit("services/setServiceItem", response.service);
        store.commit("services/setShowDialog", false);

        // Ocultar componente de carga
        app.$q.loading.hide();

        // Mostrar mensaje de éxito
        app.$Swal.fire("Success", "El service fue creado con éxito", "success");
      } catch (error) {
        app.$q.loading.hide();
        store.commit("services/setShowDialog", false);
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar crear el servicio en la Base de Datos",
          "error"
        );
      }
    }

    return {
      service,
      store,
      showDialog,
      createService,
    };
  },
});
</script>
<style lang="scss" scoped>
.custom-width {
  width: 600px;
  height: 240px;
}
</style>
