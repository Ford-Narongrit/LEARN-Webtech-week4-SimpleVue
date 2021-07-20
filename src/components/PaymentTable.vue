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
          <td>{{item.date}}</td>
          <td>{{item.income}}</td>
          <td>{{item.incomeAbout}}</td>
          <td>{{item.expenditure}}</td>
          <td>{{item.expenditureAbout}}</td>
        </tr>
      </tbody>
    </table>
    <div>
      เงินรวม: 100 บาท
    </div>
  </div>
</template>

<script>
import PaymentStore from "../store/index.js";
export default {
  data() {
    return {
      payment: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      await PaymentStore.dispatch("fetchData");
      this.payment = PaymentStore.getters.paymentData;
    },
  },
};
</script>

<style></style>
