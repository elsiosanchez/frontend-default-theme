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
    <!-- Button Save and Process -->
    <el-button
      v-if="currentSetp === 3"
      type="primary"
      class="button-base-icon"
      icon="el-icon-check"
      style="float: right;margin-right: 10px;margin-top: 10px;"
      @click="saveImport"
    />
    <!-- Button Clear Values -->
    <el-button
      plain
      type="info"
      class="button-base-icon"
      style="float: right;margin-right: 10px;margin-top: 10px;"
      @click="actionClear"
    >
      <svg-icon icon-class="layers-clear" />
    </el-button>
    <!-- Button Change to Next Steps -->
    <el-button
      type="success"
      class="button-base-icon"
      icon="el-icon-arrow-right"
      style="float: right;margin-right: 0px;margin-top: 10px;"
      :disabled="currentSetp === 3"
      @click="nextStep"
    />
    <!-- Button Change to Previous Steps -->
    <el-button
      type="success"
      class="button-base-icon"
      icon="el-icon-arrow-left"
      style="float: right;margin-right: 0px;margin-top: 10px;"
      :disabled="currentSetp === 1"
      @click="prevStep"
    />
    <!-- Table Record Navigation -->
    <span v-if="!showNavegationTable">
      <!-- Buttons Change to Previous Record -->
      <el-button
        type="info"
        plain
        size="small"
        style="float: right;margin-right: 0px;margin-top: 10px;"
        @click="changePrevLine"
      >
        <i class="el-icon-arrow-up" style="font-size: 16px;" />
      </el-button>
      <!-- Buttons Change to Next Record -->
      <el-button
        type="info"
        plain
        size="small"
        style="float: right;margin-right: 0px;margin-top: 10px;"
        @click="changeNextLine"
      >
        <i class="el-icon-arrow-down" style="font-size: 16px;" />
      </el-button>
    </span>
  </div>
</template>

<script>
// Vue 3 Composition-Api
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'
// Store
import store from '@/store'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'actionPanelFooter',

  setup(props, { root }) {
    /**
    * Refs
    */

    let index = 0

    const isLoadSave = ref(false)

    /**
    * Computed
    */
    const currentSetp = computed({
      // getter
      get() {
        const { step } = store.getters.getAttribute
        return step
      },
      // setter
      set(value) {
        store.commit('updateAttributeVFileImport', {
          attribute: 'attribute',
          criteria: 'step',
          value
        })
      }
    })

    const isBack = computed(() => {
      return currentSetp.value === 1
    })

    const isNext = computed(() => {
      return currentSetp.value === 3
    })

    const initialSept = computed(() => {
      return currentSetp.value - 1
    })

    const validate = computed(() => {
      const { matchMode, bankAccounts } = store.getters.getCriteriaVBankStatement
      return isEmptyValue(bankAccounts.id) || isEmptyValue(matchMode.value)
    })

    const isDisableNextTable = computed(() => {
      const {
        tablaId,
        charsets,
        importFormats
      } = store.getters.getAttribute
      return !isEmptyValue(tablaId) && !isEmptyValue(charsets) && !isEmptyValue(importFormats)
    })

    const showNavegationTable = computed(() => {
      const {
        data,
        header
      } = store.getters.getFile
      return isEmptyValue(data) && isEmptyValue(header)
    })

    // Methods

    /**
     * Change to Next Steps
     * @param {number} steps
     */

    function nextStep(steps) {
      currentSetp.value++
      store.commit('updateAttributeVFileImport', {
        attribute: 'file',
        criteria: 'header',
        value: []
      })
      store.commit('updateAttributeVFileImport', {
        attribute: 'file',
        criteria: 'data',
        value: []
      })
    }

    /**
     * Change to Previous Steps
     * @param {number} steps
     */

    function prevStep(steps) {
      currentSetp.value--
      store.commit('updateAttributeVFileImport', {
        attribute: 'file',
        criteria: 'header',
        value: []
      })
      store.commit('updateAttributeVFileImport', {
        attribute: 'file',
        criteria: 'data',
        value: []
      })
    }

    /**
     * Clear Values
     */

    function actionClear() {
      store.commit('updateAttributeVFileImport', {
        attribute: 'attribute',
        criteria: 'tablaId',
        value: undefined
      })
      store.commit('updateAttributeVFileImport', {
        attribute: 'attribute',
        criteria: 'charsets',
        value: ''
      })
      store.commit('updateAttributeVFileImport', {
        attribute: 'attribute',
        criteria: 'importFormats',
        value: ''
      })
    }

    /**
     * Change to Next Record
     */

    function changeNextLine() {
      const { data } = store.getters.getFile
      store.commit('setNavigationLine', data[index])
      index++
    }

    /**
     * Change to Previous Record
     */

    function changePrevLine() {
      const { data } = store.getters.getFile
      store.commit('setNavigationLine', data[index])
      if (index === 0) return
      index--
    }

    /**
     * Save and Process
     */

    function saveImport() {
      isLoadSave.value = true
      store.dispatch('saveRecords')
        .then(() => {
          isLoadSave.value = false
        })
    }

    return {
      index,
      // Refs
      isLoadSave,
      // Computed
      isBack,
      isNext,
      validate,
      initialSept,
      currentSetp,
      isDisableNextTable,
      showNavegationTable,
      // Methods
      prevStep,
      nextStep,
      saveImport,
      actionClear,
      changePrevLine,
      changeNextLine
    }
  }
})
</script>
