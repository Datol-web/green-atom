<template>
  <div class="block_auth">
    <h1 class="title_app">Конструктор опросов</h1>
    <form class="card auth-card" @submit.prevent="submitHandler">
      <div class="card-content">
        <span class="card-title">Авторизуйтесь</span>
        <div class="input-field">
          <input
            id="email"
            type="text"
            class="validate"
            v-model.trim="email"
            :class="{
              invalid:
                ($v.email.$dirty && !$v.email.required) ||
                ($v.email.$dirty && !$v.email.email),
            }"
          />
          <label for="email">Email</label>
          <small
            class="helper-text invalid"
            v-if="$v.email.$dirty && !$v.email.required"
            >Введите Email</small
          >
          <small
            class="helper-text invalid"
            v-else-if="$v.email.$dirty && !$v.email.email"
            >Введите корректный email</small
          >
        </div>
        <div class="input-field">
          <input
            id="password"
            type="password"
            class="validate"
            v-model.trim="password"
            :class="{
              invalid:
                ($v.password.$dirty && !$v.password.required) ||
                ($v.password.$dirty && !$v.password.minLength),
            }"
          />
          <label for="password">Пароль</label>
          <small
            class="helper-text invalid"
            v-if="$v.password.$dirty && !$v.password.required"
            >Введите пароль</small
          >
          <small
            class="helper-text invalid"
            v-else-if="$v.password.$dirty && !$v.password.minLength"
            >Пароль должен быть
            {{ $v.password.$params.minLength.min }} символов. Сейчас он
            {{ password.length }}</small
          >
        </div>
      </div>
      <div class="card-action">
        <div>
          <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
          >
            Войти
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>


<script>
import { email, required, minLength } from "vuelidate/lib/validators"; //тут мы подключаем валидатор и вызываем его методы

export default {
  name: "Login",
  data: () => ({
    email: "", // дефолтное пустое значение
    password: "", // дефолтное пустое значение
  }),
  validations: {
    email: { email, required }, //передаем данные в валидатор
    password: { required, minLength: minLength(6) }, //передаем данные в валидатор (6 это длинна пароля)
  },
  methods: {
    async submitHandler() {
      //асинхронный метод авторизации
      if (this.$v.$invalid) {
        //проверка на валидность данных
        this.$v.$touch();
        return;
      }
      const formData = {
        //формируем объект с данными
        email: this.email,
        password: this.password,
      };

      try {
        await this.$store.dispatch("login", formData); //делаем запрос, если он удачный, то перенаправляет на страницу с опросами
        this.$router.push("/list");
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
</style>
