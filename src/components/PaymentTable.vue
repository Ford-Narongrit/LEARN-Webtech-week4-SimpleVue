<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>date</th>
          <th>income</th>
          <th>about</th>
          <th>expenditure</th>
          <th>about</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in payment" :key="index">
          <td>{{ item.date }}</td>
          <td>{{ item.income }}</td>
          <td>{{ item.incomeAbout }}</td>
          <td>{{ item.expenditure }}</td>
          <td>{{ item.expenditureAbout }}</td>
        </tr>
      </tbody>
      <tr v-if="!isAdd">
        <td><input type="date" v-model="form.date" /></td>
        <td><input type="number" v-model="form.income" /></td>
        <td><input type="text" v-model="form.incomeAbout" /></td>
        <td><input type="number" v-model="form.expenditure" /></td>
        <td><input type="text" v-model="form.expenditureAbout" /></td>
        <td>
          <button @click="addData">Enter</button>
        </td>
        <td>
          <button @click="closeForm">cancel</button>
        </td>
      </tr>

      <div v-if="isAdd">
        <button @click="isAdd = !isAdd">Add</button>
      </div>

      <tfoot>
        <tr>
          <td>รวม</td>
          <td>{{ total.income }}</td>
          <td>รวม</td>
          <td>{{ total.expenditure }}</td>
          <td>คงเหลือ</td>
          <td>{{ total.balance }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import PaymentStore from "../store/index.js";
import moment from 'moment'

export default {
  data() {
    return {
      isAdd: true,
      payment: [],
      total: {
        income: 0,
        expenditure: 0,
        balance: 0,
      },
      form: {
        date: "",
        income: 0,
        incomeAbout: "",
        expenditure: 0,
        expenditureAbout: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      await PaymentStore.dispatch("fetchData");
      this.payment = PaymentStore.getters.paymentData;

      this.totalPayment();
    },
    addData() {
      let payload = {
        date: moment(this.form.date).format('DD/MM/YYYY'),
        income: parseFloat(this.form.income),
        incomeAbout: this.form.incomeAbout,
        expenditure: parseFloat(this.form.expenditure),
        expenditureAbout: this.form.expenditureAbout,
      };
      // console.log(payload);
      PaymentStore.dispatch("postData", payload);
      this.closeForm();
      this.totalPayment();
    },
    closeForm() {
      this.isAdd = true;
      this.form = {
        date: "",
        income: 0,
        incomeAbout: "",
        expenditure: 0,
        expenditureAbout: "",
      };
    },
    totalPayment() {
      this.total = {
        income: 0,
        expenditure: 0,
        balance: 0,
      };
      this.payment.forEach((element) => {
        this.total.income += element.income;
        this.total.expenditure += element.expenditure;
      });
      this.total.balance = this.total.income - this.total.expenditure;
    },
  },
};
</script>

<style></style>
