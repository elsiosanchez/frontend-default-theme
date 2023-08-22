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
  <span>
    <el-form
      label-position="top"
      class="form-min-label"
      inline
      style="text-align: center;"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item
        style="width: 100% !important;display: contents;"
      >
        <template slot="label">
          <b style="color: transparent !important;">
            {{ 'Options Orders' }}
          </b>
        </template>
        <el-dropdown
          split-button
          type="primary"
          trigger="click"
          @command="selectOptions"
        >
          {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
          <el-dropdown-menu slot="dropdown">
            <template v-for="(option, key) in quickOptions">
              <el-dropdown-item v-show="option.isShow" :key="key" :command="option">
                {{ option.title }}
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="isShowOrder"
      :title="currentOptions.title"
      :modal="false"
      :center="true"
      width="75%"
      top="10vh"
    >
      <el-form
        label-position="top"
        :inline="true"
        class="demo-form-inline"
        @submit.native.prevent="notSubmitForm"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="No. del Documento"
              style="width: 100%;"
            >
              <el-input
                v-model="documentNo"
                placeholder="No. del Documento"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="Socio del Negocio"
              style="width: 100%;"
            >
              <el-select
                v-model="businessPartnerUuid"
                remote
                clearable
                filterable
                style="width: 100%;"
                :default-first-option="true"
                :remote-method="remoteMethod"
                :loading="isloadingSearchCustomer"
                @visible-change="searchCustomer"
              >
                <el-option
                  v-for="item in listCustomer"
                  :key="item.id"
                  :label="item.name"
                  :value="item.uuid"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="Fecha Orden"
              style="width: 100%;"
            >
              <el-date-picker
                v-model="dateOrderedTo"
                type="date"
                format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <table-list
        :data-list="listOrders"
        :is-loading="loading"
      />
      <el-row>
        <el-col
          :span="24"
          style="text-align: end;margin-top: 5px;"
        >
          <el-button
            plain
            type="info"
            class="button-base-icon"
            style="font-size: 25px;"
            @click="cleanFilter()"
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="close()"
          />
          <el-button
            class="button-base-icon"
            icon="el-icon-check"
            type="primary"
          />
        </el-col>
      </el-row>
    </el-dialog>
  </span>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import language from '@/lang'
import store from '@/store'
// api request methods
// import { holdOrder } from '@/api/ADempiere/form/point-of-sales.js'
// Components and Mixins
import tableList from './tableList.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat.js'

export default defineComponent({
  name: 'infoOrder',
  components: {
    tableList
  },
  setup() {
    // Ref
    const currentOptions = ref('')
    // const documentNo = ref('')
    const listCustomer = ref([])
    const loading = ref(false)
    const listOrders = ref([])
    const isloadingSearchCustomer = ref(false)
    // Computed
    const documentNo = computed({
      get() {
        const { documentNo } = store.getters.getSearchCriteria
        return documentNo
      },
      set(value) {
        store.commit('setSearchCriteria', {
          criteria: 'documentNo',
          value
        })
        loadOrdersList(currentOptions.value.params)
      }
    })

    const dateOrderedTo = computed({
      get() {
        const { dateOrderedTo } = store.getters.getSearchCriteria
        return dateOrderedTo
      },
      set(value) {
        store.commit('setSearchCriteria', {
          criteria: 'dateOrderedTo',
          value: dateTimeFormats(value, 'YYYY-MM-DD')
        })
        loadOrdersList(currentOptions.value.params)
      }
    })

    const businessPartnerUuid = computed({
      get() {
        const { businessPartnerUuid } = store.getters.getSearchCriteria
        return businessPartnerUuid
      },
      set(value) {
        store.commit('setSearchCriteria', {
          criteria: 'businessPartnerUuid',
          value
        })
        loadOrdersList(currentOptions.value.params)
      }
    })

    const isShowOrder = computed({
      get() {
        return store.getters.getShowOrder
      },
      // setter
      set(show) {
        store.commit('setShowOrder', show)
      }
    })

    const quickOptions = computed(() => {
      return [
        {
          title: language.t('form.byInvoice.label'),
          params: {
            isWaitingForInvoice: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.aisleSales'),
          params: {
            isOnlyAisleSeller: true,
            isWaitingForInvoice: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.toCollect'),
          params: {
            isWaitingForPay: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.toDeliver'),
          params: {
            isOnlyProcessed: true,
            isOnlyAisleSeller: true,
            isWaitingForShipment: true
          },
          isVisible: false,
          isShow: false
        },
        {
          title: language.t('form.byInvoice.searchCompleteOrders'),
          params: {
            isOnlyProcessed: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.proposals'),
          params: {
            isBindingOffer: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.cancelled'),
          params: {
            isNullified: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.closed'),
          params: {
            isClosed: true
          },
          isVisible: false,
          isShow: true
        }
      ]
    })

    const infoOrder = computed(() => {
      const order = store.getters.getCurrentOrder
      if (
        !isEmptyValue(order) &&
        !isEmptyValue(order.uuid)
      ) {
        return {
          documentNo: order.documentNo,
          salesRepresentative: order.salesRepresentative,
          totalLines: order.totalLines,
          discountAmount: order.discountAmount,
          taxAmount: order.taxAmount,
          grandTotal: order.grandTotal,
          dateOrdered: order.dateOrdered,
          documentType: order.documentType
        }
      }
      return {
        documentNo: '',
        salesRepresentative: {
          id: null,
          name: ''
        },
        documentType: {
          id: null,
          name: ''
        },
        discountAmount: null,
        totalLines: null,
        taxAmount: null,
        grandTotal: null,
        dateOrdered: ''
      }
    })

    function selectOptions(options) {
      if (isEmptyValue(options)) return
      currentOptions.value = options
      loadOrdersList(options.params)
      store.commit('setShowOrder', true)
    }

    function searchCustomer(isFind, searchValue) {
      if (!isFind) return
      store.dispatch('listCustomer', {
        searchValue
      })
        .then(response => {
          listCustomer.value = response
          isloadingSearchCustomer.value = false
        })
    }

    function remoteMethod(query) {
      isloadingSearchCustomer.value = true
      if (!isEmptyValue(query) && query.length > 2) {
        const result = listCustomer.value.filter(findFilter(query))
        if (isEmptyValue(result)) {
          searchCustomer(true, query)
        } else {
          isloadingSearchCustomer.value = false
        }
      }
    }

    function findFilter(queryString) {
      return (query) => {
        const search = queryString.toLowerCase()
        return query.name.toLowerCase().includes(search)
      }
    }

    function loadOrdersList(params) {
      loading.value = true
      store.dispatch('listOrder', {
        ...params,
        documentNo: documentNo.value,
        dateOrderedTo: dateOrderedTo.value,
        businessPartnerUuid: businessPartnerUuid.value
      })
        .then(response => {
          listOrders.value = response
        })
        .finally(() => {
          loading.value = false
        })
    }

    function close() {
      store.commit('setShowOrder', false)
      cleanFilter()
    }

    function cleanFilter(value) {
      store.commit('setSearchCriteria', {
        criteria: 'documentNo',
        value
      })
      store.commit('setSearchCriteria', {
        criteria: 'dateOrderedTo',
        value
      })
      store.commit('setSearchCriteria', {
        criteria: 'businessPartnerUuid',
        value
      })
    }

    return {
      // Ref
      currentOptions,
      listCustomer,
      documentNo,
      listOrders,
      dateOrderedTo,
      businessPartnerUuid,
      loading,
      isloadingSearchCustomer,
      // Computed
      infoOrder,
      quickOptions,
      isShowOrder,
      // Methods
      close,
      findFilter,
      cleanFilter,
      remoteMethod,
      selectOptions,
      searchCustomer
    }
  }
})
</script>

<style lang="scss" scoped>
.order-info {
  float: right;
}
</style>
