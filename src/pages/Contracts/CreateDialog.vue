<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="custom-width">
      <q-card-section class="row bg-blue-10 text-white">
        <div class="text-h6">Crear Contrato</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="store.commit('contracts/setShowDialog', false)"
        />
      </q-card-section>
      <q-separator></q-separator>
      <q-form class="q-gutter-none" @submit="createContract">
        <q-card-section class="q-pb-xs">
          <q-input
            color="black"
            bottom-slots
            clearable
            filled
            ref="contractName"
            v-model="contract.contractName"
            label="Nombre de la Empresa"
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
        <q-card-section class="q-py-xs">
          <q-select
            filled
            v-model="contract.serviceId"
            :options="serviceList"
            :option-value="
              (opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)
            "
            :option-label="
              (opt) =>
                Object(opt) === opt && 'service_name' in opt
                  ? opt.service_name
                  : '- Null -'
            "
            emit-value
            map-options
            label="Servicio"
            lazy-rules
            :rules="[(val) => val || 'Debes seleccionar el tipo de servicio']"
          ></q-select>
        </q-card-section>
        <q-card-section class="q-py-xs">
          <div class="row">
            <div class="col-5">
              <q-select
                filled
                v-model="contract.openDayId"
                :options="daysList"
                :option-value="
                  (opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)
                "
                :option-label="
                  (opt) =>
                    Object(opt) === opt && 'day_name' in opt
                      ? opt.day_name
                      : '- Null -'
                "
                emit-value
                map-options
                label="Día de Apertura"
                lazy-rules
                :rules="[
                  (val) => val || 'Debes seleccionar una fecha de apertura',
                ]"
              ></q-select>
            </div>
            <q-space></q-space>
            <div class="col-5">
              <q-select
                filled
                v-model="contract.closeDayId"
                :options="
                  daysList.filter(
                    (item) => !excludeCloseDays.includes(item.day_name)
                  )
                "
                :option-value="
                  (opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)
                "
                :option-label="
                  (opt) =>
                    Object(opt) === opt && 'day_name' in opt
                      ? opt.day_name
                      : '- Null -'
                "
                emit-value
                map-options
                label="Día de Cierre"
                lazy-rules
                :rules="[(val) => val || 'Debes seleccionar un día de cierre']"
              ></q-select>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-5">
              <q-select
                filled
                v-model="contract.openHourId"
                :options="schedulesList"
                :option-value="
                  (opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)
                "
                :option-label="
                  (opt) =>
                    Object(opt) === opt && 'time_name' in opt
                      ? opt.time_name
                      : '- Null -'
                "
                emit-value
                map-options
                label="Hora de Apertura"
                lazy-rules
                :rules="[
                  (val) => val || 'Debes seleccionar una hora de apertura',
                ]"
              />
            </div>
            <q-space></q-space>
            <div class="col-5">
              <q-select
                filled
                v-model="contract.closeHourId"
                :options="
                  schedulesList.filter(
                    (item) => !excludeCloseHours.includes(item.time_name)
                  )
                "
                :option-value="
                  (opt) => (Object(opt) === opt && 'id' in opt ? opt.id : null)
                "
                :option-label="
                  (opt) =>
                    Object(opt) === opt && 'time_name' in opt
                      ? opt.time_name
                      : '- Null -'
                "
                emit-value
                map-options
                label="Hora de Cierre"
                lazy-rules
                :rules="[
                  (val) => val || 'Debes seleccionar una hora de cierre',
                ]"
              />
            </div>
          </div>
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
  watch,
} from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "CreateDialog",
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const store = useStore();
    const contract = ref({
      contractName: "",
      closeDayId: null,
      closeHourId: null,
      openDayId: null,
      openHourId: null,
      serviceId: null,
    });
    const excludeCloseDays = ref([]);
    const excludeCloseHours = ref([]);
    const daysList = ref([]);
    const serviceList = ref([]);
    const schedulesList = ref([]);

    watch(
      () => contract.value.openDayId,
      (newValue) => {
        const indexFound = daysList.value.findIndex(
          (day) => day.id === newValue
        );
        excludeCloseDays.value = daysList.value
          .filter((_, index) => index <= indexFound)
          .map((item) => item.day_name);
      },
      { deep: true }
    );

    watch(
      () => contract.value.openHourId,
      async (newValue) => {
        const indexFound = schedulesList.value.findIndex(
          (day) => day.id === newValue
        );
        excludeCloseHours.value = schedulesList.value
          .filter((_, index) => index <= indexFound)
          .map((schedule) => schedule.time_name);
      },
      { deep: true }
    );

    // Obtener propiedades del store
    const showDialog = markRaw(
      computed(() => store.getters["contracts/showDialog"])
    );
    const token = markRaw(computed(() => store.getters["auth/token"]));

    /**
     * Crea la información de un contrato en la Base de Datos.
     */
    async function createContract() {
      try {
        // Show componente de carga
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Creando nuevo contrato...",
        });

        // Obtener valores necesarios para construir el payload que será enviado
        const [openDayName, closeDayName] = daysList.value
          .filter((day) =>
            [contract.value.openDayId, contract.value.closeDayId].includes(
              day.id
            )
          )
          .map((item) => item.day_name);
        const [openHourName, closeHourName] = schedulesList.value
          .filter((schedule) =>
            [contract.value.openHourId, contract.value.closeHourId].includes(
              schedule.id
            )
          )
          .map((item) => item.time_name);
        const payload = {
          contract_name: contract.value.contractName,
          service_id: contract.value.serviceId,
          open_close_day: openDayName + "-" + closeDayName,
          open_close_schedule: openHourName + "-" + closeHourName,
        };

        // Crear contrato
        let response = (
          await app.$api.post("contracts", payload, {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          })
        ).data;

        // Setear valores y cerrar
        store.commit("contracts/setContractItem", {
          ...response.contract,
          service_name: serviceList.value.find(
            (service) => service.id === response.contract.service_id
          ).service_name,
        });
        store.commit("contracts/setShowDialog", false);

        // Ocultar componente de carga
        app.$q.loading.hide();

        // Mostrar mensaje de éxito
        app.$Swal.fire(
          "Success",
          "El contrato fue creado con éxito",
          "success"
        );
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar crear el contrato en la Base de Datos",
          "error"
        );
      }
    }

    /**
     * Obtiene la información inicial de los listados de días y las horas
     */
    async function getInitialList() {
      try {
        // Obtener servicios, días y horas
        let [services, days, schedules] = await Promise.all([
          (
            await app.$api.get("services", {
              headers: {
                Authorization: `Bearer ${token.value}`,
              },
            })
          ).data.services,
          (
            await app.$api.get("days", {
              headers: {
                Authorization: `Bearer ${token.value}`,
              },
            })
          ).data.days,
          (
            await app.$api.get("schedules", {
              headers: {
                Authorization: `Bearer ${token.value}`,
              },
            })
          ).data.schedules,
        ]);

        // Asignar valores a variables globales
        serviceList.value = services;
        daysList.value = days;
        schedulesList.value = schedules;
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Hubo un error al intentar obtener los listados iniciales",
          "error"
        );
      }
    }

    onMounted(getInitialList);

    return {
      contract,
      excludeCloseDays,
      excludeCloseHours,
      daysList,
      serviceList,
      schedulesList,
      store,
      showDialog,
      createContract,
    };
  },
});
</script>
<style lang="scss" scoped>
.custom-width {
  width: 600px;
  height: 510px;
}
</style>
