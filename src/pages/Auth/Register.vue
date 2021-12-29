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
            <q-avatar size="70px" class="avatar-login" color="blue">
              <img src="~assets/security.png" />
            </q-avatar>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">CREAR CUENTA</div>
            </div>
          </q-card-section>
          <q-form class="q-gutter-none">
            <q-card-section>
              <q-input
                color="white"
                bottom-slots
                clearable
                filled
                ref="name"
                v-model="credentials.name"
                label="Nombre"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon color="white" name="spellcheck" size="sm" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section>
              <q-input
                color="white"
                bottom-slots
                clearable
                filled
                ref="lastname"
                v-model="credentials.lastname"
                label="Apellido"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon color="white" name="spellcheck" size="sm" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section>
              <q-input
                color="white"
                bottom-slots
                clearable
                filled
                ref="email"
                v-model="credentials.email"
                label="Correo"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon color="white" name="person" size="sm" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section>
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
              <q-btn label="Iniciar Sesión" to="/auth/login" no-caps flat />
              <q-space />
              <q-btn
                color="black"
                label="Crear"
                to="/auth/login"
                type="button"
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Register",
  setup() {
    const credentials = ref({
      name: "",
      lastname: "",
      email: "",
      password: "",
      role_id: "",
    });
    const isPwd = ref(true);
    const particleItems = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    return {
      credentials,
      isPwd,
      particleItems,
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
