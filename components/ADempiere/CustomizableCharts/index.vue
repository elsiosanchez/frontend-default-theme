<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <div class="main-express-receipt">
    <el-card shadow="never" class="customizable-charts">
      <el-collapse accordion>
        <el-collapse-item name="1">
          <template slot="title">
            <p class="title">
              <b>
                <i>
                  {{ title }}
                </i>
              </b>
            </p>
          </template>
          <headr-card
            :metadata="metadata"
            :title="title"
          />
          <el-table
            :data="tableData1"
            style="width: 100%"
            row-key="id"
            border
            lazy
            :load="load"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column
              prop="date"
              label="Indicador"
              width="180"
            />
            <el-table-column
              prop="name"
              label="Periodo"
              width="auto"
            />
            <el-table-column
              prop="amount"
              label="Monto"
              width="auto"
              align="right"
            />
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <!-- Header -->
    </el-card>
  </div>
</template>

<script>
import {
  defineComponent,
  ref
  // computed
  // computed
} from '@vue/composition-api'

// import lang from '@/lang'
// import store from '@/store'
// import router from '@/router'

// Api Request Methods
// import {
//   listWarehouses
// } from '@/api/ADempiere/form/expresMovement.js'

// Component and Mixin
import headrCard from '@theme/components/ADempiere/CustomizableCharts/headrCard.vue'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere'
// import { showMessage } from '@/utils/ADempiere/notification'
// import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'CustomizableCharts',
  components: {
    headrCard
  },
  props: {
    metadata: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: false
    }
  },
  setup(props, { root, refs }) {
    /**
    * Const
    */
    const tableData1 = [{
      id: 1,
      date: 'Bank Balance',
      name: 'this Period vs Last Period',
      amount: '251.56 USD',
      hasChildren: true
    }, {
      id: 2,
      date: 'Expenses',
      name: 'this Period vs Last Period',
      amount: 515
    }, {
      id: 3,
      date: 'Income',
      name: 'this Period vs Last Period',
      amount: '95.8%'
    }]
    /**
    * Ref
    */
    const data = ref('Data')
    /**
    * Computed
    */
    /**
    * Methods
    */
    function load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: 'Credit Card Balance',
            name: 'This Period',
            amount: '100.56 USD'
          },
          {
            id: 32,
            date: 'Debit Card Balance',
            name: 'Last Period',
            amount: '150.00 USD'
          }
        ])
      }, 1000)
    }

    return {
      // Const
      tableData1,
      // Refs
      data,
      // Computed
      // Methods
      load
    }
  }
})
</script>
<style lang="scss">
.customizable-charts {
  .el-card__body {
    padding: 0px;
  }
  .title {
    text-align: center;
    padding: 0px;
    margin: 0px;
    font-size: 19px;
  }
}
</style>
