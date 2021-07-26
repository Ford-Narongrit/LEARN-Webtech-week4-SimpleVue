<template>
  <div>
    <!-- chart -->
    <doughnut-chart :chart-data="datacollection" class="py-5" />

    <!-- select Date -->
    <div class="flex justify-center">
      <!-- startDate -->
      <div class="mx-2">
        <label for="datepicker" class="block text-left text-center"
          >Select startDate</label
        >
        <v-date-picker v-model="selected.startDate" :model-config="modelConfig">
          <template v-slot="{ inputValue, inputEvents }">
            <input
              class="bg-white border px-2 py-1 rounded w-full"
              placeholder="MM / DD /YYYY"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </v-date-picker>
      </div>
      <!-- endDate -->
      <div class="mx-2">
        <label for="datepicker" class="block text-left text-center"
          >Select endDate</label
        >
        <v-date-picker v-model="selected.endDate" :model-config="modelConfig">
          <template v-slot="{ inputValue, inputEvents }">
            <input
              class="bg-white border px-2 py-1 rounded w-full"
              placeholder="MM / DD /YYYY"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </v-date-picker>
      </div>
    </div>
    <div>
      <button @click="updateChart()" class="my-button my-2">Show</button>
    </div>

    <!-- table -->
    <payment-table :payment="sortedPayment" />

    <!-- add button -->
    <button @click="isAdd = true" class="my-button">
      บันทึกเพิ่ม +
    </button>

    <!-- input -->
    <div
      v-if="isAdd"
      class="justify-center items-center flex fixed inset-0 z-0 outline-none focus:outline-none"
    >
      <button
        class="bg-black w-screen h-screen opacity-50 absolute cursor-default"
        @click="clearform()"
      ></button>
      <div class="bg-gray-300 p-10 rounded-lg z-10 animate-fade-in-down">
        <!-- date -->
        <div class="pb-4">
          <label for="datepicker" class="block text-left">Select Date</label>
          <v-date-picker v-model="form.date" :model-config="modelConfig">
            <template v-slot="{ inputValue, inputEvents }">
              <input
                class="bg-white border px-2 py-1 rounded w-full"
                placeholder="DD /MM /YYYY"
                :value="inputValue"
                v-on="inputEvents"
              />
            </template>
          </v-date-picker>
        </div>

        <!-- status -->
        <div class="pb-4">
          <label for="status" class="block text-left">Status</label>
          <select
            v-model="form.status"
            name="status"
            id="status"
            class="bg-white border px-2 py-2 rounded w-full"
          >
            <option value="income">income</option>
            <option value="outcome">outcome</option>
          </select>
        </div>

        <!-- amount -->
        <div class="pb-4">
          <label for="amount" class="block text-left">Amount</label>
          <input
            v-model="form.amount"
            type="number"
            class="bg-white border px-2 py-1 rounded w-full"
          />
        </div>

        <!-- about -->
        <div class="pb-4">
          <label for="about" class="block text-left">About</label>
          <input
            type="text"
            v-model="form.about"
            class="bg-white border px-2 py-1 rounded w-full"
          />
        </div>
        <button @click="saveData()" class="my-button">บันทึก</button>
        <button @click="clearform()" class="my-button">ยกเลิก</button>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentStore from "../store/index.js";
import DoughnutChart from "./Doughnut.vue";
import PaymentTable from "./PaymentTable.vue";

export default {
  data() {
    return {
      payment: [],
      isAdd: false,
      form: {
        date: null,
        status: "",
        amount: 0,
        about: "",
      },
      modelConfig: {
        type: "string",
        mask: "MM-DD-YYYY",
      },
      datacollection: null,
      selected: {
        startDate: null,
        endDate: null,
      },
    };
  },
  components: {
    DoughnutChart,
    PaymentTable,
  },
  created() {
    this.fetchData();
  },
  computed: {
    sortedPayment: function() {
      this.payment.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      return this.payment;
    },
    filterDate: function() {
      if (this.selected.startDate === null || this.selected.endDate === null) {
        return this.payment;
      }
      const startDate = new Date(this.selected.startDate);
      const endDate = new Date(this.selected.endDate);

      return this.payment.filter((item) => {
        const itemDate = new Date(item.date);
        if (startDate !== null && endDate !== null) {
          return startDate <= itemDate && itemDate <= endDate;
        }
        if (startDate !== null && endDate === null) {
          return startDate <= itemDate;
        }
        if (startDate === null && endDate !== null) {
          return itemDate <= endDate;
        }
        return true;
      });
    },
  },
  methods: {
    async fetchData() {
      await PaymentStore.dispatch("fetchData");
      this.payment = PaymentStore.getters.paymentData;
      this.updateChart();
    },
    async saveData() {
      let payload = {
        date: this.form.date,
        status: this.form.status,
        amount: parseInt(this.form.amount),
        about: this.form.about,
      };
      await PaymentStore.dispatch("postData", payload);
      this.clearform();
      this.updateChart();
    },
    clearform() {
      this.isAdd = false;
      this.form.date = null;
      this.form.status = "";
      this.form.amount = 0;
      this.form.about = "";
      this.selected.startDate = null;
      this.selected.endDate = null;
    },
    updateChart() {
      const balance = {
        income: 0,
        outcome: 0,
      };
      this.filterDate.forEach((element) => {
        if (element.status === "income") {
          balance.income += element.amount;
        } else {
          balance.outcome += element.amount;
        }
      });
      this.datacollection = {
        labels: ["income", "outcome"],
        datasets: [
          {
            borderWidth: 1,
            borderColor: ["rgba(52, 211, 153, 1)", "rgba(248, 113, 113, 1)"],
            backgroundColor: [
              "rgba(52, 211, 153, 0.2)",
              "rgba(248, 113, 113, 0.2)",
            ],
            data: [balance.income, balance.outcome],
          },
        ],
      };
    },
  },
};
</script>

<style></style>
