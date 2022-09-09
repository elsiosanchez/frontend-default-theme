// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import {
  createOrderLine,
  updateOrderLine,
  deleteOrderLine
} from '@/api/ADempiere/form/point-of-sales.js'

import { formatDateToSend, formatPrice } from '@/utils/ADempiere/valueFormat.js'
import { formatPercent, formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'OrderLineMixin',
  data() {
    return {
      orderLineDefinition: {
        lineDescription: {
          columnName: 'LineDescription',
          label: this.$t('form.pos.tableProduct.product'),
          isNumeric: false,
          size: 'auto'
        },
        currentPrice: {
          columnName: 'CurrentPrice',
          label: this.$t('form.productInfo.price'),
          isNumeric: true,
          size: '150px'
        },
        quantityOrdered: {
          columnName: 'QtyEntered',
          label: this.$t('form.pos.tableProduct.quantity'),
          isNumeric: true,
          size: '125px'
        },
        uom: {
          columnName: 'UOM',
          label: this.$t('form.pos.tableProduct.uom'),
          isNumeric: false,
          size: '75px'
        },
        discount: {
          columnName: 'Discount',
          label: this.$t('form.pos.order.discount'),
          isNumeric: true,
          size: '80px'
        },
        discountTotal: {
          columnName: 'DiscountTotal',
          label: this.$t('form.pos.tableProduct.displayDiscountAmount'),
          isNumeric: true,
          size: '150px'
        },
        discounDisplayTaxIndicator: {
          columnName: 'taxIndicator',
          label: this.$t('form.pos.tableProduct.taxRate'),
          isNumeric: true,
          size: '80px'
        },
        discounDisplayTaxAmounttTotal: {
          columnName: 'DisplayTaxAmount',
          label: this.$t('form.pos.tableProduct.taxAmount'),
          isNumeric: true,
          size: '150px'
        },
        grandTotal: {
          columnName: 'GrandTotal',
          label: 'Total',
          isNumeric: true,
          isVisible: true,
          size: '150px'
        },
        convertedAmount: {
          columnName: 'ConvertedAmount',
          label: this.$t('form.pos.collect.convertedAmount'),
          isNumeric: true,
          size: '150px'
        }
      },
      currentOrderLine: {
        product: {
          value: 0,
          name: '',
          description: '',
          priceStandard: 0
        },
        taxIndicator: 0,
        quantityOrdered: 0,
        uuid: ''
      },
      totalAmountConvertedLine: {}
    }
  },
  computed: {
    totalAmountConverted() {
      const conversionsList = this.$store.state['pointOfSales/point/index'].conversionsList
      if (this.isEmptyValue(conversionsList) && !this.isEmptyValue(this.currentPointOfSales.conversionTypeUuid)) {
        return 1
      }
      const converted = conversionsList.find(converted => {
        if (converted.conversionTypeUuid === this.currentPointOfSales.conversionTypeUuid) {
          return converted
        }
      })
      if (!this.isEmptyValue(converted)) {
        return converted.divideRate
      }
      return 1
    },
    isPosRequiredPin() {
      const pos = this.$store.getters.posAttributes.currentPointOfSales
      if (!this.isEmptyValue(pos.isPosRequiredPin)) {
        return pos.isPosRequiredPin
      }
      return false
    },
    isShowKeyLayout() {
      return this.$store.getters.getShowPOSKeyLayout
    },
    isDisplayTaxAmount() {
      return this.currentPointOfSales.isDisplayTaxAmount
    },
    isDisplayDiscount() {
      return this.currentPointOfSales.isDisplayDiscount
    },
    isDisplayIncludingTax() {
      if (this.isEmptyValue(this.currentPointOfSales.isDisplayIncludingTax)) {
        return true
      }
      return this.currentPointOfSales.isDisplayIncludingTax
    }
  },
  methods: {
    formatPercent,
    formatDateToSend,
    formatPrice,
    currentValuePriceLine(line) {
      if (this.currentPointOfSales.isDisplayTaxAmount && !this.currentPointOfSales.isDisplayDiscount) {
        return line.price
      }
      if (!this.currentPointOfSales.isDisplayTaxAmount && !this.currentPointOfSales.isDisplayDiscount) {
        return line.priceWithTax
      }
      if (!this.currentPointOfSales.isDisplayTaxAmount && this.currentPointOfSales.isDisplayDiscount) {
        return line.priceList
      }
      if (this.currentPointOfSales.isDisplayTaxAmount && this.currentPointOfSales.isDisplayDiscount) {
        return line.priceList
      }
    },
    changeLine(command) {
      switch (command.option) {
        case 'Eliminar':
          // this.deleteOrderLine()
          break
        //
        case this.$t('form.pos.tableProduct.editQuantities'):
          this.currentOrderLine.uuid = command.uuid
          this.edit = true
          break
        //
        case 'Información':
          break
      }
    },
    fillOrderLine(orderLine) {
      this.$store.dispatch('updateOrderLines', orderLine)
    },
    createOrderLine(orderUuid) {
      const productUuid = this.product.uuid
      createOrderLine({
        orderUuid,
        productUuid,
        priceListUuid: this.currentPointOfSales.currentPriceList.uuid,
        warehouseUuid: this.currentPointOfSales.currentWarehouse.uuid
      })
        .then(orderLine => {
          this.fillOrderLine(orderLine)
          this.reloadOrder(true, orderUuid)
        })
        .catch(error => {
          console.warn(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    listOrderLines({ uuid: orderUuid }) {
      if (!this.isEmptyValue(orderUuid)) {
        this.orderLines = this.listOrderLine
        this.handleCurrentLineChange(this.currentOrderLine)
      }
    },
    updateOrderLine(line) {
      // const line.columnName = line.value
      let updateLine
      const currentLine = this.$store.state['pointOfSales/orderLine/index'].line
      switch (line.columnName) {
        case 'QtyEntered':
          // quantity = line.value
          // // this.fieldShowValue(currentLine, { columnName: 'CurrentPrice' })
          // price = this.fieldShowValue(currentLine, { columnName: 'CurrentPrice' })
          // discountRate = currentLine.discountRate
          updateLine = {
            orderLineUuid: currentLine.uuid,
            quantity: line.value,
            priceListUuid: this.currentPointOfSales.currentPriceList.uuid,
            warehouseUuid: this.currentPointOfSales.currentWarehouse.uuid
          }
          break
        case 'PriceEntered':
          updateLine = {
            orderLineUuid: currentLine.uuid,
            price: line.value,
            priceListUuid: this.currentPointOfSales.currentPriceList.uuid,
            warehouseUuid: this.currentPointOfSales.currentWarehouse.uuid
          }
          // price = line.value
          // quantity = currentLine.quantity
          // discountRate = currentLine.discountRate
          break
        case 'Discount':
          updateLine = {
            orderLineUuid: currentLine.uuid,
            discountRate: line.value,
            priceListUuid: this.currentPointOfSales.currentPriceList.uuid,
            warehouseUuid: this.currentPointOfSales.currentWarehouse.uuid
          }
          // discountRate = line.value
          // price = this.fieldShowValue(currentLine, { columnName: 'CurrentPrice' }),
          // quantity = currentLine.quantity
          break
      }
      updateOrderLine(
        updateLine
      )
        .then(response => {
          this.$store.commit('pin', false)
          this.$store.dispatch('currentLine', response)
          this.fillOrderLine(response)
          this.$store.dispatch('reloadOrder', { orderUuid: this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid })
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },

    deleteOrderLine(lineSelection) {
      if (!this.isPosRequiredPin) {
        deleteOrderLine({
          orderLineUuid: lineSelection.uuid
        })
          .then(() => {
            this.$store.dispatch('reloadOrder', { orderUuid: this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid })
          })
          .catch(error => {
            console.error(error.message)
            this.$message({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      }
    },
    convertedAmount() {
      if (!this.isEmptyValue(this.currentPointOfSales.displayCurrency) && this.totalAmountConverted === 1) {
        this.$store.dispatch('searchConversion', {
          // conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered),
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currentPointOfSales.currentPriceList.currency.uuid,
          currencyToUuid: this.currentPointOfSales.displayCurrency.uuid
        })
      }
    },
    displayLabel(row) {
      if (this.isMobile) {
        if (row.columnName === 'ConvertedAmount') {
          return false
        } else if (row.columnName === 'UOM') {
          return false
        } else if (row.columnName === 'Discount') {
          return false
        } else if (row.columnName === 'DiscountTotal') {
          return false
        } else if (row.columnName === 'taxIndicator') {
          return false
        } else if (row.columnName === 'DisplayTaxAmount') {
          return false
        } else if (row.columnName === 'GrandTotal') {
          return true
        }
        return true
      }
      if (row.columnName === 'ConvertedAmount') {
        return !this.isEmptyValue(this.currentPointOfSales.displayCurrency)
      } else if (row.columnName === 'Discount') {
        return this.currentPointOfSales.isDisplayDiscount
      } else if (row.columnName === 'DiscountTotal') {
        return this.currentPointOfSales.isDisplayDiscount
      } else if (row.columnName === 'taxIndicator') {
        return this.currentPointOfSales.isDisplayTaxAmount
      } else if (row.columnName === 'DisplayTaxAmount') {
        return this.currentPointOfSales.isDisplayTaxAmount
      } else if (row.columnName === 'GrandTotal') {
        return true
      }
      return true
    },
    sizeTableColumn(table) {
      if (this.isMobile) {
        if (table.columnName === 'LineDescription') {
          return table.size
        } else if (table.columnName === 'CurrentPrice') {
          return '100px'
        } else if (table.columnName === 'QtyEntered') {
          return '81px'
        } else if (table.columnName === 'GrandTotal') {
          return '120px'
        }
        return
      }

      return table.size
    },
    /**
     * Show the correct display format
     * @param {object} row record
     * @param {object} orderLine or field definition
     */
    displayValue(row, orderLine) {
      const { columnName } = orderLine
      // const iSOCode = this.isEmptyValue(this.currentPointOfSales.displayCurrency) ? '' : this.currentPointOfSales.displayCurrency.iSOCode
      if (columnName === 'LineDescription') {
        if (this.isEmptyValue(row.product.value)) return row.charge.name
        return row.product.value + ' - ' + row.product.name
      }
      const currency = this.$store.getters.posAttributes.currentPointOfSales.priceList.currency.iSOCode
      if (columnName === 'CurrentPrice') {
        if (this.currentPointOfSales.currentPriceList.isTaxIncluded || this.currentPointOfSales.isDisplayTaxAmount && !this.currentPointOfSales.isDisplayDiscount) {
          return this.formatPrice(row.price, currency)
        }
        if (!this.currentPointOfSales.isDisplayTaxAmount && !this.currentPointOfSales.isDisplayDiscount) {
          return this.formatPrice(row.priceWithTax, currency)
        }
        if (!this.currentPointOfSales.isDisplayTaxAmount && this.currentPointOfSales.isDisplayDiscount) {
          return this.formatPrice(row.price, currency)
        }
        if (this.currentPointOfSales.isDisplayTaxAmount && this.currentPointOfSales.isDisplayDiscount) {
          return this.formatPrice(row.price, currency)
        }
      } else if (columnName === 'QtyEntered') {
        return formatQuantity({
          value: row.quantityOrdered,
          precision: row.uom.uom.starndard_precision
        })
      } else if (columnName === 'Discount') {
        return formatQuantity({ value: row.discount }) + ' %'
      } else if (columnName === 'taxIndicator') {
        let taxIndicator = row.taxIndicator
        if (taxIndicator === 'EX') {
          return row.taxRate.name
        }
        if (isEmptyValue(taxIndicator)) {
          taxIndicator = 0
        }
        return Number.parseFloat(taxIndicator).toFixed(2) + ' %'
      } else if (columnName === 'GrandTotal') {
        if (this.currentPointOfSales.currentPriceList.isTaxIncluded) {
          return this.formatPrice(row.totalAmount, currency)
        }
        return this.formatPrice(row.totalAmountWithTax, currency)
      } else if (columnName === 'ConvertedAmount') {
        if (this.currentPointOfSales.currentPriceList.isTaxIncluded) {
          return this.formatPrice(row.price / this.totalAmountConverted, this.currentPointOfSales.displayCurrency.iso_code)
        }
        return this.formatPrice(row.totalAmountWithTax / this.totalAmountConverted, this.currentPointOfSales.displayCurrency.iso_code)
      } else if (columnName === 'DiscountTotal') {
        return this.formatPrice(row.totalDiscountAmount, currency)
      } else if (columnName === 'DisplayTaxAmount') {
        return this.formatPrice(row.totalTaxAmount, currency)
      }
    },

    fieldShowValue({ row, columnName }) {
      // const iSOCode = this.isEmptyValue(this.currentPointOfSales.displayCurrency) ? '' : this.currentPointOfSales.displayCurrency.iSOCode
      if (columnName === 'LineDescription') {
        if (isEmptyValue(row.product.value)) return row.charge.name
        return row.product.value + ' - ' + row.product.name
      }
      if (columnName === 'CurrentPrice') {
        return row.price
        // if (this.currentPointOfSales.currentPriceList.isTaxIncluded || this.currentPointOfSales.isDisplayTaxAmount && !this.currentPointOfSales.isDisplayDiscount) {
        //   return row.price
        // }
        // if (!this.currentPointOfSales.isDisplayTaxAmount && !this.currentPointOfSales.isDisplayDiscount) {
        //   return row.priceWithTax
        // }
        // if (!this.currentPointOfSales.isDisplayTaxAmount && this.currentPointOfSales.isDisplayDiscount) {
        //   return row.priceList
        // }
        // if (this.currentPointOfSales.isDisplayTaxAmount && this.currentPointOfSales.isDisplayDiscount) {
        //   return row.priceList
        // }
      } else if (columnName === 'QtyEntered') {
        return formatQuantity({
          value: row.quantityOrdered,
          precision: row.uom.uom.starndard_precision
        })
      } else if (columnName === 'Discount') {
        return row.discount
      } else if (columnName === 'taxIndicator') {
        return formatQuantity({ value: row.taxIndicator })
      } else if (columnName === 'GrandTotal') {
        if (this.currentPointOfSales.currentPriceList.isTaxIncluded) {
          return row.totalAmount
        }
        return row.totalAmountWithTax
      } else if (columnName === 'DiscountTotal') {
        return row.totalDiscountAmount
      } else if (columnName === 'DisplayTaxAmount') {
        return row.totalTaxAmount
      }
    },
    productPrice(price, discount) {
      return price / discount * 100
    },
    handleCurrentLineChange(rowLine) {
      if (!this.isEmptyValue(rowLine)) {
        this.$store.dispatch('currentLine', rowLine)
        this.currentOrderLine = rowLine
        this.currentTable = this.listOrderLine.findIndex(item => item.uuid === rowLine.uuid)
        if (this.isEmptyValue(this.currentOrderLine) && !this.isEmptyValue(this.listOrderLine)) {
          this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        }
      }
    },
    fillOrderLineQuantities({
      currentPrice,
      quantityOrdered,
      discount
    }) {
      // const containerUuid = this.formUuid
      //  Editable fields
      if (!this.isEmptyValue(quantityOrdered)) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'line',
          columnName: 'QtyEntered',
          value: quantityOrdered
        })
      }
      if (!this.isEmptyValue(currentPrice)) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'line',
          columnName: 'PriceEntered',
          value: currentPrice
        })
      }
      if (!this.isEmptyValue(discount)) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'line',
          columnName: 'Discount',
          value: discount
        })
      }
    },
    isValidForDeleteLine(line) {
      if (this.isEmptyValue(this.currentOrderLine) && !this.isEmptyValue(this.orderLines)) {
        this.currentOrderLine = this.orderLines[0]
      }
      return !this.isEmptyValue(line)
    }
  }
}
