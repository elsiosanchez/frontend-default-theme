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
  <div style="height: 100% !important;">
    <div style="display: flex;">
      <el-tabs
        v-model="currentTab"
        type="border-card"
        style="width: 99%"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(tabAttributes, key) in tabsList"
          :key="key"
          :label="tabAttributes.name"
          :name="String(key)"
          :tabuuid="tabAttributes.uuid"
          :tabindex="String(key)"
          lazy
          :disabled="isDisabledTab(key)"
          :style="tabStyle"
        >
          <tab-label
            slot="label"
            :is-active-tab="tabAttributes.uuid === tabUuid"
            :parent-uuid="parentUuid"
            :container-uuid="tabAttributes.uuid"
          />

          <div v-if="isShowedTabs">
            <!-- records in table to multi records -->
            <default-table
              v-if="isShowedTableRecords"
              key="default-table"
              :parent-uuid="parentUuid"
              :container-uuid="tabAttributes.uuid"
              :container-manager="containerManager"
              :header="tableHeaders"
              :data-table="recordsList"
              :panel-metadata="tabAttributes"
            />
            <tab-panel
              v-else
              key="tab-panel"
              :parent-uuid="parentUuid"
              :container-manager="containerManager"
              :tabs-list="tabsList"
              :all-tabs-list="allTabsList"
              :current-tab-uuid="tabUuid"
              :tab-attributes="tabAttributes"
              :references-manager="referencesManager"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, watch, ref, onUnmounted } from '@vue/composition-api'

import router from '@/router'
import store from '@/store'

// components and mixins
import AuxiliaryPanel from '@theme/components/ADempiere/AuxiliaryPanel/index.vue'
import DefaultTable from '@theme/components/ADempiere/DefaultTable/index.vue'
import TabLabel from '@theme/components/ADempiere/TabManager/TabLabel.vue'
import TabPanel from './TabPanel.vue'
import ActionMenu from '@theme/components/ADempiere/ActionMenu/index.vue'

