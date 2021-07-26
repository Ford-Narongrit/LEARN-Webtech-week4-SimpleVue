<template>
  <div>
    <!-- chart -->
    <doughnut-chart :chart-data="datacollection" class="py-5" />

    <!-- select Date -->
    <div class="flex justify-center">
      <!-- startDate -->
      <div class="mx-2">
        <label for="datepicker" class="block text-center my-label">Start</label>
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
        <label for="datepicker" class="block text-center my-label">End</label>
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
    <div class="my-2">
      <button @click="updateChart()" class="my-button">Show</button>
      <button @click="clearform(), updateChart()" class="my-button-cancel">
        Clear
      </button>
    </div>

    <!-- table -->
    <payment-table :payment="tableData" />

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
          <label for="datepicker" class="block text-left my-label"
            >Select Date</label
          >
          <v-date-picker v-model="form.date" :model-config="modelConfig">
            <template v-slot="{ inputValue, inputEvents }">
              <input
                class="bg-white border px-2 py-1 rounded w-full"
                placeholder="MM /DD /YYYY"
                :value="inputValue"
                v-on="inputEvents"
              />
            </template>
          </v-date-picker>
        </div>

        <!-- status -->
        <div class="pb-4">
          <label for="status" class="block text-left my-label">Status</label>
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
          <label for="amount" class="block text-left my-label">Amount</label>
          <input
            v-model="form.amount"
            type="number"
            class="bg-white border px-2 py-1 rounded w-full"
          />
        </div>

        <!-- about -->
        <div class="pb-4">
          <label for="about" class="block text-left my-label">About</label>
          <input
            type="text"
            v-model="form.about"
            class="bg-white border px-2 py-1 rounded w-full"
          />
        </div>
        <button @click="saveData()" class="my-button-confirm">บันทึก</button>
        <button @click="clearform()" class="my-button-cancel">ยกเลิก</button>
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
      tableData: [],
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
    filterData: function() {
      if (this.selected.startDate === null || this.selected.endDate === null) {
        return this.sortedPayment;
      }
      const startDate = new Date(this.selected.startDate);
      const endDate = new Date(this.selected.endDate);

      return this.sortedPayment.filter((item) => {
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
        amount: parseFloat(this.form.amount),
        about: this.form.about,
      };
      if (
        payload.date === null ||
        payload.status === "" ||
        payload.amount === 0
      ) {
        this.alertMessage("error", "Invalid input");
        return;
      }
      await PaymentStore.dispatch("postData", payload);
      this.clearform();
      this.updateChart();
      this.alertMessage("success", "Save success");
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
      this.filterData.forEach((element) => {
        if (element.status === "income") {
          balance.income += element.amount;
        } else {
          balance.outcome += element.amount;
        }
      });
      if (this.filterData.length === 0) {
        this.alertMessage("error", "Oops! can't find data");
        return;
      }
      this.tableData = this.filterData;
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
      this.alertMessage("info", "Update")
    },
    alertMessage(status, msg) {
      const Toast = this.$swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      });
      let backgroundColor = "#fff";
      if (status === "success") {
        backgroundColor = "#D1FAE5";
      } else if (status === "error") {
        backgroundColor = "#FEE2E2";
      } else if (status === "info") {
        backgroundColor = "#EFF6FF";
      }
      Toast.fire({
        icon: status,
        title: msg,
        background: backgroundColor,
      });
    },
  },
};
</script>

<style></style>
