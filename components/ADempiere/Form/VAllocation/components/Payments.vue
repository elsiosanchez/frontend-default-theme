<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <div style="display: contents;height: 100% !important;">
    <div style="height: 89% !important;">
      <el-card id="panel-top-search-criteria" class="panel-top-search-criteria" style="height: 100%;">
        <div style="width: 50%;t: 100%;">
          <el-card style="padding: 5px 10px 5px 10px;height: 100%;">
            <div slot="header" class="clearfix" style="text-align: center;">
              <b> {{ $t('form.VAllocation.payment.title') }} </b>
            </div>
            <el-table
              id="listPaymentsTable"
              ref="listPaymentsTable"
              :data="listPayments"
              border
              style="width: 100%;height: 90%;"
              @select="handleSelectionPayments"
              @select-all="handleSelectionPaymentsAll"
            >
              <el-table-column
                type="selection"
                fixed
                width="40"
              />
              <el-table-column
                v-for="(header, key) in headersPayments"
                :key="key"
                :align="header.align"
                :min-width="isCellInput(header) ? '225' : '125'"
                :label="header.label"
              >
                <template slot-scope="scope">
                  <span v-if="(header.columnName === 'organization' || header.columnName === 'transaction_type')">
                    {{ scope.row[header.columnName].name }}
                  </span>
                  <span v-else-if="isCellInput(header)">
                    <el-input-number
                      v-model="scope.row[header.columnName]"
                      controls-position="right"
                    />
                  </span>
                  <span v-else>
                    <p
                      v-if="scope.row[header.columnName].length < 13 || (typeof scope.row[header.columnName] === 'number')"
                      style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 12px;"
                    >
                      {{ scope.row[header.columnName] }}
                    </p>
                    <p
                      v-else
                      style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 12px;"
                    >
                      <el-popover
                        placement="top-start"
                        trigger="hover"
                        width="300"
                      >
                        {{ scope.row[header.columnName] }}
                        <p
                          slot="reference"
                          type="text"
                          style="color: #606266;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 12px;"
                        >
                          {{ scope.row[header.columnName] }}
                        </p>
                      </el-popover>
                    </p>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
        <div style="width: 50%;height: 100%;">
          <el-card style="padding: 5px 10px 5px 10px;height: 100%;">
            <div slot="header" class="clearfix" style="text-align: center;">
              <b> {{ $t('form.VAllocation.invoice.title') }} </b>
            </div>
            <!-- {{ listInvoces }} -->
            <el-table
              id="listInvocesTable"
              ref="listInvocesTable"
              :data="listInvoces"
              border
              style="width: 100%;height: 90%;"
              @select="handleSelectionInvoces"
              @select-all="handleSelectionInvocesAll"
            >
              <el-table-column
                type="selection"
                fixed
                width="40"
              />
              <el-table-column
                v-for="(header, key) in headersInvoice"
                :key="key"
                prop="id"
                :align="header.align"
                :min-width="isCellInput(header) ? '225' : '125'"
                :label="header.label"
              >
                <template slot-scope="scope">
                  <span v-if="(header.columnName === 'organization' || header.columnName === 'transaction_type')">
                    {{ scope.row[header.columnName].name }}
                  </span>
                  <span v-else-if="isCellInput(header)">
                    <el-input-number
                      v-model="scope.row[header.columnName]"
                      controls-position="right"
                    />
                  </span>
                  <span v-else>
                    <p
                      v-if="scope.row[header.columnName].length < 13 || (typeof scope.row[header.columnName] === 'number')"
                      style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 12px;"
                    >
                      {{ scope.row[header.columnName] }}
                    </p>
                    <p
                      v-else
                      style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 12px;"
                    >
                      <el-popover
                        placement="top-start"
                        trigger="hover"
                        width="300"
                      >
                        {{ scope.row[header.columnName] }}
                        <p
                          slot="reference"
                          type="text"
                          style="color: #606266;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 12px;"
                        >
                          {{ scope.row[header.columnName] }}
                        </p>
                      </el-popover>
                    </p>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-card>
    </div>
    <div>
      <el-card class="box-card">
        <div id="description-payment" class="description-payment">
          <el-card
            class="box-card"
          >
            <div>
              <el-form
                :inline="true"
                label-position="left"
                style="padding: 10px !important;"
              >
                <el-col :span="4">
                  <el-form-item
                    :label="$t('form.VAllocation.description.difference')"
                  >
                    <el-tag>
                      <b style="text-align: right; font-size: 19px">
                        {{ listDifference }}
                      </b>
                    </el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    :label="$t('form.VAllocation.searchCriteria.date')"
                  >
                    <el-date-picker
                      v-model="currentDateProcess"
                      type="date"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    :label="$t('form.VAllocation.description.charge')"
                  >
                    <el-select
                      v-model="charges"
                      style="width: 100%;"
                      filterable
                      clearable
                      :filter-method="remoteSearchCharges"
                      @visible-change="findCharges"
                    >
                      <el-option
                        v-for="item in optionsCharges"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    :label="$t('form.VAllocation.description.organization')"
                  >
                    <el-select
                      v-model="transactionOrganizationId"
                      style="width: 100%;"
                      filterable
                      clearable
                      :filter-method="remoteSearchOrganizations"
                      @visible-change="findOrganizations"
                    >
                      <el-option
                        v-for="item in optionsOrganizations"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    :label="$t('form.VAllocation.description.description')"
                  >
                    <el-input
                      v-model="description"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                    />
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
          </el-card>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api'
