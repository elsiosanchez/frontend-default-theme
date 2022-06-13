<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <!-- records references only window -->
  <el-dropdown-item
    v-if="!isDisabledMenu"
    key="withoutActions"
    style="min-height: 26px"
    :divided="true"
  >
    <div class="contents">
      <div class="auxiliary-menu-icon">
        <i class="el-icon-zoom-in" style="font-size: 18px;" />
      </div>

      <!-- for print format -->
      <el-dropdown @command="openReference">
        <span>
          <b class="label">
            {{ $t('actionMenu.references') }}
          </b>
          <p class="description">
            <b> {{ '(' + referencesList.length +')' }} Disponibles </b>
          </p>
        </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-if="isEmptyValue(referencesList) && isReferecesContent"
            key="withoutReference"
            style="min-height: 45px"
            :divided="true"
          >
            <span class="contents">
              <b class="label">
                {{ $t('actionMenu.withoutReferences') }}
              </b>
            </span>
          </el-dropdown-item>

          <el-scrollbar v-else key="withReferences" wrap-class="scroll-child">
            <el-dropdown-item
              v-for="(reference, index) in referencesList"
              :key="index"
              :command="reference"
              :divided="true"
            >
              <span class="contents">
                <b class="label">
                  {{ reference.displayName }}
                </b>
              </span>
            </el-dropdown-item>

          </el-scrollbar>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-dropdown-item>
</template>

<script>
import { computed, defineComponent, ref, watch } from '@vue/composition-api'

import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import Filters from '@/utils/ADempiere/filters.js'

export default defineComponent({
  name: 'MenuReferences',

  props: {
    size: {
      type: String,
      default: ''
    },
    referencesManager: {
      type: Object,
      required: true
    },
    actionsManager: {
      type: Object,
      default: () => {},
      required: true
    }
  },

  setup(props, { root, parent }) {
    const {
      parentUuid
    } = props.actionsManager
    const {
      getTableName
    } = props.referencesManager

    const isLoadingReferences = ref(false)
    const referencesList = ref([])

    const recordUuid = computed(() => {
      const { action } = root.$route.query
      return action
    })

    const isWithRecord = computed(() => {
      // TODO: Add validate uuid record with route
      return !root.isEmptyValue(recordUuid.value) &&
        recordUuid.value !== 'create-new'
    })

    // is container manage references
    const isReferecesContent = computed(() => {
      if (!root.isEmptyValue(props.referencesManager)) {
        return true
      }
      return false
    })

    const isDisabledMenu = computed(() => {
      return !(isReferecesContent.value &&
        isWithRecord.value &&
        !isLoadingReferences.value)
    })

    const getterReferences = computed(() => {
      if (isReferecesContent.value) {
        return root.$store.getters.getStoredReferences({
          windowUuid: parentUuid,
          tableName: getTableName(),
          recordUuid: recordUuid.value
        })
      }

      return undefined
    })

    const openReference = (referenceElement) => {
      if (isDisabledMenu.value || root.isEmptyValue(referenceElement)) {
        return
      }

      if (!root.isEmptyValue(referenceElement.windowUuid)) {
        const pairsValues = Filters.newInstance()
          .setFiltersWithSQL(referenceElement.whereClause)
          .getAsObject()
        zoomIn({
          uuid: referenceElement.windowUuid,
          query: {
            action: 'zoomIn',
            tabParent: 0,
            filters: [{
              columnName: pairsValues[0].columnName,
              value: pairsValues[0].value
            }]
          }
        })
      }
    }

    const getReferences = () => {
      const references = getterReferences.value
      if (!root.isEmptyValue(references)) {
        referencesList.value = references.referencesList
      } else {
        isLoadingReferences.value = true

        root.$store.dispatch('getReferencesFromServer', {
          parentUuid,
          tableName: getTableName(),
          recordUuid: recordUuid.value
        })
          .then(responseReferences => {
            referencesList.value = responseReferences.referencesList
          })
          // handle error in store
          .catch(() => {})
          .finally(() => {
            isLoadingReferences.value = false
          })
      }
    }

    if (isReferecesContent.value) {
      // when change record uuid loaded references
      watch(recordUuid, (newValue, oldValue) => {
        if (isWithRecord.value && newValue !== oldValue) {
          getReferences()
        }
      })

      if (isWithRecord.value) {
        getReferences()
      }
    }

    return {
      referencesList,
      // computeds
      isReferecesContent,
      isLoadingReferences,
      isDisabledMenu,
      // methods
      openReference
    }
  }
})
</script>

<style scoped lang="scss" src="./common-style.scss">
</style>
<style lang="scss">
.menu-references {
  .el-button--warning {
    font-weight: bold;
    // darker orange tone for better readability
    border-color: #ff9b00;
    color: #ff9b00;
  }
}
</style>
