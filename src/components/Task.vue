<template>
  <div class="row">
    <div v-if="!surveyNow.length">
      <div v-if="showblock == true" class="task_item">
        <div v-if="surveyNow.otherinfo">
          <h1>Тема опроса: {{ surveyNow.otherinfo.title }}</h1>
          <p
            class="description_task"
            v-if="surveyNow.otherinfo.description.length"
          >
            Описание: {{ surveyNow.otherinfo.description }}
          </p>
        </div>
        <div v-else>
          <p style="text-align: center">Идет загрузка</p>
        </div>

        <div
          class="title_qw"
          v-for="surveyI of surveyNow.data"
          :key="surveyI.id"
        >
          <div class="titleVariants">
            {{ surveyI.itemopros.title }}
          </div>

          <div v-for="user in surveyI.itemopros.variants" :key="user.key">
            <label>
              <input
                type="checkbox"
                v-bind:value="user"
                v-model="checkedNames"
              />
              <span class="title_qw-item">{{ user.variantinfo }}</span>
            </label>
          </div>
        </div>

        <div class="finish">
          <a @click="finish" class="atom_btn waves-effect waves-light btn-large"
            >Готово</a
          >
        </div>
      </div>

      <div class="task_item finish_step" v-else>
        <!-- Modal Structure -->
        <div
          :class="['modal', open ? 'open' : '']"
          :style="[open ? modalStyle : '']"
        >
          <div class="modal-content">
            <div v-if="openSendExel == false">
              <h4>Отправить результаты на почту</h4>
              <form>
                <input type="text" placeholder="Ваше имя" />
                <input type="text" placeholder="email" />
                <button class="btn atom_btn" v-on:click.stop.prevent="send">
                  Отправить результаты на почту
                </button>
              </form>
              <button class="btn atom_btn" @click="step1">Отмена</button>
            </div>

            <div v-else>
              <div class="">
                <h5>Введите ФИО</h5>
                <input v-model="entername" placeholder="ФИО" type="text" />
                <download-excel
                  v-if="entername.length"
                  :data="checkedNames"
                  :class="['downloadExelbtn', exelbtn ? 'open' : '']"
                  :name="`${
                    entername +
                    ' ' +
                    'Тема:' +
                    surveyNow.otherinfo.title +
                    ' ' +
                    moment(surveyNow.otherinfo.date).format('YYYY-MM-DD')
                  }.xls`"
                >
                  <a class="waves-effect waves-light btn atom_btn">Экспорт в Excel</a>
                </download-excel>
                <button @click="CloseModal" class="atom_btn btn btn-small">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>

        <h3 class="finish_step__title">Опрос пройден</h3>
        <h4 class="finish_step__title">
          Вы можете отправить результат на почту или сохранить в файл</h4>
        <div class="controls-finish">
          <button class="atom_btn btn modal-trigger" @click="showModal">
            Отправить на почту
          </button>
          <button @click="saveExel" class="atom_btn btn">Экспорт в Exel</button>
        </div>
      </div>
    </div>
    <div v-else>Ошибка</div>
  </div>
</template>

<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel"; //библиотека для сохрарения в exel
import moment from "moment"; // библиотека для работы с временем
import firebase from "firebase/app"; //библиотека для работы с базой, ниже его компоненты
import "firebase/auth";
import "firebase/database"; //компоненты firebase
import "firebase/firestore";

Vue.component("downloadExcel", JsonExcel);

export default {
  data() {
    return { //свойства объектов
      id: this.$route.params["id"],
      surveyNow: "",
      checkedNames: [],
      showblock: true,
      open: false,
      modalStyle: {
        "z-index": 1003,
        display: "block",
        opacity: 1,
        transform: "scaleX(1); top: 10%",
      },
      entername: "",
      openSendExel: false,
      exelbtn: false,
    };
  },
  mounted() {
    window.M.Modal.init("#modal1"); //инициализация модалки

    const db = firebase.firestore();//подключение к бд для рендеринга опроса по id
    db.collection("surveys")
      .doc(this.id)
      .get()
      .then((doc) => {
        console.log("пришел ответ", doc);
        this.surveyNow = doc.data();
      })
      .catch((error) => {
        console.error("Ошибка: ", error);
      });
  },
  methods: {
    finish() {
      if (!this.checkedNames.length == 0) {
        const db = firebase.firestore();
        db.collection("results").add({
          //добавление в базу
          data: this.checkedNames,
          title: this.surveyNow.otherinfo.title,
        });
        this.showblock = false; //при завершении скрываем пройденный опрос
      } else {
        alert("Необходимо пройти опрос");
      }
    },
    showModal() {
      //открытие модалки, если в опросе не выбран хотя бы одни ответ, то будет вываливаться в ошибку
      if (!this.checkedNames.length == 0) {
        this.open = true;
      } else {
        alert("Необходимо пройти опрос");
      }
    },
    step1() {// закрытие модалки
      this.open = false;
    },
    moment: function () {
      return moment(); //инициализация библиотеки для работы с датой
    },
    saveExel() {
      this.open = true;
      this.openSendExel = true;
    },
    CloseModal() {// закрытие модалки Excel
      this.openSendExel = false;
      this.open = false;
    },
    send() { //кнопка отправки на почту
      this.$router.push("/list");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>