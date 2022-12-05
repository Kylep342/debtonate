<script>
export default {
  props: ['principal', 'effectiveRate', 'minimumPayment'],
};
</script>

<template>
  <div>
    <div :class="['cardHeader', 'header']">
      <h2 class="cardHeaderTitle">
        Totals
      </h2>
    </div>
    <div class="cardBody">
      <table class="">
        <tr>
          <td class="textLeft">Principal</td>
          <td class="textRight"><b>${{ this.principal.toFixed(2) }}</b></td>
        </tr>
        <tr>
          <td class="textLeft">Effective Rate</td>
          <td class="textRight"><b>{{ (this.effectiveRate * 100).toFixed(2) }}%</b></td>
        </tr>
        <tr>
          <td class="textLeft">Minimum Payment</td>
          <td class="textRight"><b>${{ this.minimumPayment.toFixed(2) }}</b></td>
        </tr>
      </table>
    </div>
    <div :class="['cardFooter', 'footer']">
      <!-- <div class="cardFooterButtonContainer">
        <button @click="this.viewLoan(this.loan.id)">View</button>
      </div> -->
    </div>
  </div>
</template>
