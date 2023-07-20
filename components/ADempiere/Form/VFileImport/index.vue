<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <div style="padding: 10px;">
    <div style="height: 8% !important;">
      <el-steps :active="currentSetp" finish-status="success">
        <el-step
          v-for="(list, key) in stepList"
          :key="key"
          :title="list.name"
        />
      </el-steps>
    </div>
    <div style="height: 92% !important;">
      <transition name="el-fade-in-linear">
        <selectTable
          v-if="currentSetp === 1"
        >
          <template v-slot:footer>
            <actionPanel-footer />
          </template>
        </selectTable>
        <uploadFile
          v-if="currentSetp === 2"
        >
          <template v-slot:footer>
            <actionPanel-footer />
          </template>
        </uploadFile>
        <saveProcess
          v-if="currentSetp === 3"
        >
          <template v-slot:footer>
            <actionPanel-footer />
          </template>
        </saveProcess>
      </transition>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import selectTable from './selectTable.vue'
import uploadFile from './uploadFile.vue'
import saveProcess from './saveProcess.vue'
import actionPanelFooter from './actionPanelFooter.vue'

export default defineComponent({
  name: 'VFileImport',

  components: {
    selectTable,
    uploadFile,
    saveProcess,
    actionPanelFooter
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  setup(props, { root }) {
    /**
    * Refs
    */

    const stepList = ref([
      {
        name: lang.t('form.VFileImport.step.selectTable')
      },
      {
        name: lang.t('form.VFileImport.step.configureToImport')
      },
      {
        name: lang.t('form.VFileImport.step.saveAndProcess')
      }
    ])

    /**
    * Computed
    */

    const currentSetp = computed(() => {
      const { step } = store.getters.getAttribute
      return step
    })

    return {
      stepList,
      currentSetp
    }
  }
})
</script>

<style scoped>
.carousel-panel {
  height: 100% !important;
  padding: 10px 0px;
}
.el-carousel__item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow: hidden;
  z-index: 0;
  height: auto;
}
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
