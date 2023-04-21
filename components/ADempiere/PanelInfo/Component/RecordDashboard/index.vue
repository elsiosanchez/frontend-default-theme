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
    <el-card
      shadow="never"
      class="main-panel"
      style="border: 0px;margin: 10px 0px;"
    >
      <el-row
        v-for="(dashboardAttributes, index) in list"
        :key="index"
        :gutter="24"
      >
        <el-col
          :key="index"
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 24 }"
          :lg="{ span: 24 }"
          :xl="{ span: 24 }"
        >
          <!-- <dashboard
            :metadata="dashboardAttributes"
            :title="dashboardAttributes.name"
            :main="true"
          /> -->
          <customizable-charts
            :title="dashboardAttributes.name"
            :metadata="dashboardAttributes"
          />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed
  // computed
} from '@vue/composition-api'

// import lang from '@/lang'
import store from '@/store'
// import router from '@/router'

// Api Request Methods
// import {
//   listWarehouses
// } from '@/api/ADempiere/form/expresMovement.js'

// Component and Mixin
// import Dashboard from '@theme/components/ADempiere/Dashboard/index.vue'
import CustomizableCharts from '@theme/components/ADempiere/CustomizableCharts/index.vue'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere'
// import { showMessage } from '@/utils/ADempiere/notification'
// import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'RecordDashboard',
  components: {
    CustomizableCharts
    // Dashboard
  },
  setup(props, { root, refs }) {
    /**
    * Ref
    */
    const data = ref('Data')
    /**
    * Computed
    */
    const list = computed(() => {
      return store.getters.getListDashboard
    })
    /**
    * Methods
    */

    return {
      // Refs
      data,
      // Computed
      list
      // Methods
    }
  }
})
</script>

<style scoped lang="scss">
.el-form-item--medium .el-form-item__label {
  width: 450px;
}

.front-item-receipt {
  width: 100%;
}
.custom-field-number {
  &.el-input-number, &.el-input {
    .el-input__inner {
      text-align-last: end !important;
    }
  }
}
</style>
<style lang="scss">
.field-from {
  .el-form-item--medium .el-form-item__label {
    line-height: 36px;
    width: 450px;
    font-size: 18px;
  }
}
.select-from {
  .el-select-dropdown__item {
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 34px;
    line-height: 34px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 18px;
  }
}
.table-form {
  .el-table__header-wrapper {
    font-size: 18px;
    line-height: 22px;
  }
}
.main-panel {
  .el-card__body {
    padding: 0px;
  }
}
</style>
