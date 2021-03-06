<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="animated-background"></div>
        <div class="animated-particles">
          <div
            v-for="item in particleItems"
            :key="item"
            class="particles"
          ></div>
        </div>
        <q-card class="login-form">
          <q-card-section>
            <q-avatar size="70px" class="avatar-login">
              <img src="~assets/security.png" />
            </q-avatar>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">INICIAR SESIÓN</div>
            </div>
          </q-card-section>
          <q-form class="q-gutter-none" @submit="signIn">
            <q-card-section class="q-py-xs">
              <q-input
                color="white"
                bottom-slots
                clearable
                filled
                ref="email"
                v-model="credentials.email"
                label="Correo"
                type="email"
                lazy-rules
                :rules="[
                  (val) =>
                    val.length > 0 || 'Debes colocar un correo electrónico',
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
            <q-card-actions class="q-pa-md">
              <q-btn label="Crear Cuenta" to="/auth/register" no-caps flat />
              <q-space />
              <q-btn color="blue-10" label="Iniciar" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, getCurrentInstance, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Login",
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const store = useStore();
    const credentials = ref({
      email: "josemacloud@gmail.com",
      password: "123456",
    });
    const isPwd = ref(true);
    const emailRegExp = new RegExp("^[^@]+@[^@]+\.[a-zA-Z]{2,}$");
    const particleItems = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    /**
     * Permite iniciar sesión para entrar al dashboard.
     */
    async function signIn() {
      try {
        // Show componente de carga
        app.$q.loading.show({
          spinner: app.$QSpinnerGears,
          spinnerColor: "white",
          spinnerSize: 100,
          messageColor: "white",
          backgroundColor: "black",
          message: "Verificando credenciales...",
        });

        // Obtener información de la autenticación
        const {
          data: { token, user },
        } = await app.$api.post("login", credentials.value);

        // Guardar información en el store
        store.commit("auth/setToken", token);
        store.commit("auth/setUser", user);

        // Redireccionar
        app.$router.push("/work-shifts");

        // Ocultar componente de carga
        app.$q.loading.hide();
      } catch (error) {
        app.$q.loading.hide();
        console.trace(error);
        app.$Swal.fire(
          "Error",
          "Las credenciales otorgadas no son válidas o el usuario ingresado no se encuentra registrado",
          "error"
        );
      }
    }

    return {
      credentials,
      emailRegExp,
      isPwd,
      particleItems,
      signIn,
    };
  },
});
</script>

<style lang="scss">
.avatar-login {
  position: absolute;
  top: 0;
  right: 260px;
  transform: translateY(-50%);
}

.animated-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  background-color: #000;
}

.login-form {
  position: absolute;
  width: 40%;
  max-width: 600px;
  background: rgba($color: $blue-5, $alpha: 0.9);
  color: white;
}

.particles {
  border-radius: 50%;
  background: #fff;
  opacity: 0.3;
  position: absolute;
  bottom: -150;
  animation: animated-particles 3s linear infinite;
}

.particles:nth-child(1) {
  width: 80px;
  height: 80px;
  animation-duration: 3s;
  animation-delay: 3s;
  left: 5%;
}

.particles:nth-child(2) {
  width: 100px;
  height: 100px;
  animation-duration: 3s;
  animation-delay: 5s;
  left: 35%;
}

.particles:nth-child(3) {
  width: 20px;
  height: 20px;
  animation-duration: 1.5s;
  animation-delay: 7s;
  left: 15%;
}

.particles:nth-child(4) {
  width: 50px;
  height: 50px;
  animation-duration: 6s;
  animation-delay: 3s;
  left: 90%;
}

.particles:nth-child(5) {
  width: 70px;
  height: 70px;
  animation-duration: 3s;
  animation-delay: 1s;
  left: 65%;
}

.particles:nth-child(6) {
  width: 20px;
  height: 20px;
  animation-duration: 4s;
  animation-delay: 5s;
  left: 50%;
}

.particles:nth-child(7) {
  width: 20px;
  height: 20px;
  animation-duration: 4s;
  animation-delay: 5s;
  left: 50%;
}

.particles:nth-child(8) {
  width: 100px;
  height: 100px;
  animation-duration: 5s;
  animation-delay: 5s;
  left: 52%;
}

.particles:nth-child(9) {
  width: 65px;
  height: 65px;
  animation-duration: 3s;
  animation-delay: 2s;
  left: 51%;
}

.particles:nth-child(10) {
  width: 40px;
  height: 40px;
  animation-duration: 3s;
  animation-delay: 4s;
  left: 35%;
}

@keyframes animated-particles {
  0% {
    bottom: 0;
    opacity: 0;
  }
  30% {
    transform: translateX(30px);
  }
  50% {
    opacity: 0.4;
  }
  100% {
    bottom: 100vh;
    opacity: 0;
  }
}
</style>
