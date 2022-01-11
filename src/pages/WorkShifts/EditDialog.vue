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
            <q-item class="justify-center text-bold q-pa-xs">
              <q-card-section
                horizontal
                class="justify-center"
                style="border: 1px solid black; width: 100%"
              >
                <q-card-section
                  v-for="(row, index) in item.headers"
                  :key="index"
                  :class="[
                    index === 0 ? 'active-color' : '',
                    'q-pa-sm',
                    'text-center',
                  ]"
                  :style="[
                    index === 0 ? 'width: 35%' : 'width: 20%',
                    index !== 0
                      ? `background-color: ${getRandomColor(index - 1)}`
                      : 'background-color: none',
                  ]"
                >
                  {{ row }}
                </q-card-section>
              </q-card-section>
            </q-item>
            <q-item
              v-for="element in Object.keys(item.interval)"
              :key="element"
              class="justify-center q-pa-xs"
              active
              active-class="box-color"
            >
              <q-card-section
                horizontal
                class="justify-center"
                style="border: 1px solid black; width: 100%"
              >
                <q-card-section
                  :class="[
                    item.interval[element].findIndex(
                      (item) => item.userValue
                    ) !== -1
                      ? 'positive-color'
                      : 'negative-color',
                    'text-center',
                  ]"
                  style="width: 35%"
                  >{{ element }}</q-card-section
                >
                <q-card-section
                  v-for="row in item.interval[element]"
                  :key="row.interval"
                  class="q-pa-sm"
                  style="width: 20%"
                >
                  <q-checkbox v-model="row.userValue"></q-checkbox>
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

const COLORS = [
  "#6188e2",
  "#b2c326",
  "#6b0392",
  "#940002",
  "#ee8a71",
  "#f4c63d",
  "#d17905",
  "#453d3f",
  "#59922b",
  "#0544d3",
  "#f05b4f",
  "#dda458",
  "#eacf7d",
  "#86797d",
  "#a748ca",
];

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
    const userList = markRaw(computed(() => store.getters["users/userList"]));
    const token = markRaw(computed(() => store.getters["auth/token"]));

    /**
     * Devuelve el valor hexadecimal de un color
     */
    function getRandomColor(index) {
      return COLORS[index];
    }

    /**
     * Obtiene una copia de la información de los turnos.
     */
    async function getInitialView() {
      let shiftBackup = [];
      generalState.value.workshiftList.forEach((item) => {
        let shiftObject = {
          dateTitle: item.dateTitle,
          headers: [item.dateTitle],
          interval: {},
        };
        item.rows.forEach((row) => {
          shiftObject["interval"][row.interval] = [];
          userList.value.forEach((user) => {
            shiftObject["interval"][row.interval].push({
              contractName: row.contractName,
              dateTitle: row.dateTitle,
              interval: row.interval,
              serviceName: row.serviceName,
              userName: user.name,
              userValue: user.name === row.userName ? row.userValue : false,
              week: row.week,
            });
            !shiftObject.headers.includes(user.name) &&
              shiftObject.headers.push(user.name);
          });
        });
        shiftBackup.push(shiftObject);
      });
      console.log(shiftBackup);
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
      getRandomColor,
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
.negative-color {
  background-color: $red-5;
  color: black;
}
.positive-color {
  background-color: $green-12;
  color: black;
}
</style>
