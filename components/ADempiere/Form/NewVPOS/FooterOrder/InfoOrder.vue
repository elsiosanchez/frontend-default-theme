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
  <el-row>
    <el-col
      :span="14"
      class="order-info"
    >
      <p style="margin-top: 0px;">
        {{ $t('form.pos.order.order') + ':' }}
        <b>
          {{ '' }}
        </b>
      </p>
      <p>
        {{ $t('form.pos.order.date') + ':' }}
      </p>
      <p>
        {{ $t('form.pos.order.itemQuantity') + ':' }}
      </p>
      <p style="margin: 0px;">
        {{ $t('form.pos.order.numberLines') + ':' }}
      </p>
    </el-col>
    <el-col
      :span="8"
      class="order-info"
    >
      <p style="margin-top: 0px;">
        {{ $t('form.pos.order.order') + ':' }}
        <b>
          {{ order.documentNo }}
        </b>
      </p>
      <p>
        {{ $t('form.pos.order.subTotal') + ':' }}
      </p>
      <p>
        {{ $t('form.pos.tableProduct.displayDiscountAmount') + ':' }}
      </p>
      <p>
        {{ $t('form.pos.order.tax') + ':' }}
      </p>
      <p style="margin: 0px;">
        {{ $t('form.pos.order.total') }}
      </p>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'

export default defineComponent({
  name: 'infoOrder',
  setup() {
    const order = computed(() => {
      console.log(store.getters.getPoint)
      return store.getters.getPoint.order
    })
    store.dispatch('getOrder')
    return {
      order
    }
  }
})
</script>

<style lang="scss" scoped>
.order-info {
  text-align: right;
}
</style>
