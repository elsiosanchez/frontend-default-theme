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
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <div style="height: -webkit-fill-available;">
    <div style="height: 10% !important;padding: 0px 15px;">
      <el-steps :active="currentSetp" finish-status="success">
        <el-step
          v-for="(list, key) in stepList"
          :key="key"
          :title="list.name"
        />
      </el-steps>
    </div>
    <div style="height: 80% !important;padding: 0px 10px;">
      <transition name="el-fade-in-linear">
        <search-criteria
          v-if="currentSetp === 1"
          :metadata="metadata"
        />
        <!-- <hr>
        <automatic-match v-if="currentSetp === 1" />
        <hr> -->
        <manual-match v-if="currentSetp === 2" />
        <automatic-match
          v-else-if="currentSetp === 3"
          :title="label"
        />
        <!-- <automatic-match
          v-else-if="currentSetp === 4"
          :title="label"
        /> -->
      </transition>
    </div>
    <div style="height: 5% !important;text-align: end;padding: 0px 10px;">
      <el-button
        v-if="!isNext"
        type="info"
        class="button-base-icon"
        icon="el-icon-arrow-right"
        plain
        :disabled="isNext"
        style="float: right;"
        @click="currentSetp++"
      />
      <el-button
        v-else
        type="primary"
        icon="el-icon-check"
        class="button-base-icon"
        style="float: right;"
        disabled
      />
      <el-button
        type="info"
        plain
        :disabled="isBack"
        icon="el-icon-arrow-left"
        style="float: right;margin-right: 10px;"
        class="button-base-icon"
        @click="currentSetp--"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'
import lang from '@/lang'
import SearchCriteria from './SearchCriteria.vue'
import AutomaticMatch from './AutomaticMatch.vue'
import ManualMatch from './ManualMatch.vue'
export default defineComponent({
  name: 'VBankStatementMatch',
  components: {
    SearchCriteria,
    AutomaticMatch,
    ManualMatch
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
        name: lang.t('VBankStatementMatch.steps.searchCriteria')
      },
      // {
      //   name: lang.t('VBankStatementMatch.steps.automaticMatch')
      // },
      {
        name: lang.t('VBankStatementMatch.steps.pendingMatch')
      },
      {
        name: lang.t('VBankStatementMatch.steps.summaryAdjustment')
      }
    ])

    const currentSetp = ref(1)

    /**
    * Computed
    */

    const isBack = computed(() => {
      return currentSetp.value === 1
    })

    const isNext = computed(() => {
      return currentSetp.value === 3
    })

    const initialSept = computed(() => {
      return currentSetp.value - 1
    })

    const label = computed(() => {
      if (currentSetp.value === 3) return lang.t('VBankStatementMatch.steps.summaryAdjustment')
      return ''
    })

    return {
      stepList,
      currentSetp,
      isBack,
      isNext,
      label,
      initialSept
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
