<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for morej details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-main
    class="return-product"
  >
    <el-form
      label-position="top"
      label-width="10px"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item
        :label="$t('form.productInfo.codeProduct')"
        style="width: 100%;"
      >
        <el-select
          v-model="searchProduct"
          remote
          filterable
          reserve-keyword
          style="width: 100%;"
          :visible-change="listReturnProduct"
          :placeholder="$t('quickAccess.searchWithEnter')"
          @change="addLine"
        >
          <el-option
            v-for="item in currentOrder.lineOrder"
            :key="item.value"
            :value="item"
          >
            <span style="float: left">{{ item.product.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              {{
                formatQuantity({
                  value: item.quantityOrdered,
                  precision: item.uom.uom.starndard_precision
                })
              }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      ref="listProducto"
      v-loading="false"
      :data="[]"
      :empty-text="$t('quickAccess.searchWithEnter')"
      border
      fit
      height="350"
      highlight-current-row
    >
      <el-table-column
        prop="product.value"
        :label="$t('form.productInfo.code')"
      />
      <el-table-column
        prop="product.name"
        :label="$t('form.pos.tableProduct.product')"
      />
      <el-table-column
        prop="quantity"
        :label="$t('form.pos.tableProduct.quantity')"
        align="right"
        :width="isEditQuantity ? '210px' : '110px'"
      >
        <template slot-scope="scope">
          <el-input-number
            v-if="isEditQuantity"
            v-model="scope.row.quantity"
            controls-position="right"
            :min="1"
          />
          <span v-else>
            {{ formatQuantity({ value: scope.row.quantity }) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="uom.uom.name"
        :label="$t('form.pos.tableProduct.uom')"
      />
      <el-table-column
        prop="quantity"
        :label="$t('form.pos.tableProduct.movementQuantity')"
        align="right"
        width="200px"
      >
        <template slot-scope="scope">
          {{ formatQuantity({ value: scope.row.movement_quantity }) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.pos.tableProduct.options')"
        column-key="value"
        width="160"
      >
        <template>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col
        :offset="12"
        :span="12"
        style="border: 1px solid #d3d4d6;border-radius: 10px;padding-left: 10px;padding-right: 10px;margin-top: 10px;"
      >
        <el-row
          :gutter="10"
        >
          <el-col
            :span="16"
          >
            <p
              class="total-return-info"
            >
              <span class="info-label">
                {{ $t('form.pos.order.order') }}:
                <b class="order-info">
                  {{ currentOrderReturn.documentNo }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.date') }}:
                <b class="order-info">
                  {{ formatDate(currentOrderReturn.dateOrdered) }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.type') }}:
                <b v-if="!isEmptyValue(currentOrderReturn) && !isEmptyValue(currentOrderReturn.documentType)" class="order-info">
                  {{ currentOrderReturn.documentType.name }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.itemQuantity') }}:
                <b class="order-info">
                  {{ 0.00 }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.numberLines') }}:
                <b class="order-info">
                  {{ 0.00 }}
                </b>
              </span>
            </p>
          </el-col>
          <el-col
            :span="8"
          >
            <p
              class="total-return-info"
            >
              <span class="info-label">
                {{ $t('form.pos.order.subTotal') }}:
                <b class="order-info">
                  {{ 0.00 }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.tableProduct.displayDiscountAmount') }}:
                <b class="order-info">
                  {{ 0.00 }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.tax') }}:
                <b class="order-info">
                  {{ 0.00 }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.subTotal') }}:
                <b class="order-info">
                  {{ 0.00 }}
                </b>
              </span>
              <br>
              <span class="info-label">
                {{ $t('form.pos.order.total') }}:
                <b class="order-info">
                  {{ 0.00 }}
                </b>
              </span>
            </p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="products-list-footer">
      <el-col :span="24">
        <samp style="float: right; padding-top: 5px;">
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="close"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            @click="close"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// constants
// api request methods
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'
import store from '@/store'

// Utils and Helper Methods
import { formatPrice, formatDate } from '@/utils/ADempiere/valueFormat.js'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
// import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'ReturnProduct',
  setup(props, { root }) {
    // Ref
    const searchProduct = ref('')
    const isEditQuantity = ref(false)
    // Computed
    const listProduct = computed(() => {
      return store.getters.getListProduct
    })

    const currentPointOfSales = computed(() => {
      return store.getters.posAttributes.currentPointOfSales
    })

    const currentOrder = computed(() => {
      return store.getters.posAttributes.currentPointOfSales.currentOrder
    })

    const currentOrderReturn = computed({
      get() {
        return store.getters.getOrderReturn
      },
      set(value) {
        store.commit('setOrderReturn', value)
      }
    })
    // Variable (Let)
    let loading
    // Methods
    function listReturnProduct(show) {
      if (!show) return
    }
    function close() {
      store.commit('setShowReturnProduct', false)
    }

    function loadARM() {
      // const { currentPointOfSales } = store.getters.posAttributes
      store.dispatch('openRMA', {
        sourceOrderId: currentOrder.value.id,
        posId: currentPointOfSales.value.id
      })
        .then(response => {
          currentOrderReturn.value = {
            ...response,
            isLoading: false
          }
        })
    }

    function addLine(line) {
      store.dispatch('createLineRMA', {
        sourceOrderLineId: line.id,
        quantity: line.quantityOrdered,
        rmaId: currentOrderReturn.value.id,
        posId: currentPointOfSales.value.id
      })
    }

    // function selectLine(params) {
    //   console.log(555)
    // }

    loadARM()

    return {
      // Import
      formatDate,
      formatPrice,
      formatQuantity,
      // Ref
      loading,
      isEditQuantity,
      searchProduct,
      // Computed
      currentPointOfSales,
      currentOrderReturn,
      currentOrder,
      listProduct,
      // Methods
      close,
      loadARM,
      addLine,
      // selectLine,
      listReturnProduct
    }
  }
})
</script>

<style lang="scss" scoped>
.return-product {
  padding: 0px;
  width: 100%;
  overflow-x: hidden;
}
.order-info {
  float: right;
}
.info-label {
  margin-bottom: 5px;
  padding-bottom: 5px;
}
.total-return-info {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 16px;
}
</style>
<style lang="scss">
.el-dialog--center .el-dialog__body {
  text-align: initial;
  padding: 15px 16px;
}
</style>
