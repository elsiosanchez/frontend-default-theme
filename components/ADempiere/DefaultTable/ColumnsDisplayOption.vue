<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-dropdown trigger="click" class="column-option" @command="handleCommand">
    <span class="el-dropdown-link">
      <svg-icon icon-class="list" />
    </span>

    <el-dropdown-menu slot="dropdown" style="max-width: 300px;">
      <template v-for="(list, key) in options">
        <el-dropdown-item
          v-show="!list.hidden"
          :key="key"
          :command="{
            doneMethod: list.doneMethod,
            params: list.params
          }"
          :disabled="list.disabled"
        >
          <i v-if="list.typeIcon == 'i'" :class="list.icon" />
          <svg-icon v-else :icon-class="list.icon" />
          {{ list.name }}
        </el-dropdown-item>

      </template>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
// utils and helper methods
import language from '@/lang'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'ColumnsDisplayOption',

  props: {
    option: {
      type: String,
      required: true,
      default: () => ''
    },
    parentUuid: {
      type: String,
      default: undefined
    },
    containerManager: {
      type: Object,
      required: false
    },
    containerUuid: {
      type: String,
      required: false
    }
  },

  setup(props, { root }) {
    const selectionsRecords = computed(() => {
      return props.containerManager.getSelection({
        containerUuid: props.containerUuid
      })
    })
    const options = computed(() => {
      return [
        {
          doneMethod: 'deleteSelectedRecordsFromWindow',
          params: {
            parentUuid: props.parentUuid,
            containerUuid: props.containerUuid
          },
          name: language.t('table.dataTable.deleteSelection'),
          typeIcon: 'i',
          icon: 'el-icon-delete',
          hidden: false,
          disabled: isEmptyValue(selectionsRecords.value)
        },
        {
          doneMethod: 'selectOption',
          params: language.t('table.dataTable.showMinimalistView'),
          name: language.t('table.dataTable.showMinimalistView'),
          typeIcon: 'svg-icon',
          icon: optionIcon(language.t('table.dataTable.showMinimalistView')),
          hidden: false,
          disabled: false
        },
        {
          doneMethod: 'selectOption',
          params: language.t('table.dataTable.showAllColumns'),
          name: language.t('table.dataTable.showAllColumns'),
          typeIcon: 'svg-icon',
          icon: optionIcon(language.t('table.dataTable.showAllColumns')),
          hidden: false,
          disabled: false
        },
        {
          doneMethod: 'selectOption',
          params: language.t('table.dataTable.showOnlyMandatoryColumns'),
          name: language.t('table.dataTable.showOnlyMandatoryColumns'),
          typeIcon: 'svg-icon',
          icon: optionIcon(language.t('table.dataTable.showOnlyMandatoryColumns')),
          hidden: false,
          disabled: false
        },
        {
          doneMethod: 'selectOption',
          params: language.t('table.dataTable.showTableColumnsOnly'),
          name: language.t('table.dataTable.showTableColumnsOnly'),
          typeIcon: 'svg-icon',
          icon: optionIcon(language.t('table.dataTable.showTableColumnsOnly')),
          hidden: false,
          disabled: false
        }
      ]
    })
    const optionIcon = (icon) => {
      if (icon === props.option) {
        return 'eye-open'
      }
      return 'eye'
    }

    const handleCommand = (command) => {
      root.$store.dispatch(command.doneMethod, command.params)
    }

    return {
      // Data
      options,
      // Computed
      selectionsRecords,
      // Methods
      handleCommand,
      optionIcon
    }
  }
})
</script>

<style scoped>
  .column-option {
    display: inline-block;
    position: relative;
    color: #606266;
    font-size: 16px;
    /* float: right; */
  }
</style>
