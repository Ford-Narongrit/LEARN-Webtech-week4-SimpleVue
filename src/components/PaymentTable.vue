<template>
  <div>
    <div class="text-2xl text-gray-700 p-10">
      balance:
      <span class="text-gray-800 font-bold">{{
        balance.income - balance.outcome
      }}</span>
    </div>
    <!-- table -->
    <div class="inline-flex pb-10">
      <table class="table-auto font-mitr">
        <thead>
          <tr class="bg-gray-800 text-gray-100 my-label">
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
            <td class="py-3 px-6 text-center">{{ reFormat(item.date) }}</td>
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
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    payment: {
      type: Array,
      default: null,
    },
  },
  computed: {
    balance: function() {
      const balance = {
        income: 0,
        outcome: 0,
      }
      this.payment.forEach((element) => {
        if (element.status === "income") {
          balance.income += element.amount;
        } else {
          balance.outcome += element.amount;
        }
      });
      return balance
    },
  },
  methods: {
    reFormat(date) {
      return moment(new Date(date)).format("DD/MM/YYYY");
    },
  },
};
</script>

<style></style>
