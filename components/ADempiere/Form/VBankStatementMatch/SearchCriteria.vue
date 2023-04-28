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
  <div>
    <el-card id="panel-top-search-criteria" class="panel-top-search-criteria">
      <el-form
        :inline="true"
        label-position="top"
        style="padding: 10px !important;"
      >
        <el-form-item
          :label="$t('VBankStatementMatch.field.bankAccount')"
          class="form-item-match"
        >
          <el-select
            v-model="bankAccount"
            style="width: 100%;"
            filterable
            @visible-change="listBankAccount"
          >
            <el-option
              v-for="item in bankAccountOptionsList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('VBankStatementMatch.field.businessPartner')"
          class="form-item-match"
        >
          <el-select
            v-model="bPartner"
            style="width: 100%;"
            filterable
            @visible-change="listbPartner"
          >
            <el-option
              v-for="item in bPartnerOptionsList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('VBankStatementMatch.field.totalPayment')"
          class="form-item-match"
        >
          <el-card shadow="never">
            <el-input-number v-model="totalPayment" controls-position="right" />
            <b style="color: #80808078;margin-left: 5px;margin-right: 5px;font-weight: 999;">
              {{ '─' }}
            </b>
            <el-input-number v-model="totalPayment1" controls-position="right" />
          </el-card>
        </el-form-item>
        <el-form-item
          :label="$t('VBankStatementMatch.field.transactionDate')"
          class="form-item-match"
        >
          <el-date-picker
            v-model="transactionDate"
            type="daterange"
            range-separator="-"
            format="yyyy-MM-dd"
            value-format="timestamp"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-form-item>
        <el-form-item
          :label="$t('VBankStatementMatch.field.searchMode')"
          class="form-item-match"
        >
          <el-select
            v-model="modeSearch"
            filterable
            @visible-change="listModeSearch"
          >
            <el-option
              v-for="item in modeSearchOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-zoom-in"
            plain
            style="float: right; margin-left: 5px;"
            class="button-base-icon"
            @click="searchMatch"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <br>
    <el-card v-if="isPanelFooter">
      <automatic-match
        :loading="!isShowTable"
      />
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
// Api Request Methods
import {
  listSearchModes,
  listBankAccounts,
  listBusinessPartners
  // Shipment
} from '@/api/ADempiere/form/VBankStatementMatch.js'
import AutomaticMatch from './AutomaticMatch.vue'
import store from '@/store'
// import lang from '@/lang'
// import { isDisplayedField } from './containerManagerFrom.ts'

export default defineComponent({
  name: 'SearchCriteria',
  components: {
    AutomaticMatch
    // FieldSearch
  },
  props: {
    metadata: {
      type: Object,
      default: {}
    },
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      default: ''
    },
    columnUuid: {
      type: String,
      default: '8c05d8e2-fb40-11e8-a479-7a0060f0aa01'
    }
  },
  setup(props, { root }) {
    /**
    * Refs
    */

    const bankAccount = ref('')

    const bPartner = ref('')

    const totalPayment = ref(0)

    const totalPayment1 = ref(0)

    const transactionDate = ref('')

    const modeSearch = ref('')

    const modeSearchOptions = ref([])

    const bPartnerOptionsList = ref([])

    const bankAccountOptionsList = ref([])

    const isShowTable = ref(false)

    const isPanelFooter = ref(false)

    /**
     * Methods
     */

    function listBankAccount(isFind) {
      if (!isFind) return
      listBankAccounts({
        searchValue: bankAccount.value
      })
        .then(response => {
          const { records } = response
          bankAccountOptionsList.value = records.map(list => {
            const { id, uuid } = list
            return {
              id,
              label: list.values.DisplayColumn,
              uuid
            }
          })
        })
    }

    function listbPartner(isFind) {
      if (!isFind) return
      listBusinessPartners({
        searchValue: bPartner.value
      })
        .then(response => {
          const { records } = response
          bPartnerOptionsList.value = records.map(list => {
            const { id, uuid } = list
            return {
              id,
              label: list.values.DisplayColumn,
              uuid
            }
          })
        })
    }

    function listModeSearch(isFind) {
      if (!isFind) return
      listSearchModes({
        searchValue: modeSearch.value
      })
        .then(response => {
          const { records } = response
          modeSearchOptions.value = records.map(list => {
            const { ValueColumn, DisplayColumn } = list.values
            return {
              id: ValueColumn,
              label: DisplayColumn
            }
          })
        })
    }

    function searchMatch() {
      store.dispatch('searchMatch', {
        bankAccountId: bankAccount.value,
        dateFrom: transactionDate.value[0],
        dateTo: transactionDate.value[1],
        businessPartnerId: bPartner.value,
        paymentAmountFrom: totalPayment.value,
        paymentAmountTo: totalPayment1.value,
        matchMode: modeSearch.value
      })
      isPanelFooter.value = true
      setTimeout(() => {
        // isPanelFooter.value = false
        isShowTable.value = true
      }, 3000)
    }

    return {
      bankAccount,
      bPartner,
      totalPayment,
      totalPayment1,
      transactionDate,
      modeSearch,
      modeSearchOptions,
      bPartnerOptionsList,
      bankAccountOptionsList,
      isShowTable,
      isPanelFooter,
      listBankAccount,
      listModeSearch,
      listbPartner,
      searchMatch
    }
  }
})
</script>

<style lang="scss">
.form-item-match {
  margin-top: 0px;
  margin-left: 0px;
  margin-bottom: 0px;
  margin-right: 0px;
  padding-bottom: 0px;
  .el-form--inline {
    .el-form-item {
      display: inline-block;
      margin-right: 5px !important;
      vertical-align: top;
    }
  }
  .el-form-item__label {
    padding-bottom: 0px;
  }
  .el-form-item--medium .el-form-item__label {
    padding-bottom: 0px;
  }
  .el-form--inline .el-form-item {
    margin: 0px;
  }
}
</style>
