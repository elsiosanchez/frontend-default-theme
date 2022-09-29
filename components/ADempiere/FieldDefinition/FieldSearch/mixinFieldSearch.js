/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import lang from '@/lang'
import store from '@/store'

// constants
import { DISPLAY_COLUMN_PREFIX, IDENTIFIER_COLUMN_SUFFIX, UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX } from '@/utils/ADempiere/dictionaryUtils'

// utils and helper methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'
import { trimPercentage } from '@/utils/ADempiere/valueFormat'

export default {
  name: 'MixinFieldSearch',

  data() {
    return {
      timeOutSearchRecords: null,
      isLoading: false,
      searchText: '',
      controlDisplayed: this.displayedValue,
      isFindKeyPress: false
      // unsubscribe: null
    }
  },

  computed: {
    uuidForm() {
      return this.metadata.containerUuid
    },
    title() {
      let title = this.metadata.name
      if (!isEmptyValue(this.metadata.panelName) && !isSameValues(this.metadata.panelName, this.metadata.name)) {
        title += ` (${this.metadata.panelName})`
      }
      return title
    },

    blankValues() {
      return {
        [this.metadata.columnName]: undefined,
        [this.metadata.elementName]: undefined,
        id: undefined,
        uuid: undefined,
        name: undefined
      }
    },
    // implement to overwrite
    recordsList() {
      return this.$store.getters.getGeneralInfoRecordsList({
        containerUuid: this.uuidForm
      })
    },
    // includes list lookups and default values
    getStoredLookupsAndDefaultValues() {
      const allOptions = this.$store.getters.getStoredLookupAll({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        contextColumnNames: this.metadata.reference.contextColumnNames,
        contextColumnNamesByDefaultValue: this.metadata.contextColumnNames,
        uuid: this.metadata.uuid,
        id: this.metadata.id,
        //
        tableName: this.metadata.reference.tableName,
        columnName: this.metadata.columnName,
        value: this.value
      })

      return allOptions
    },

    value: {
      get() {
        const { columnName, containerUuid, inTable } = this.metadata
        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.getCell) {
            return this.containerManager.getCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName
            })
          }
        }

        return store.getters.getValueOfFieldOnContainer({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })
      },
      set(value) {
        const { columnName, containerUuid, inTable } = this.metadata

        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.setCell) {
            return this.containerManager.setCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName,
              value
            })
          }
        }

        // const option = this.findOption(value)
        // // always update uuid
        // this.uuidValue = option.uuid

        store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName,
          value
        })
        // update element column name
        if (columnName !== this.metadata.elementName) {
          store.commit('updateValueOfField', {
            parentUuid: this.metadata.parentUuid,
            containerUuid,
            columnName: this.metadata.elementName,
            value
          })
        }
      }
    },
    displayedValue: {
      get() {
        return store.getters.getValueOfField({
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.displayColumnName
        })
      },
      set(value) {
        store.commit('updateValueOfField', {
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.displayColumnName,
          value
        })
      }
    },
    uuidValue: {
      get() {
        if (this.metadata.inTable) {
          return undefined
        }
        return this.$store.getters.getValueOfFieldOnContainer({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // 'ColumnName'_UUID
          columnName: this.metadata.columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
        })
      },
      set(value) {
        if (this.metadata.inTable) {
          return undefined
        }
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // 'ColumnName'_UUID
          columnName: this.metadata.columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
          value
        })
      }
    },

    storedIdentifierColumns() {
      const listIdentifier = this.$store.getters.getIdentifier({
        containerUuid: this.uuidForm
      })
      if (this.isEmptyValue(listIdentifier)) {
        return []
      }
      return listIdentifier
        .filter(field => {
          // return field.displayType === field.displayType === CHAR.id
          return field.identifierSequence > 0 && field.columnName === 'Description'
        })
        .sort((fieldA, fieldB) => {
          return fieldA.identifierSequence > fieldB.identifierSequence
        })
        .map(field => {
          return field.columnName
        })
    }
  },

  // created() {
  //   this.unsubscribe = this.subscribeChanges()
  // },

  // beforeDestroy() {
  //   this.unsubscribe()
  // },

  methods: {
    clearValues() {
      this.setValues(this.blankValues)
    },
    // subscribeChanges() {
    //   return this.$store.subscribe((mutation, state) => {Q
    //     if (mutation.type === 'updateValueOfField') {
    //       if (mutation.payload.containerUuid === this.metadata.containerUuid) {
    //         // add displayed value to persistence
    //         if (mutation.payload.columnName === this.metadata.columnName) {
    //           this.preHandleChange(mutation.payload.value)

    //           this.$store.dispatch('notifyFieldChange', {
    //             containerUuid: this.metadata.containerUuid,
    //             containerManager: this.containerManager,
    //             field: this.metadata,
    //             columnName: this.metadata.displayColumnName
    //           })
    //         }

    //         if (mutation.payload.columnName === this.metadata.displayColumnName) {
    //           // set current displayed value to clean on focus
    //           this.controlDisplayed = mutation.payload.value
    //         }
    //       }
    //     }
    //   })
    // },
    setNewDisplayedValue() {
      const displayValue = this.displayedValue
      if (!isSameValues(this.controlDisplayed, displayValue)) {
        this.controlDisplayed = displayValue
      }
    },
    setOldDisplayedValue() {
      if (!isSameValues(this.controlDisplayed, this.displayedValue)) {
        this.displayedValue = this.controlDisplayed
      }
    },
    whitOutResultsMessage() {
      this.$message({
        message: lang.t('notifications.searchWithOutRecords'),
        type: 'info',
        showClose: true
      })
    },

    /**
     * Set displayed value from lookup list or default value
     * @returns
     */
    setDisplayedValue() {
      const value = this.value
      // if empty clear all values
      if (isEmptyValue(value)) {
        this.displayedValue = undefined
        this.uuidValue = undefined
        return
      }

      // find local list value
      const optionsList = this.getStoredLookupsAndDefaultValues
      const option = optionsList.find(item => item.value === value)
      if (option) {
        if (!isEmptyValue(option.uuid)) {
          this.uuidValue = option.uuid
        }

        if (!isEmptyValue(option.displayedValue)) {
          this.displayedValue = option.displayedValue
        }
      }

      // with displayed value
      if (!isEmptyValue(this.displayedValue)) {
        return
      }

      // request lookup
      this.getValueOfLookup()
    },
    getValueOfLookup() {
      this.isLoading = true
      this.getDefaultValueFromServer()
        .then(responseLookupItem => {
          // with value response update local component list
          if (!this.isEmptyValue(responseLookupItem)) {
            this.value = responseLookupItem.value
            this.displayedValue = responseLookupItem.displayedValue
            this.uuidValue = responseLookupItem.uuid
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    localSearch(stringToMatch, callBack) {
      if (isEmptyValue(stringToMatch)) {
        // not show list
        callBack([])
        return
      }

      const recordsList = this.recordsList
      let results = recordsList
      if (stringToMatch) {
        const parsedValue = trimPercentage(stringToMatch.toLowerCase().trim())

        results = recordsList.filter(row => {
          // find on all columns
          // for (const column in row) {
          //   const valueToCompare = String(row[column]).toLowerCase()

          //   if (valueToCompare.includes(parsedValue)) {
          //     return true
          //   }
          // }
          // find on identifier columns
          for (const columnName of this.storedIdentifierColumns) {
            const valueToCompare = String(row[columnName]).toLowerCase()

            if (valueToCompare.includes(parsedValue)) {
              return true
            }
          }
          return false
        })

        // Remote search
        if (isEmptyValue(results) && String(stringToMatch.length > 2)) {
          clearTimeout(this.timeOutSearchRecords)

          this.timeOutSearchRecords = setTimeout(() => {
            this.remoteSearch(stringToMatch)
              .then(remoteResponse => {
                callBack(remoteResponse)
              })
          }, 2000)
          return
        }
      }

      // call callback function to return suggestions
      callBack(results)
    },

    /**
     * implement to overwrite
     * @param {string} searchValue
     * @returns {promise}
     */
    remoteSearch(searchValue) {
      return new Promise(resolve => {
        console.info('Implememnt to overwrite')
        resolve([])
      })
    },

    setValues(rowData) {
      const { parentUuid, containerUuid, columnName, elementName } = this.metadata
      const { [columnName]: id, UUID: uuid, IdentifierTable } = rowData

      const displayedValue = this.generateDisplayedValue(rowData)

      // set ID value
      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName,
        value: this.isEmptyValue(id) ? rowData[IdentifierTable + IDENTIFIER_COLUMN_SUFFIX] : id
      })
      // set display column (name) value
      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: DISPLAY_COLUMN_PREFIX + columnName,
        value: displayedValue
      })
      // set UUID value
      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
        value: uuid
      })

      // set on element name, used by columns views aliases
      if (!isEmptyValue(elementName) && columnName !== elementName) {
        // set ID value
        this.$store.commit('updateValueOfField', {
          parentUuid,
          containerUuid,
          columnName: elementName,
          value: id
        })
        // set display column (name) value
        this.$store.commit('updateValueOfField', {
          parentUuid,
          containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: DISPLAY_COLUMN_PREFIX + elementName,
          value: displayedValue
        })
        // set UUID value
        this.$store.commit('updateValueOfField', {
          parentUuid,
          containerUuid,
          columnName: elementName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
          value: uuid
        })
      }
      this.$store.dispatch('notifyFieldChange', {
        containerUuid: this.metadata.containerUuid,
        containerManager: this.containerManager,
        field: this.metadata,
        columnName: this.metadata.columnName
      })
    },

    generateDisplayedValueWithIdentifiers(row) {
      let displayedValue
      const identifierColumns = this.storedIdentifierColumns
      if (isEmptyValue(identifierColumns)) {
        return displayedValue
      }

      // generate with identifier columns
      this.storedIdentifierColumns.forEach(columnName => {
        const currentValue = row[columnName]
        if (isEmptyValue(currentValue)) {
          // omit empty value
          return
        }
        if (isEmptyValue(displayedValue)) {
          // set first value
          displayedValue = currentValue
          return
        }
        // concat additional values
        displayedValue += ' - ' + currentValue
      })

      return displayedValue
    },

    generateDisplayedValue(recordRow) {
      let displayedValue = this.generateDisplayedValueWithIdentifiers(recordRow)
      if (!isEmptyValue(displayedValue)) {
        return displayedValue
      }

      // generate with standard columns
      const { Value, Name, Description } = recordRow

      if (!isEmptyValue(Value)) {
        displayedValue = Value
      }
      if (!isEmptyValue(Name)) {
        if (!isEmptyValue(displayedValue)) {
          displayedValue += ' - ' + Name
        } else {
          displayedValue = Name
        }
      }
      if (!isEmptyValue(Description)) {
        if (!isEmptyValue(displayedValue)) {
          displayedValue += ' - ' + Description
        } else {
          displayedValue = Description
        }
      }

      return displayedValue
    },

    generatedDescription(recordRow) {
      let displayedDescription

      const description = recordRow['Description']
      if (!isEmptyValue(description) && !this.storedIdentifierColumns.includes('Description')) {
        displayedDescription = description
      }

      const help = recordRow['Help']
      if (!isEmptyValue(help) && !this.storedIdentifierColumns.includes('Help')) {
        if (!isEmptyValue(displayedDescription)) {
          displayedDescription += ' - ' + help
        } else {
          displayedDescription = help
        }
      }

      return displayedDescription
    },

    handleSelect(recordSelected, findLocalList) {
      if (isEmptyValue(recordSelected)) {
        recordSelected = this.blankValues
      }
      if (!this.isEmptyValue(recordSelected.value) && this.recordsList.length > 1) {
        findLocalList = this.recordsList.find(row => {
          return this.storedIdentifierColumns.some(columnName => {
            const value = !this.isEmptyValue(row[columnName]) ? row[columnName].toString() : ''
            const search = recordSelected.value
            if (value) {
              return value
                .trim()
                .toLowerCase()
                .includes(
                  search
                    .trim()
                    .toLowerCase()
                )
            }
          })
        })
      }
      if (!this.isEmptyValue(recordSelected.value) && this.$refs.displayGeneralInfoSearch.loading) {
        this.isFindKeyPress = true
        return
      }

      if (this.isEmptyValue(recordSelected.UUID) && this.recordsList.length === 1) {
        recordSelected = this.recordsList[0]
      }
      recordSelected.id = this.metadata.columnName
      this.setValues(recordSelected)

      // prevent losing display value with focus
      this.controlDisplayed = this.generateDisplayedValue(recordSelected)
    }
  }

}
