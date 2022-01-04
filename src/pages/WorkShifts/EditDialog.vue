<template>
  <q-dialog v-model="generalState.editDialog" persistent maximized>
    <q-card class="custom-width">
      <q-card-section class="row bg-blue-10 text-white">
        <div class="text-h6">Actualizar Turnos</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="store.commit('workshifts/setDefaultState')"
        />
      </q-card-section>
      <q-separator></q-separator>
      <div class="row text-center bg-blue-11">
        <div class="col-4">
          Empresa
          <q-card-section class="text-h6">
            {{ generalState.contract }}
          </q-card-section>
        </div>
        <div class="col-4">
          Servicio
          <q-card-section class="text-h6">
            {{ generalState.service }}
          </q-card-section>
        </div>
        <div class="col-4">
          Semana
          <q-card-section class="text-h6">
            {{ generalState.week }}
          </q-card-section>
        </div>
        <div class="col-12">
          <q-separator color="black"></q-separator>
          <q-card-section class="text-h6">
            {{ generalState.period }}
          </q-card-section>
        </div>
      </div>
      <q-separator></q-separator>
      <div class="row">
        <div
          v-for="item in shifts"
          v-bind:key="item.dateTitle"
          class="col-4 q-my-md q-mx-auto"
        >
          <q-list bordered separator>
            <q-item class="justify-center text-bold">
              <q-card-section horizontal style="border: 1px solid black">
                <q-card-section class="active-color">
                  {{ item.dateTitle }}
                </q-card-section>
                <q-card-section class="first-color">
                  {{ item.firstUserName }}
                </q-card-section>
                <q-card-section class="second-color">
                  {{ item.secondUserName }}
                </q-card-section>
                <q-card-section class="third-color">
                  {{ item.thirdUserName }}
                </q-card-section>
              </q-card-section>
            </q-item>
            <q-item
              v-for="(element, index) in item.rows"
              :key="index"
              class="justify-center flex wrap"
              active
              active-class="box-color"
            >
              <q-card-section horizontal style="border: 1px solid black">
                <q-card-section
                  :class="
                    !element.firstUserValue &&
                    !element.secondUserValue &&
                    !element.thirdUserValue
                      ? 'negative-color'
                      : 'positive-color'
                  "
                  >{{ element.interval }}</q-card-section
                >
                <q-card-section>
                  <q-checkbox v-model="element.firstUserValue"></q-checkbox>
                </q-card-section>
                <q-card-section>
                  <q-checkbox v-model="element.secondUserValue"></q-checkbox>
                </q-card-section>
                <q-card-section>
                  <q-checkbox v-model="element.thirdUserValue"></q-checkbox>
                </q-card-section>
              </q-card-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <q-card-actions class="q-pa-md justify-center">
        <q-btn
          color="blue-10"
          class="full-width"
          label="Actualizar"
          @click="updateWorkshift"
        />
      </q-card-actions>
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
  name: "EditDialog",
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const store = useStore();
    const shifts = ref([]);

    // Obtener propiedades del store
    const generalState = markRaw(
      computed(() => store.getters["workshifts/wholeState"])
    );
    const token = markRaw(computed(() => store.getters["auth/token"]));

    /**
     * Obtiene una copia de la información de los turnos.
     */
    async function getInitialView() {
      let shiftBackup = [];
      generalState.value.workshiftList.forEach((item) => {
        let shiftObject = {
          dateTitle: item.dateTitle,
          firstUserName: "",
          secondUserName: "",
          thirdUserName: "",
          rows: [],
        };
        item.rows.forEach((row) => {
          const newRow = {
            contract: row.contract,
            service: row.service,
            dateTitle: row.dateTitle,
            interval: row.hourInterval,
            notName: "Sin Asignar",
            notValue: false,
            firstUserName: row.firstPersonLabel,
            firstUserValue: row.firstPersonValue,
            secondUserName: row.secondPersonLabel,
            secondUserValue: row.secondPersonValue,
            thirdUserName: row.thirdPersonLabel,
            thirdUserValue: row.thirdPersonValue,
            week: row.week,
          };
          shiftObject["firstUserName"] = newRow.firstUserName;
          shiftObject["secondUserName"] = newRow.secondUserName;
          shiftObject["thirdUserName"] = newRow.thirdUserName;
          shiftObject["rows"].push(newRow);
        });
        shiftBackup.push(shiftObject);
      });
      shifts.value = shiftBackup;
    }

    /**
     * Actualiza la información de los turnos en la Base de Datos
     */
    async function updateWorkshift() {
      try {
        // Show componente de carga
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Actualizando la información...",
        });

        // Construir payload
        let payload = [];
        shifts.value.forEach((item) => {
          payload = payload.concat(item.rows);
        });

        // Obtener contratos
        await app.$api.post(
          "shifts",
          { data: JSON.stringify(payload) },
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          }
        );

        // Cerrar store
        store.commit("workshifts/setDefaultState");

        // Ocultar componente de carga
        app.$q.loading.hide();

        // Mostrar mensaje de éxito
        app.$Swal.fire(
          "Success",
          "Los turnos fueron actualizados correctamente",
          "success"
        );
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar actualizar la información de los turnis",
          "error"
        );
      }
    }

    onMounted(getInitialView);

    return {
      generalState,
      shifts,
      store,
      updateWorkshift,
    };
  },
});
</script>
<style lang="scss" scope>
.active-color {
  background-color: $yellow-11;
  color: black;
}
.box-color {
  background-color: $grey-3;
}
.custom-width {
  width: 00px;
  height: 230px;
}
.first-color {
  background-color: $accent;
}
.negative-color {
  background-color: $red-5;
  color: black;
}
.positive-color {
  background-color: $green-12;
  color: black;
}
.second-color {
  background-color: $primary;
}
.third-color {
  background-color: $warning;
}
</style>
