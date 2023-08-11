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
  <el-container
    class="v-pos"
  >
    <el-header style="height: auto !important;">
      <header-order />
    </el-header>
    <el-main style="padding: 0px 20px;">
      <main-order />
    </el-main>
    <el-footer style="height: auto !important;padding-top: 5px;">
      <footer-order />
    </el-footer>
  </el-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// import lang from '@/lang'
import store from '@/store'
import router from '@/router'
// Component and Mixins
import HeaderOrder from './HeaderOrder'
import MainOrder from './MainOrder'
import FooterOrder from './FooterOrder'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'NewVPOS',
  components: {
    HeaderOrder,
    MainOrder,
    FooterOrder
  },
  setup() {
    const currentRoute = router.app._route
    if (!isEmptyValue(currentRoute.query.action)) {
      store.dispatch('searchPoint', currentRoute.query.action)
    }
    store.dispatch('searchPointList')
  }
})
</script>

<style lang="scss" scoped>
.v-pos {
  height: 90% !important;
  .buttons-and-options {
    text-align: left;
  }
  .order-info {
    text-align: right;
  }
}
</style>
