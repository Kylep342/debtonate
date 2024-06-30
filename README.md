# Debtonate

![{{build status}}](https://github.com/Kylep342/debtonate/workflows/deploy/badge.svg)


Debtonate is a simple, visual, data-rich financial calculator for budgeting repayment of debt


## To Complete

 - Fix presentation of modals:
    - disable base overflow (let content scroll itself)
    - adjust witdth to be width of largest child
 - Disable full-page scrolling
 - Finish DetailsPanel
  - Adapt to a 'category by a focus' style
   - style
    - budgets by a loan
    - loans by a budget
   - Tabs run by category for a given focus
    - Each tab displays the correct Amortization Table
   - Table contains with vertical scroll, preserving header and footer rows
 - Learn to graph with D3
 - FIN!


## next UP

<ul>
<li>
<s>
TABS
Can do easy with some lil hacking

Pseudo-code:

```Vue
<script setup>

</script>

<template>
    <div class="tabframe">
        <div class="tabs">
            <div v-for="(budget, index) in monthlyBudgets" class="join join-horizontal">
                <base-button class="join-item" @click=setActiveTab(budget.id)>{{ budgetPrimitives.getBudgetName(budget.id) }}</base-button>
            </div>
        </div>
        <div name="tabscontent" class="w-auto">
            <div v-for="(budget, index) in monthlyBudgets">
            <AmortizationTable... v-show="budget.id === activeTab"/>
        </div>
    </div>
</template>
```
</s>
</li>


<s><li>
Take a step back and clean up the table:
Make the title and subtitle pretty and informative
Title: `Amortization Table - Loan X | Budget Y`
Subtitle: `(P | Pmt | Interest | Num Payments)`: </li></s>

<li>
Clean up the presentation of tabs:
 - make modal as wide as table
 - make table scroll vertically (set a max height)
</li>

<li>
Clean up the presentation of base objects:
 - ensure that everything has a min size, but certain things fill to contain widest child (vertical scroll is good)
 - set base objects to have a max height
</li>

<li></li>
</ul>