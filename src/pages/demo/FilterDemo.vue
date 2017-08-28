<template>
  <div>
    <table class="el-date-table table">
      <tr class="el-date-table__row">
        <th>Desc</th>
        <th>Filter</th>
        <th>Value</th>
        <th>Rules</th>
        <th>Output</th>
      </tr>

      <tr v-for="f in filters">
        <td>{{f.desc}}</td>
        <td>{{f.name}}</td>
        <td>{{f.value}}</td>
        <td>{{ showFilterRule(f) }} </td>
        <td>{{ doFilter(f) }}</td>
      </tr>
    </table>

  </div>
</template>

<script>

  import Vue from 'vue';

  export default {
    data() {
      return {
        filters: [
          {desc:'数字', name: 'number', value:1200.123, args:[1]},
          {desc:'金额', name: 'currency', value:1200.123, args:[]},
          {desc:'金额不带货币符号', name: 'currency', value:1200.123, args:[false]},
          {desc:'日期', name: 'formatDate', value:new Date(), args:[]},
          {desc:'日期', name: 'formatDate', value:new Date(), args:['yyyy-MM']},
        ]
      }
    },

    methods: {
      showFilterRule(filter){
        let argStr = '';
        if(filter.args && filter.args.length > 0){
          argStr = filter.args.join(',')
          argStr = `(${argStr})`
        }
        return `value | ${filter.name}${argStr}`
      },

      doFilter(filter){
        return Vue.filter(filter.name)(filter.value, ...filter.args)
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .table{
    width: 60%;

    td{
      width: 20%;
    }
  }

</style>