// import lang from '@/lang'
import store from '@/store'

// components and mixins
import headersInvoice from './headersInvoice.js'
import headersPayments from './headersPayments.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
// API Request Methods
import {
  listCharges,
  listTransactionOrganizations
} from '@/api/ADempiere/form/VAllocation.js'

export default defineComponent({
  name: 'Payments',

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

    const optionsOrganizations = ref([])
    const listPaymentsTable = ref(null)
    const listInvocesTable = ref(null)
    const optionsCharges = ref([])
    // const transactionOrganizationId = ref('')
    // const description = ref('')
    const tableData = ref([])
    // const charges = ref('')

    /**
     * computed
     */

    const selectListPayments = computed(() => {
      return store.getters.getSelectListPayments
    })

    const selectListInvoces = computed(() => {
      return store.getters.getSelectListInvoces
    })

    const difference = computed({
      // getter
      get() {
        if (!isEmptyValue(selectListPayments.value) && !isEmptyValue(selectListInvoces.value)) {
          const sumPaymentsApplied = selectListPayments.value.map(list => list.applied)
          const sumPayments = sumPaymentsApplied.reduce((valorAnterior, valorActual, indice, vector) => {
            return valorAnterior + valorActual
          })
          const sumInvocesApplied = selectListInvoces.value.map(list => list.applied)
          const sumInvoces = sumInvocesApplied.reduce((valorAnterior, valorActual, indice, vector) => {
            return valorAnterior + valorActual
          })
          const array3 = [sumInvoces, sumPayments]
          const result = array3.reduce((valorAnterior, valorActual, indice, vector) => {
            return valorAnterior + valorActual
          })
          return result
        } else if (!isEmptyValue(selectListPayments.value)) {
          const sumPayments = selectListPayments.value.map(list => {
            return {
              transactionType: list.transaction_type,
              amount: list.applied
            }
          })
          return sumPayments.reduce((valorAnterior, valorActual, indice, vector) => {
            return valorAnterior.amount + valorActual.amount
          })
        } else if (!isEmptyValue(selectListInvoces.value)) {
          const sumPayments = selectListInvoces.value.map(list => list.applied)
          return sumPayments.reduce((valorAnterior, valorActual, indice, vector) => {
            return valorAnterior + valorActual
          })
        }
        return 0
      },
      // setter
      set(value) {
        return value
      }
    })

    const listPayments = computed(() => {
      return store.getters.getListVAllocation.payments
    })

    const listInvoces = computed(() => {
      return store.getters.getListVAllocation.invoce
    })

    const listDifference = computed(() => {
      const list = store.getters.getListDifference
      if (isEmptyValue(list)) return 0
      const result = list.reduce((valorAnterior, valorActual, indice, vector) => {
        if (valorAnterior.transactionType === 'P' && valorActual.transactionType === 'P') {
          const amount = valorAnterior.amount - valorActual.amount
          return {
            transactionType: valorAnterior.transactionType,
            amount
          }
        }
        if (valorAnterior.transactionType === 'P' && valorActual.transactionType === 'R') {
          const amount = (valorAnterior.amount) + (valorActual.amount)
          return {
            transactionType: valorAnterior.transactionType,
            amount
          }
        }
        if (valorAnterior.transactionType === 'R' && valorActual.transactionType === 'P') {
          const amount = (valorAnterior.amount) + (valorActual.amount)
          return {
            transactionType: valorAnterior.transactionType,
            amount
          }
        }
        if (valorAnterior.transactionType === 'R' && valorActual.transactionType === 'R') {
          const amount = valorAnterior.amount - valorActual.amount
          return {
            transactionType: valorAnterior.transactionType,
            amount
          }
        }
      })
      if (isEmptyValue(result)) return 0
      store.commit('setProcess', {
        attribute: 'totalDifference',
        value: result.amount
      })
      return result.amount
    })

    const currentDateProcess = computed({
      // getter
      get() {
        const { date } = store.getters.getProcess
        // return date
        return date
      },
      // setter
      set(value) {
        store.commit('setProcess', {
          attribute: 'date',
          value
        })
      }
    })

    const charges = computed({
      // getter
      get() {
        const { chargeId } = store.getters.getProcess
        // return date
        return chargeId
      },
      // setter
      set(value) {
        store.commit('setProcess', {
          attribute: 'chargeId',
          value
        })
      }
    })

    const description = computed({
      // getter
      get() {
        const { description } = store.getters.getProcess
        // return date
        return description
      },
      // setter
      set(value) {
        store.commit('setProcess', {
          attribute: 'description',
          value
        })
      }
    })

    const transactionOrganizationId = computed({
      // getter
      get() {
        const { transactionOrganizationId } = store.getters.getProcess
        // return date
        return transactionOrganizationId
      },
      // setter
      set(value) {
        store.commit('setProcess', {
          attribute: 'transactionOrganizationId',
          value
        })
      }
    })

    /**
     * Methods
     */

    function findCharges(isFind, searchValue) {
      if (!isFind) return
      listCharges({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsCharges.value = records.map(currency => {
            const { id, uuid, values } = currency
            return {
              id,
              uuid,
              label: values.DisplayColumn
            }
          })
        })
    }

    function remoteSearchCharges(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsCharges.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findCharges(true, query)
        }
      }
    }

    function findFilter(queryString) {
      return (query) => {
        const search = queryString.toLowerCase()
        return query.label.toLowerCase().includes(search)
      }
    }

    function remoteSearchOrganizations(query) {
      if (!isEmptyValue(query) && query.length > 2) {
        const result = optionsOrganizations.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          findOrganizations(true, query)
        }
      }
    }

    function findOrganizations(isFind, searchValue) {
      if (!isFind) return
      listTransactionOrganizations({
        searchValue
      })
        .then(response => {
          const { records } = response
          optionsOrganizations.value = records.map(organizations => {
            const { id, uuid, values } = organizations
            return {
              id,
              uuid,
              label: values.DisplayColumn
            }
          })
        })
    }

    function handleSelectionPayments(selection, row) {
      const { isSelect, applied, open_amount } = row
      const totalApplied = (applied === 0) ? open_amount : applied
      row.isSelect = !isSelect
      row.applied = totalApplied
      store.commit('setListPayments', listPayments.value)
      store.commit('setSelectListPayments', selection)
      store.commit('setListSelectPayments', selection)
      toggleSelectionPayments(row)
    }

    function handleSelectionInvoces(selection, row) {
      const { isSelect, applied, open_amount } = row
      toggleSelectionInvoce(row)
      const totalApplied = (applied === 0) ? open_amount : applied
      const all = (totalApplied < 0) ? -(totalApplied) : -(totalApplied)
      row.isSelect = !isSelect
      row.applied = all
      store.commit('setDiference', { row })
      store.commit('setListSelectInvoices', selection)
      store.commit('setListInvoces', listInvoces.value)
    }

    function handleSelectionInvocesAll(selection, row) {
      const data = selection.map(list => {
        const result = (list.applied === 0) ? list.open_amount : list.applied
        return {
          ...list,
          applied: result
        }
      })
      store.commit('setListSelectInvoices', data)
    }

    function handleSelectionPaymentsAll(selection, row) {
      store.commit('setListSelectPayments', selection)
    }

    function toggleSelectionInvoce(invoce) {
      let sumPayments
      const paymentsTypetransaction = selectListPayments.value.filter(payment => payment.transaction_type.value === invoce.transaction_type.value)
      const appliedPayments = paymentsTypetransaction.map(payment => payment.applied)
      if (!isEmptyValue(sumPayments)) {
        sumPayments = appliedPayments.reduce((valorAnterior, valorActual, indice, vector) => {
          return valorAnterior + valorActual
        })
      }
      const appliedPay = sumPayments - invoce.open_amount
      return appliedPay
    }

    function toggleSelectionPayments(payment) {
      let sumPayments
      const invocesTypetransaction = selectListInvoces.value.filter(list => list.transaction_type.value === payment.transaction_type.value)
      const appliedPayments = invocesTypetransaction.map(payment => payment.applied)
      if (!isEmptyValue(sumPayments)) {
        sumPayments = appliedPayments.reduce((valorAnterior, valorActual, indice, vector) => {
          return valorAnterior + valorActual
        })
      }
      const appliedPay = sumPayments - payment.open_amount
      return appliedPay
    }

    function isCellInput(cell) {
      const { columnName } = cell
      let isInput = false
      switch (columnName) {
        case 'writeOff':
          isInput = true
          break
        case 'applied':
          isInput = true
          break
      }
      return isInput
    }

    return {
      // Const
      // Refs
      tableData,
      headersPayments,
      headersInvoice,
      optionsCharges,
      charges,
      transactionOrganizationId,
      optionsOrganizations,
      listInvocesTable,
      listPaymentsTable,
      description,
      // Computed
      listPayments,
      listInvoces,
      difference,
      selectListPayments,
      selectListInvoces,
      listDifference,
      currentDateProcess,
      // Methods
      handleSelectionPaymentsAll,
      handleSelectionInvocesAll,
      remoteSearchOrganizations,
      handleSelectionPayments,
      handleSelectionInvoces,
      toggleSelectionPayments,
      toggleSelectionInvoce,
      remoteSearchCharges,
      findOrganizations,
      // toggleSelection,
      isCellInput,
      findCharges,
      findFilter
    }
  }
})
</script>

<style lang="scss">
  .from-wf-panel {
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .el-input--medium .el-input__inner {
    text-align: end;
  }
  .panel-top-search-criteria {
    display: flex;
    .el-card__body {
      display: contents;
      padding-top: 0px !important;
      padding-right: 0px !important;
      padding-bottom: 2px !important;
      padding-left: 0px !important;
      height: 100%!important;
    }
  }
  .el-table .cell {
    word-break: break-all;
    padding-left: 10px;
    padding-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 12px;
  }
</style>
<style>
.el-table--scrollable-x .el-table__body-wrapper {
  height: 90%;
  overflow-x: auto;
}
</style>
