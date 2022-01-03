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
                  {{ item.userOneLabel }}
                </q-card-section>
                <q-card-section class="second-color">
                  {{ item.userTwoLabel }}
                </q-card-section>
                <q-card-section class="third-color">
                  {{ item.userThreeLabel }}
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
                    !element.user_one_value &&
                    !element.user_two_value &&
                    !element.user_three_value
                      ? 'negative-color'
                      : 'positive-color'
                  "
                  >{{ element.interval }}</q-card-section
                >
                <q-card-section>
                  <q-checkbox v-model="element.user_one_value"></q-checkbox>
                </q-card-section>
                <q-card-section>
                  <q-checkbox v-model="element.user_two_value"></q-checkbox>
                </q-card-section>
                <q-card-section>
                  <q-checkbox v-model="element.user_three_value"></q-checkbox>
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
          userOneLabel: "",
          userTwoLabel: "",
          userThreeLabel: "",
          rows: [],
        };
        item.rows.forEach((row) => {
          const newRow = {
            contract: row.contract,
            date_title: row.dateTitle,
            interval: row.hourInterval,
            not_label: "Sin Asignar",
            not_value: true,
            user_one_label: row.firstPersonLabel,
            user_one_value: row.firstPersonValue,
            user_two_label: row.secondPersonLabel,
            user_two_value: row.secondPersonValue,
            user_three_label: row.thirdPersonLabel,
            user_three_value: row.thirdPersonValue,
            week: row.week,
          };
          shiftObject["userOneLabel"] = newRow.user_one_label;
          shiftObject["userTwoLabel"] = newRow.user_two_label;
          shiftObject["userThreeLabel"] = newRow.user_three_label;
          shiftObject["rows"].push(newRow);
        });
        shiftBackup.push(shiftObject);
      });
      shifts.value = shiftBackup;
      console.log(shifts.value);
    }

    /**
     * Actualiza la información de los turnos en la Base de Datos
     */
    async function updateWorkshift() {}

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
