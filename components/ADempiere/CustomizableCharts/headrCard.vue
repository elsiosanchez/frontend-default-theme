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
    <el-card shadow="never" class="headr-card" style="border: 0px;">
      <div class="panel">
        <el-card
          v-for="(card, key) in cards"
          :key="key"
          shadow="always"
          class="card-panel"
        >
          <p style="text-align: center;margin: 5px 0px;">
            <b>
              <i>
                <el-popover
                  v-if="card.isChar"
                  placement="right"
                  width="400"
                  trigger="click"
                >
                  <component
                    :is="renderDashboard"
                    ref="epale"
                    class="epale"
                    :metadata="metadata"
                    :class-name="'qlq'"
                  />
                  <el-button
                    slot="reference"
                    type="text"
                    style="color: black;font-size: 14px;padding: 0px"
                  >
                    <b>
                      <i>
                        {{ card.label }} <svg-icon icon-class="dashboard" style="font-size: 14px;" />
                      </i>
                    </b>
                  </el-button>
                </el-popover>
                <span v-else>
                  {{ card.label }}
                </span>
              </i>
            </b>
          </p>
          <el-divider class="divider-panel" />
          <p style="text-align: center;font-size: 28px;margin: 10px 0px;">
            <b>
              {{ card.value }}
              <i>
                {{ card.symbol }}
              </i>
            </b>
          </p>

        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed
} from '@vue/composition-api'

// import lang from '@/lang'
// import store from '@/store'
// import router from '@/router'

// Api Request Methods
// import {
//   listWarehouses
// } from '@/api/ADempiere/form/expresMovement.js'

// Component and Mixin
import Dashboard from '@theme/components/ADempiere/Dashboard/index.vue'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere'
// import { showMessage } from '@/utils/ADempiere/notification'
// import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'HeadrCard',
  components: {
    Dashboard
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
    const tableData1 = [{
      id: 1,
      date: 'Bank Balance',
      name: 'this Period vs Last Period',
      hasChildren: true
    }, {
      id: 2,
      date: 'Expenses',
      name: 'this Period vs Last Period'
    }, {
      id: 3,
      date: 'Income',
      name: 'this Period vs Last Period'
    }]
    /**
    * Ref
    */
    const data = ref('Data')
    console.log(props.metadata)
    /**
    * Computed
    */
    const cards = computed(() => {
      return props.metadata.attribute.card
    })

    const renderDashboard = computed(() => {
      let dashboard
      console.log(props.metadata.chartType)
      switch (props.metadata.chartType) {
        //  Bar Chart
        case 'BC':
          dashboard = () => import('@theme/components/ADempiere/Dashboard/charts/BarChart')
          break
        //  Area Chart
        case 'AC':
          dashboard = () => import('@theme/components/ADempiere/Dashboard/charts/AreaChart')
          break
        //  Line Chart
        case 'LC':
          dashboard = () => import('@theme/components/ADempiere/Dashboard/charts/LineChart')
          break
        //  Pie Chart
        case 'PC':
          dashboard = () => import('@theme/components/ADempiere/Dashboard/charts/PieChart')
          break
        //  Ring Chart
        case 'RC':
          dashboard = () => import('@theme/components/ADempiere/Dashboard/charts/PieChart')
          break
        //  Raddar Chart
        case 'RA':
          dashboard = () => import('@theme/components/ADempiere/Dashboard/charts/RaddarChart')
          break
        //  Waterfall Chart
        case 'WC':
          dashboard = () => import('@theme/components/ADempiere/Dashboard/charts/WaterfallChart')
          break
        //  Basic Scatter Chart
        case 'SC':
          dashboard = () => import('@theme/components/ADempiere/Dashboard/charts/Scatter')
          break
        //  Gauge
        case 'GU':
          dashboard = () => import('@theme/components/ADempiere/Dashboard/charts/Gauge')
          break
        default:
          dashboard = () => import('@theme/components/ADempiere/Dashboard/charts/LineChart')
          break
      }
      console.log({ dashboard })
      return dashboard
    })
    /**
    * Methods
    */
    function load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: 'Credit Card Balance',
            name: 'This Period'
          },
          {
            id: 31,
            date: 'Debit Card Balance',
            name: 'Last Period'
          }
        ])
      }, 1000)
    }

    return {
      tableData1,
      // Refs
      data,
      // Computed
      cards,
      renderDashboard,
      // Methods
      load
    }
  }
})
</script>

<style lang="scss">
.headr-card {
  .title {
    padding: 0px;
    margin: 0px;
  }
  .panel {
    display: flex;
  }
  .card-panel {
    margin: 5px 10px;
    padding: 0px 10px;
    .divider-panel {
      margin: 5px 0px !important;
    }
  }
}
</style>
