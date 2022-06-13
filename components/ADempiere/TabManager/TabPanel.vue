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
  <div style="height: 100% !important;">
    <div style="float: right;padding-left: 1%;">
      <action-menu
        :parent-uuid="parentUuid"
        :container-uuid="currentTabUuid"
        :container-manager="containerManager"
        :actions-manager="listAction"
        :references-manager="referencesManager"
      />
    </div>
    <panel-definition
      key="panel-definition"
      :parent-uuid="parentUuid"
      :container-uuid="tabAttributes.uuid"
      :container-manager="containerManager"
      :group-tab="tabAttributes.tabGroup"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import language from '@/lang'
import store from '@/store'

// components and mixins
import PanelDefinition from '@theme/components/ADempiere/PanelDefinition/index.vue'
import ActionMenu from '@theme/components/ADempiere/ActionMenu/index.vue'

export default defineComponent({
  name: 'TabChildren',

  components: {
    PanelDefinition,
    ActionMenu
  },

  props: {
    parentUuid: {
      type: String,
      required: false
    },
    containerManager: {
      type: Object,
      required: true
    },
    currentTabUuid: {
      type: String,
      default: ''
    },
    tabAttributes: {
      type: Object,
      default: () => ({})
    },
    referencesManager: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const listAction = computed(() => {
      return {
        parentUuid: props.parentUuid,
        containerUuid: props.tabAttributes.uuid,
        defaultActionName: language.t('actionMenu.createNewRecord'),
        tableName: props.tabAttributes.tableName,
        getActionList: () => {
          return store.getters.getStoredActionsMenu({
            containerUuid: props.tabAttributes.uuid
          })
        }
      }
    })

    return {
      // computed
      listAction
    }
  }

})
</script>
