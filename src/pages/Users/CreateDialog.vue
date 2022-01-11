<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="custom-width">
      <q-card-section class="row bg-blue-10 text-white">
        <div class="text-h6">Crear Usuario</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="store.commit('users/setShowDialog', false)"
        />
      </q-card-section>
      <q-separator></q-separator>
      <q-form class="q-gutter-none" @submit="createUser">
        <q-card-section class="q-pb-xs">
          <q-input
            color="white"
            bottom-slots
            clearable
            filled
            ref="name"
            v-model="credentials.name"
            label="Nombre"
            lazy-rules
            :rules="[
              (val) => val.length > 0 || 'Debes colocar un nombre válido',
            ]"
          >
            <template v-slot:prepend>
              <q-icon color="white" name="spellcheck" size="sm" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-input
            color="white"
            bottom-slots
            clearable
            filled
            ref="lastname"
            v-model="credentials.lastname"
            label="Apellido"
            lazy-rules
            :rules="[
              (val) => val.length > 0 || 'Debes colocar un apellido válido',
            ]"
          >
            <template v-slot:prepend>
              <q-icon color="white" name="spellcheck" size="sm" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-input
            color="white"
            bottom-slots
            clearable
            filled
            ref="email"
            v-model="credentials.email"
            label="Correo"
            lazy-rules
            :rules="[
              (val) => val.length > 0 || 'Debes colocar un correo electrónico',
              (val) =>
                emailRegExp.test(val) ||
                'El formato del correo electrónico dado no es válido',
            ]"
          >
            <template v-slot:prepend>
              <q-icon color="white" name="person" size="sm" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-input
            color="white"
            ref="password"
            v-model="credentials.password"
            outlined
            filled
            label="Contraseña"
            clearable
            lazy-rules
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              (val) =>
                val.length >= 6 ||
                'Debes colocar una contraseña de al menos 6 caracteres',
            ]"
          >
            <template v-slot:prepend>
              <q-icon color="white" name="https" size="sm" />
            </template>
            <template v-slot:append>
              <q-icon
                color="white"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                size="sm"
                class="cursor-pointer q-mr-sm"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-py-xs">
          <q-select
            filled
            v-model="credentials.role_id"
            :options="rolesList"
            :option-value="
              (opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)
            "
            :option-label="
              (opt) =>
                Object(opt) === opt && 'role_name' in opt
                  ? opt.role_name
                  : '- Null -'
            "
            emit-value
            map-options
            label="Cargo"
            lazy-rules
            :rules="[
              (val) => val || 'Debes seleccionar el cargo de la persona',
            ]"
          />
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
  onMounted,
  ref,
} from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "CreateDialog",
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const store = useStore();
    const credentials = ref({
      email: "",
      name: "",
      lastname: "",
      password: "",
      role_id: null,
    });
    const emailRegExp = new RegExp("^[^@]+@[^@]+\.[a-zA-Z]{2,}$");
    const isPwd = ref(true);
    const rolesList = ref([]);

    // Obtener propiedades del store
    const showDialog = markRaw(
      computed(() => store.getters["users/showDialog"])
    );
    const token = markRaw(computed(() => store.getters["auth/token"]));

    /**
     * Crea la información de un servicio en la Base de Datos.
     */
    async function createUser() {
      try {
        // Show componente de carga
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Creando nuevo usuario...",
        });

        // Crear usuario
        let response = (
          await app.$api.post(
            "users",
            { ...credentials.value },
            {
              headers: {
                Authorization: `Bearer ${token.value}`,
              },
            }
          )
        ).data;

        // Setear valores y cerrar
        store.commit("users/setUserItem", response.user);
        store.commit("users/setShowDialog", false);

        // Ocultar componente de carga
        app.$q.loading.hide();

        // Mostrar mensaje de éxito
        app.$Swal.fire("Success", "El usuario fue creado con éxito", "success");
      } catch (error) {
        app.$q.loading.hide();
        store.commit("users/setShowDialog", false);
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar crear el usuario en la Base de Datos",
          "error"
        );
      }
    }

    /**
     * Obtiene la información de los roles de los usuarios.
     */
    async function getRoles() {
      try {
        const {
          data: { roles },
        } = await app.$api.get("roles");
        rolesList.value = roles;
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar obtener la información de los roles",
          "error"
        );
      }
    }

    onMounted(getRoles);

    return {
      credentials,
      emailRegExp,
      isPwd,
      rolesList,
      store,
      showDialog,
      createUser,
    };
  },
});
</script>
<style lang="scss" scoped>
.custom-width {
  width: 600px;
  height: 570px;
}
</style>
