<template>
  <q-page class="my-page-height">
    <q-card class="q-ma-none q-mx-md q-mt-xs q-mb-none q-pa-none">
      <div class="row">
        <div class="col-8">
          <q-card-section class="text-h6"> Turnos Confirmados </q-card-section>
        </div>
        <div class="col-4">
          <q-card-section class="flex justify-end">
            <q-btn
              color="green-12"
              :disable="gridInformation.length === 0"
              label="Editar Disponibilidad"
              @click="setDialogValues"
            ></q-btn>
          </q-card-section>
        </div>
        <div class="col-12">
          <q-separator color="black"></q-separator>
        </div>
        <div class="col-3">
          <q-card-section>
            Seleccione:
            <q-btn-dropdown color="primary" :label="contractSelected">
              <q-list bordered separator>
                <q-item
                  v-for="item in Object.keys(contractAndServices)"
                  :key="item"
                  clickable
                  v-close-popup
                  @click="contractSelected = item"
                >
                  <q-item-section>
                    <q-item-label>{{ item }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-section>
        </div>
        <div class="col-3">
          <q-card-section>
            Seleccione:
            <q-btn-dropdown
              color="primary"
              :label="serviceSelected.label"
              :disable="contractSelected === 'Contrato'"
            >
              <q-list bordered separator>
                <q-item
                  v-for="item in contractAndServices[contractSelected][
                    'services'
                  ]"
                  :key="item"
                  clickable
                  v-close-popup
                  @click="
                    serviceSelected = {
                      label: item.serviceName,
                      value: item.id,
                    }
                  "
                >
                  <q-item-section>
                    <q-item-label>{{ item.serviceName }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-section>
        </div>
        <div class="col-3">
          <q-card-section>
            Seleccione:
            <q-btn-dropdown
              color="primary"
              :label="weekSelected"
              :disable="serviceSelected.label === 'Servicio'"
            >
              <q-list bordered separator>
                <q-item
                  v-for="item in Object.keys(momentWeeks)"
                  :key="item"
                  clickable
                  v-close-popup
                  @click="weekSelected = item"
                >
                  <q-item-section>
                    <q-item-label>{{ item }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-section>
        </div>
        <div class="col-3">
          <q-card-section class="flex justify-end">
            <q-btn
              :disable="weekSelected === 'Semana'"
              color="blue-10"
              label="Filtrar"
              icon="filter_alt"
              @click="buildGrid"
            />
          </q-card-section>
        </div>
        <div class="col-12">
          <q-separator color="black"></q-separator>
          <q-separator color="black"></q-separator>
        </div>
        <div class="col-12 text-bold" v-if="gridInformation.length > 0">
          <q-card-section class="text-center">
            {{ momentWeeks[weekSelected].format }}
          </q-card-section>
          <q-card-section class="text-center">
            <div class="row">
              <div
                v-for="item in Object.keys(totalHours)"
                :key="item"
                class="col-3"
                style=""
              >
                {{ item }} tiene {{ totalHours[item] }} horas
              </div>
            </div>
          </q-card-section>
        </div>
        <div class="col-12">
          <q-separator color="black"></q-separator>
          <q-separator color="black"></q-separator>
        </div>
        <div
          v-for="item in gridInformation"
          v-bind:key="item.dateTitle"
          class="col-3 q-my-md q-mx-auto"
        >
          <q-list bordered separator>
            <q-item
              active
              active-class="active-color"
              class="justify-center text-bold"
            >
              {{ item.dateTitle }}
            </q-item>
            <q-item
              v-for="(element, index) in item.rows"
              :key="index"
              class="justify-center"
              active
              active-class="box-color"
            >
              <q-card-section horizontal style="border: 1px solid black">
                <q-card-section
                  :class="
                    element.notAssignedValue
                      ? 'negative-color'
                      : 'positive-color'
                  "
                  >{{ element.hourInterval }}</q-card-section
                >
                <q-card-section
                  :class="
                    element.firstPersonValue
                      ? 'first-color'
                      : element.secondPersonValue
                      ? 'second-color'
                      : element.thirdPersonValue
                      ? 'third-color'
                      : ''
                  "
                >
                  <q-icon
                    v-if="element.notAssignedValue"
                    name="warning"
                    color="yellow"
                    size="20px"
                  ></q-icon>
                  <span v-else>{{
                    element.firstPersonValue
                      ? element.firstPersonLabel
                      : element.secondPersonValue
                      ? element.secondPersonLabel
                      : element.thirdPersonLabel
                  }}</span>
                </q-card-section>
              </q-card-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card>
    <edit-dialog v-if="editDialog"></edit-dialog>
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
import EditDialog from "./EditDialog.vue";
import moment from "moment";
import { date } from "quasar";
moment.locale("es");
moment.updateLocale("es", {
  weekdays: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
});

export default defineComponent({
  name: "WorkShifts",
  components: {
    EditDialog,
  },
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const store = useStore();
    const contractSelected = ref("Contrato");
    const contractAndServices = ref({});
    const gridInformation = ref([]);
    const momentWeeks = ref({});
    const serviceSelected = ref({
      label: "Servicio",
      value: null,
    });
    const totalHours = ref({});
    const weekSelected = ref("Semana");

    // Obtener propiedades del store
    const editDialog = markRaw(
      computed(() => store.getters["workshifts/editDialog"])
    );
    const token = markRaw(computed(() => store.getters["auth/token"]));

    // Validar el cambio del modal y reinicializar variables locales para hacer una nueva búsqueda
    watch(
      () => editDialog.value,
      async (newValue) => {
        if (!newValue) {
          contractAndServices.value = {};
          gridInformation.value = [];
          totalHours.value = {};
          momentWeeks.value = {};
          weekSelected.value = "Semana";
          serviceSelected.value = {
            label: "Servicio",
            value: null,
          };
          contractSelected.value = "Contrato";
          await buildInitialView();
        }
      },
      { deep: true }
    );

    /**
     * Obtener información de la vista inicial
     */
    async function buildInitialView() {
      try {
        // Show componente de carga
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Preparando información inicial...",
        });

        // Obtener contratos
        const {
          data: { contracts },
        } = await app.$api.get("contracts", {
          headers: {
            contentType: "application/json; charset=utf-8",
            Authorization: `Bearer ${token.value}`,
          },
        });

        // Guardar información en el store
        store.commit("contracts/setContractList", contracts);

        // Construir información de los dropbox
        buildDropdownInformation(contracts);

        // Ocultar componente de carga
        app.$q.loading.hide();
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar obtener la información inicial",
          "error"
        );
      }
    }

    /**
     * Construye la información de los dropbox que aparecen en la vista.
     */
    function buildDropdownInformation(contracts) {
      // Obtener relación de contratos y servicios
      contracts.forEach((contract) => {
        const contractName = contract.contract_name;
        const service = {
          id: contract.service_id,
          serviceName: contract.service_name,
        };
        const schedule = {
          openCloseDay: contract.open_close_day.split("-"),
          openCloseSchedule: contract.open_close_schedule.split("-"),
        };

        if (!Object.keys(contractAndServices.value).includes(contractName)) {
          contractAndServices.value[contractName] = {
            id: contract.id,
            schedules: [schedule],
            services: [service],
          };
        } else {
          const serviceFounded = contractAndServices.value[contractName][
            "services"
          ].findIndex((item) => item.id === service.id);
          serviceFounded === -1 &&
            contractAndServices.value[contractName]["services"].push(service);
          contractAndServices.value[contractName]["schedules"].push(schedule);
        }
      });

      // Construir información de semanas
      let futureWeek = 7;
      let weekPosition = 1;
      do {
        // Obtener fecha futura, semana y año
        const futureDate = moment().add(futureWeek, "days");
        const week = futureDate.format("ww");
        const year = futureDate.format("gggg");

        // Guardar información
        momentWeeks.value[`Semana ${week} del ${year}`] = {
          startDate: futureDate.startOf("week"),
          endDate: futureDate.endOf("week"),
          format: `Del ${futureDate
            .startOf("week")
            .format("DD/MM/YYYY")} al ${futureDate
            .endOf("week")
            .format("DD/MM/YYYY")}`,
        };
        futureWeek += 7;
        weekPosition += 1;
      } while (weekPosition <= 5);
    }

    /**
     * Arma la información de las grillas de la vista
     */
    async function buildGrid() {
      try {
        gridInformation.value = [];

        // Show componente de carga
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Armando grillas...",
        });

        // Definir payload de búsqueda
        const payload = {
          contract_name: contractSelected.value,
          service_name: serviceSelected.value.label,
          week: weekSelected.value,
        };
        // Obtener turnos
        const {
          data: { shifts },
        } = await app.$api.post("shifts/filtered", payload, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        if (shifts.length === 0) {
          // Obtener usuarios
          const {
            data: { users },
          } = await app.$api.get("users", {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          });

          // Crear grilla Vacía
          buildEmptyGrid(users.map((item) => item.name).slice(0, 3));
        } else {
          buildFullGrid(shifts);
        }

        // Ocultar componente de carga
        app.$q.loading.hide();
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar obtener la información inicial",
          "error"
        );
      }
    }

    /**
     * Construye una grilla con información
     */
    function buildFullGrid(shifts) {
      let dateTitle = null;
      let rows = [];
      shifts.forEach((shift) => {
        let newShift = {
          contract: shift.contract_name,
          service: shift.service_name,
          dateTitle: shift.date_title,
          firstPersonLabel: shift.first_user_name,
          firstPersonValue: shift.first_user_value,
          notAssignedLabel: shift.not_name,
          notAssignedValue: shift.not_value,
          secondPersonLabel: shift.second_user_name,
          secondPersonValue: shift.second_user_value,
          thirdPersonLabel: shift.third_user_name,
          thirdPersonValue: shift.third_user_value,
          week: shift.week,
          hourInterval: shift.interval,
        };

        if (!dateTitle) {
          dateTitle = shift.date_title;
          rows.push(newShift);
          totalHours.value[newShift.firstPersonLabel] =
            newShift.firstPersonValue ? 1 : 0;
          totalHours.value[newShift.secondPersonLabel] =
            newShift.secondPersonValue ? 1 : 0;
          totalHours.value[newShift.thirdPersonLabel] =
            newShift.thirdPersonValue ? 1 : 0;
          totalHours.value[newShift.notAssignedLabel] =
            newShift.notAssignedValue ? 1 : 0;
        } else {
          if (dateTitle === shift.date_title) {
            rows.push(newShift);
          } else {
            gridInformation.value.push({
              dateTitle,
              rows,
            });
            dateTitle = shift.date_title;
            rows = [newShift];
          }
          totalHours.value[newShift.firstPersonLabel] +=
            newShift.firstPersonValue ? 1 : 0;
          totalHours.value[newShift.secondPersonLabel] +=
            newShift.secondPersonValue ? 1 : 0;
          totalHours.value[newShift.thirdPersonLabel] +=
            newShift.thirdPersonValue ? 1 : 0;
          totalHours.value[newShift.notAssignedLabel] +=
            newShift.notAssignedValue ? 1 : 0;
        }
      });
      gridInformation.value.push({
        dateTitle,
        rows,
      });
    }

    /**
     * Construye una grilla vacía.
     */
    function buildEmptyGrid(userNames) {
      // Obtener los horarios del contrato y las fechas de la semana
      const contractSchedules =
        contractAndServices.value[contractSelected.value].schedules;
      const startEndDate = momentWeeks.value[weekSelected.value];

      // Agregar esquema de horas por usuario
      userNames
        .concat(["Sin Asignar"])
        .forEach((name) => (totalHours.value[name] = 0));

      // Armar grilla por defecto
      contractSchedules.forEach((schedule) => {
        // Obtener arreglo de días permitidos
        let availableDays = moment
          .weekdays()
          .splice(1, 7)
          .concat([moment.weekdays().shift()]);
        const [openIndex, closeIndex] = [
          availableDays.lastIndexOf(schedule.openCloseDay[0]),
          availableDays.lastIndexOf(schedule.openCloseDay[1]),
        ];
        availableDays = availableDays.slice(openIndex, closeIndex + 1);

        // Construir cuadro de la semana
        for (let day = 0; day < 7; day++) {
          // Obtener fecha y darle el formato según sea el caso
          let date = startEndDate.startDate.startOf("week").add(day, "day");

          // Construir horas
          if (availableDays.includes(date.format("dddd"))) {
            let shifts = [];
            const dateTitle = `${date.format("dddd DD")} de ${date.format(
              "MMMM"
            )}`;

            let shift = {
              contract: contractSelected.value,
              service: serviceSelected.value.label,
              dateTitle,
              firstPersonLabel: userNames[0],
              firstPersonValue: false,
              notAssignedLabel: "Sin Asignar",
              notAssignedValue: true,
              secondPersonLabel: userNames[1],
              secondPersonValue: false,
              thirdPersonLabel: userNames[2],
              thirdPersonValue: false,
              week: weekSelected.value,
            };

            // Obtener horas
            let [openHour, closeHour] = [
              Number(schedule.openCloseSchedule[0]),
              Number(schedule.openCloseSchedule[1]),
            ];

            // Caso particular desde las 23:00 a las 00:00
            if (openHour > closeHour) {
              shifts.push({
                ...shift,
                hourInterval: "23:00-00:00",
              });
              totalHours.value[shift.notAssignedLabel] += 1;
            } else {
              do {
                const firstHour =
                  (openHour.toString().length === 2
                    ? `${openHour.toString()}`
                    : `0${openHour.toString()}`) + ":00";
                const secondHour =
                  openHour + 1 === 24
                    ? "-00:00"
                    : `-${(openHour + 1).toString()}:00`;
                shifts.push({
                  ...shift,
                  hourInterval: firstHour + secondHour,
                });
                totalHours.value[shift.notAssignedLabel] += 1;
                openHour += 1;
              } while (openHour < closeHour);
            }
            gridInformation.value.push({
              dateTitle,
              rows: shifts,
            });
          }
        }
      });
    }

    /**
     * Setea los valores para mostrar el modal correspondiente para la edición de turnos
     */
    function setDialogValues() {
      // Crear y enviar payload
      const payload = {
        contract: contractSelected.value,
        editDialog: true,
        period: momentWeeks.value[weekSelected.value].format,
        service: serviceSelected.value.label,
        week: weekSelected.value,
        workshiftList: gridInformation.value,
      };
      store.commit("workshifts/setEditDialog", payload);
    }

    onMounted(buildInitialView);

    return {
      contractSelected,
      contractAndServices,
      editDialog,
      gridInformation,
      momentWeeks,
      serviceSelected,
      totalHours,
      weekSelected,
      buildGrid,
      setDialogValues,
    };
  },
});
</script>

<style lang="scss" scoped>
.active-color {
  background-color: $yellow-11;
  color: black;
}
.box-color {
  background-color: $grey-3;
  color: black;
}
.first-color {
  background-color: $accent;
  color: black;
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
  color: black;
}
.third-color {
  background-color: $warning;
  color: black;
}
</style>
