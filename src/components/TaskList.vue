<template>
  <div>
    <h1 class="title_list_opros">Список опросов</h1>

    <hr />

    <div
      :class="['modal modaldelListitem', open ? 'open' : '']"
      :style="[open ? modalStyle : '']"
    >
      <div class="modal-content">
        <h4 class="delTask_title">Подтвердить удаление</h4>

        <div class="controls-finish">
          <button v-on:click="delFinish" class="btn atom_btn">Да</button>
          <button v-on:click="noDelTask" class="btn atom_btn">Нет</button>
        </div>
      </div>
    </div>

    <div class="list_tasks-items" v-if="surveys.length">
      <!-- перебираем в цикле опросы -->
      <div class="taks_itemI" v-for="(item, index) in surveys" :key="index">
        <span class="taks_itemI__title">{{ item.info.otherinfo.title }}</span>
        {{ item.info.otherinfo.date.seconds | moment }}
        <router-link
          tag="button"
          class="btn btn-small atom_btn"
          :to="{
            name: 'task',
            params: { searchTags: item, id: item.id },
          }"
        >
          Открыть
        </router-link>
        <button
          v-on:click="delTask"
          v-bind:id-task="item.id"
          v-bind:index="index"
          class="deltaks btn red darken-1 btn-small"
        >
          Удалить
        </button>
      </div>
    </div>
    <!-- перебираем в цикле опросы -->
    <p v-else>Нет опросов</p>
  </div>
</template>

<script>
import firebase from "firebase/app"; //библиотека для работы с базой, ниже его компоненты
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import moment from "moment";

export default {
  data: () => ({
    open: false,
    modalStyle: {
      "z-index": 1003,
      display: "block",
      opacity: 1,
      transform: "scaleX(1); top: 10%",
    },
    surveys: "", //Объект со списком опросов
    showModal: false,
    nowIdTaks: "",
    nowIndexTask: "",
  }),
  computed: {
    tasks() {
      return this.$store.getters.tasks; //подгружение обновленных данных
    },
  },
  mounted() {
    window.M.FormSelect.init(this.$refs.select);
  },
  beforeCreate() {
    const db = firebase.firestore();
    db.collection("surveys") //получение опросов из бады данных
      .get()
      .then((querySnapshot) => {
        let dataopros = [];
        querySnapshot.forEach((doc) => {
          let getDataInArray = doc.data();
          let newData = {
            id: doc.id,
            info: getDataInArray,
          };
          dataopros.push(newData);
        });
        this.surveys = dataopros;
      });
  },
  filters: {
    moment: function (date) {
      return moment.utc(date*1000).format('YYYY-MM-DD');
    }
  },
  methods: {
    delTask(e) {
      this.open = false;
      this.open = true;
      let idTask = e.target.getAttribute("id-task");
      let IndexTask = e.target.getAttribute("index");
      this.nowIdTaks = idTask;
      this.nowIndexTask = IndexTask;
    },
    delFinish() {
      let idTask = this.nowIdTaks;
      this.surveys.splice(this.nowIndexTask, 1);
      this.showModal = false;
      this.open = false;

      const db = firebase.firestore(); //удаление опроса из базы по id
      db.collection("surveys")
        .doc(idTask)
        .delete()
        .then(() => {
          console.log("Опрос удален");
        })
        .catch((error) => {
          console.error("Ошибка при удалении опроса: ", error);
        });
    },
    noDelTask() { //закрываем модалку
      this.showModal = false;
      this.open = false;
    },
    moment: function () {
      return moment(); //инициалтзация библиотеки момент для преобразованяи даты
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>