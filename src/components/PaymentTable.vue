<template>
  <div>
    <!-- table -->
    <div class="inline-flex">
      <table class="table-auto font-mitr">
        <thead>
          <tr class="bg-gray-800 text-gray-100 uppercase">
            <th class="py-3 px-24 text-center">date</th>
            <th class="py-3 px-24 text-center">status</th>
            <th class="py-3 px-24 text-center">amount</th>
            <th class="py-3 px-24 text-center">about</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr
            v-for="(item, index) in payment"
            :key="index"
            class="hover:bg-gray-400"
            :class="[index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-300']"
          >
            <td class="py-3 px-6 text-center">{{ item.date }}</td>
            <td class="py-3 px-6 text-center">
              <span
                class="rounded-lg px-2"
                :class="[
                  item.status === 'income' ? 'bg-green-400' : 'bg-red-400',
                ]"
              >
                {{ item.status }}
              </span>
            </td>
            <td class="py-3 px-6 text-center">฿ {{ item.amount }}</td>
            <td class="py-3 px-6 text-left">{{ item.about }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- balance -->
    <div class="text-2xl text-gray-700 p-10">
      balance:
      <span class="text-gray-800 font-bold">{{ balance }}</span>
    </div>

    <!-- input -->
    <div class="max-w-xs mx-auto">
      <button
        v-if="!isAdd"
        @click="isAdd = true"
        class="bg-gray-800 text-gray-100 py-4 px-10 font-mitr font-bold text-xl rounded-xl hover:bg-gray-700"
      >
        บันทึกเพิ่ม +
      </button>
      <div v-if="isAdd">
        <!-- date -->
        <div class="pb-4">
          <label for="datepicker" class="block text-left">Select Date</label>
          <v-date-picker
            v-model="form.date"
            :model-config="modelConfig"
          >
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

        <button
          @click="saveData()"
          class="bg-gray-800 text-gray-100 mx-3 py-4 px-10 font-mitr font-bold text-xl  rounded-xl hover:bg-gray-700"
        >
          บันทึก
        </button>
        <button
          @click="clearform()"
          class="bg-gray-800 text-gray-100 mx-3 py-4 px-10 font-mitr font-bold text-xl rounded-xl hover:bg-gray-700"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentStore from "../store/index.js";

export default {
  data() {
    return {
      payment: [],
      balance: 0,
      isAdd: false,
      form: {
        date: null,
        status: "",
        amount: 0,
        about: "",
      },
      modelConfig: {
        type: "string",
        mask: "DD/MM/YYYY",
      },
    };
  },
  async created() {
    await this.fetchData();
    await this.calBalance();
  },
  methods: {
    async fetchData() {
      await PaymentStore.dispatch("fetchData");
      this.payment = PaymentStore.getters.paymentData;
    },
    calBalance() {
      this.balance = 0;
      this.payment.forEach((item) => {
        if (item.status === "income") {
          this.balance += item.amount;
        } else if (item.status === "outcome") {
          this.balance -= item.amount;
        }
      });
    },
    clearform() {
      this.isAdd = false;
      this.form.selectedDate = null;
      this.form.status = "";
      this.form.amount = 0;
      this.form.about = "";
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
      this.calBalance();
    },
  },
};
</script>

<style></style>
