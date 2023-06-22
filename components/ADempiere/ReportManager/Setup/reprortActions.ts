import { Notification } from 'element-ui'
import lang from '@/lang'
import store from '@/store'
import router from '@/router'

/**
 * Update Report Type parameter in the store
 * @param reportType
 * @param containerUuid
 * @param reportViewUuid
 * @param printFormatUuid
 * @param isSummary
 */
export function updateReport(
  reportType,
  containerUuid,
  reportViewUuid,
  printFormatUuid,
  isSummary = false
) {
  store.commit('setReportGenerated', {
    reportType,
    containerUuid,
    reportViewUuid,
    printFormatUuid,
    isSummary
  })
}

/**
 * Close Panel Panel Config
 * @param containerUuid
 */

export function handleClose(
  containerUuid
) {
  store.commit('setShowPanelConfig', {
    containerUuid,
    value: false
  })
}

/**
 * Run Report Viewer and Close Panel
 * @param containerUuid
 * @param findTagViwer
 * @param isSummary
 * @param tableName
 */
export function runReportViewer({
  containerUuid,
  findTagViwer,
  isSummary,
  tableName
}) {
  const reportDefinition = store.getters.getStoredReport(containerUuid)
  const reportOutputParams = store.getters.getReportParameters({
    containerUuid,
    fieldsList: reportDefinition.fieldsList
  })
  const currentRoute = router.app.$route
  const {
    name,
    description
  } = store.getters.getReportOutput(currentRoute.params.instanceUuid)
  const message = `${name} ${description}`
  Notification({
    title: `${lang.t('notifications.processing')}`,
    message: `
      <div style="max-height: 100px;max-width: 250px; overflow-y: auto;">
        ${message}
      </div>
    `,
    position: 'bottom-right',
    type: 'info',
    dangerouslyUseHTMLString: true
  })
  store.dispatch('buildReport', {
    containerUuid: containerUuid,
    instanceUuid: currentRoute.params.instanceUuid,
    isSummary: isSummary,
    tableName: tableName,
    parametersList: reportOutputParams
  })
    .then(response => {
      const { footerName } = response
      store.dispatch('tagsView/delCachedView', findTagViwer).then(() => {
        const { fullPath } = findTagViwer
        this.$nextTick(() => {
          router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
      Notification({
        title: `${lang.t('notifications.processing')}`,
        message: `
          <div style="max-height: 100px;max-width: 250px; overflow-y: auto;">
            ${footerName}
          </div>
        `,
        position: 'bottom-right',
        type: 'success',
        dangerouslyUseHTMLString: true
      })
    })
    .catch(error => {
      Notification({
        title: `${lang.t('notifications.error')}`,
        message: `
          <div style="max-height: 100px;max-width: 250px; overflow-y: auto;">
          ${error.message}
          </div>
        `,
        position: 'bottom-right',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    })
  handleClose(containerUuid)
}

/**
 * Run Report and Close Panel
 * @param containerUuid
 */

export function runReport(containerUuid) {
  store.dispatch('buildReport', {
    containerUuid,
    isSummary: true
  })
  store.commit('setShowPanelConfig', {
    containerUuid,
    value: false
  })
}