// constants
import { UUID } from '@/utils/ADempiere/constants/systemColumns.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'TabManager',

  components: {
    AuxiliaryPanel,
    DefaultTable,
    ActionMenu,
    TabPanel,
    TabLabel
  },

  props: {
    parentUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    allTabsList: {
      type: Array,
      required: false
    },
    tabsList: {
      type: Array,
      default: () => []
    },
    referencesManager: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    const queryProperty = 'tabChild'

    // if tabParent is present in path set this
    const tabNo = root.$route.query[queryProperty] || '0'
    const currentTab = ref(tabNo)

    const tabUuid = ref(props.tabsList[tabNo].uuid)

    const tabStyle = computed(() => {
      // height tab content
      return {
        // height: '75vh',
        height: 'auto',
        overflow: 'auto'
      }
    })

    // use getter to reactive properties
    const currentTabMetadata = computed(() => {
      return store.getters.getStoredTab(props.parentUuid, tabUuid.value)
    })

    const isShowedTabs = computed(() => {
      const storedWindow = store.getters.getStoredWindow(props.parentUuid)

      return storedWindow.isShowedTabsChildren
    })

    const isShowedTableRecords = computed(() => {
      return currentTabMetadata.value.isShowedTableRecords
    })

    const isCreateNew = computed(() => {
      return Boolean(root.$route.query.action === 'create-new')
    })

    function isDisabledTab(key) {
      return key > 0 && (isCreateNew.value || isEmptyValue(recordUuidTabParent.value))
    }

    function setCurrentTab() {
      store.commit('setCurrentTabChild', {
        parentUuid: props.parentUuid,
        tab: props.tabsList[currentTab.value]
      })
    }

    // create the table header
    const tableHeaders = computed(() => {
      const panel = props.tabsList[currentTab.value]
      if (panel && panel.fieldsList) {
        return panel.fieldsList
      }
      return []
    })

    /**
     * @param {object} tabHTML DOM HTML the tab clicked
     */
    const handleClick = (tabHTML) => {
      const { tabuuid, tabindex } = tabHTML.$attrs

      setTabNumber(tabindex)

      // set metadata tab
      if (tabUuid.value !== tabuuid) {
        tabUuid.value = tabuuid
        setCurrentTab()
      }
    }

    const setTabNumber = (tabNumber = '0') => {
      if (isEmptyValue(tabNumber)) {
        tabNumber = '0'
      }
      if (tabNumber !== currentTab.value) {
        currentTab.value = tabNumber
      }

      router.push({
        query: {
          ...root.$route.query,
          [queryProperty]: currentTab.value
        },
        params: {
          ...root.$route.params
        }
      }, () => {})

      return tabNumber
    }

    const tabData = computed(() => {
      return store.getters.getTabData({
        containerUuid: currentTabMetadata.value.uuid
      })
    })

    // get records list
    const recordsList = computed(() => {
      return tabData.value.recordsList
    })

    const isLoadedParentRecords = computed(() => {
      return store.getters.getTabData({
        containerUuid: currentTabMetadata.value.firstTabUuid
      }).isLoaded
    })

    const isReadyFromGetData = computed(() => {
      // TODO: add is loaded context columns
      return isLoadedParentRecords.value && !tabData.value.isLoaded
    })

    const recordUuidTabParent = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: props.parentUuid,
        containerUuid: currentTabMetadata.value.firstTabUuid,
        columnName: UUID
      })
    })

    const getData = () => {
      const containerUuid = tabUuid.value
      const filters = []
      if (!isEmptyValue(root.$route.query) &&
        !isEmptyValue(root.$route.query.columnName) &&
        !isEmptyValue(root.$route.query.value)) {
        filters.push({
          columnName: root.$route.query.columnName,
          value: root.$route.query.value
        })
      }
      store.dispatch('getEntities', {
        parentUuid: props.parentUuid,
        containerUuid,
        filters
      }).then(responseData => {
        if (isCreateNew.value || isEmptyValue(responseData)) {
          // set values in panel
          props.containerManager.seekRecord({
            parentUuid: props.parentUuid,
            containerUuid,
            row: {}
          })
          return
        }

        let row = {}
        const { action } = root.$route.query
        // uuid into action query
        if (!isEmptyValue(action) && action !== 'create-new') {
          /*
          // search link value
          const { linkColumnName } = tab
          const value = store.getters.getValueOfField({
            parentUuid: props.parentUuid,
            columnName: linkColumnName
          })
          if (linkColumnName && !isEmptyValue(value)) {
            row = responseData.find(rowData => {
            return rowData[linkColumnName] === value
          })
          }
          */
        }

        // set first record
        if (isEmptyValue(row)) {
          row = responseData[0]
        }

        // set values in panel
        props.containerManager.seekRecord({
          parentUuid: props.parentUuid,
          containerUuid,
          row
        })
      })
    }

    /**
     * Vuex suscription when record parent change
     */
    let unsuscribeChangeParentRecord = () => {}

    // if changed record in parent tab, reload tab child
    watch(isReadyFromGetData, (newValue, oldValue) => {
      if (newValue) {
        getData()
      }
    })

    // if changed record in parent tab, reload tab child
    watch(recordUuidTabParent, (newValue, oldValue) => {
      if (newValue !== oldValue && !isEmptyValue(newValue)) {
        getData()
      }
    })

    unsuscribeChangeParentRecord = store.subscribeAction({
      after: (action, state) => {
        if (action.type === 'setTabDefaultValues' && action.payload) {
          const currentChildTab = currentTabMetadata.value
          if (action.payload.parentUuid === currentChildTab.parentUuid) {
            const isChangeParentTab = currentChildTab.parentTabs.some(tabItem => {
              return tabItem.uuid === action.payload.containerUuid
            })
            if (isChangeParentTab) {
              store.dispatch('setTabDefaultValues', {
                parentUuid: action.payload.parentUuid,
                containerUuid: currentChildTab.containerUuid
              })
            }
          }
        }
      }
    })

    setTabNumber(currentTab.value)

    // remove susbscriptions
    onUnmounted(() => {
      unsuscribeChangeParentRecord()
    })

    return {
      tabUuid,
      currentTab,
      tableHeaders,
      recordsList,
      // computed
      isShowedTabs,
      isShowedTableRecords,
      tabStyle,
      // methods
      handleClick,
      isDisabledTab
    }
  }

})
</script>
