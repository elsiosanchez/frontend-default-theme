<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
  <el-main
    class="product-list-content"
  >
    <el-form
      label-position="top"
      label-width="10px"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item :label="$t('form.productInfo.codeProduct')">
        <el-input
          v-model="searchValue"
          :placeholder="$t('quickAccess.searchWithEnter')"
          clearable
          @input="searchProduct"
        />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="isLoading"
      :data="listProducto"
      :empty-text="$t('quickAccess.searchWithEnter')"
      highlight-current-row
      :border="true"
      height="450"
      fit
      @row-dblclick="addProduct"
    >
      <index-column
        :page-number="1"
        :page-size="50"
      />
      <el-table-column
        :label="$t('form.productInfo.code')"
        width="190"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-document-copy"
            @click="copyCode(scope.row)"
          />
          {{ scope.row.product.value }}
        </template>
      </el-table-column>
      <el-table-column
        prop="product.name"
        :label="$t('form.productInfo.name')"
        min-width="200"
      />
      <el-table-column
        prop="quantityOnHand"
        :label="$t('form.productInfo.quantityOnHand')"
        align="right"
      />
      <el-table-column
        :label="$t('form.productInfo.price')"
        align="right"
      >
        <template slot-scope="scope">
          {{ displayAmount(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.pos.collect.convertedAmount')"
        align="right"
      >
        <template slot-scope="scope">
          {{ displayAmount(scope.row) }}
        </template>
      </el-table-column>
    </el-table>
    <p>
      <el-button
        type="danger"
        class="button-base-icon"
        icon="el-icon-close"
        @click="close(false)"
      />
    </p>
  </el-main>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'
// Components and Mixins
import IndexColumn from '@theme/components/ADempiere/DataTable/Components/IndexColumn.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'ProductListTable',
  components: {
    IndexColumn
  },
  setup() {
    const searchValue = ref('')
    const isLoading = ref(false)
    let timeoutSearch
    const listProducto = computed(() => {
      return store.getters.getProductList
    })

    const order = computed(() => {
      return store.getters.getPoint.order
    })

    function copyCode(row) {
      copyToClipboard({
        text: row.product.value,
        isShowMessage: true
      })
    }

    function searchProduct(search) {
      clearTimeout(timeoutSearch)
      isLoading.value = true
      timeoutSearch = setTimeout(() => {
        store.dispatch('searchProductList', {
          searchValue: search,
          pageSize: 50
        })
          .finally(() => {
            isLoading.value = false
          })
      }, 1000)
    }

    function displayAmount(row) {
      const {
        priceStandard,
        currency
      } = row
      return formatPrice({ value: priceStandard, currency: currency.iSOCode })
    }

    function addProduct(row) {
      if (isEmptyValue(order.value)) {
        store.dispatch('newOrder')
          .finally(() => {
            store.dispatch('newLine', row)
              .finally(() => {
                close(false)
              })
          })
      }
    }

    function close(show = false) {
      store.commit('setShowProductList', show)
    }

    return {
      // Ref
      searchValue,
      isLoading,
      // Computed
      listProducto,
      // Methods
      displayAmount,
      searchProduct,
      addProduct,
      copyCode,
      close
    }
  }
})
</script>

<style lang="scss">
.product-list-content {
  padding-top: 0px;
}
.el-autocomplete-suggestion li {
  line-height: 20px;
}
</style>
