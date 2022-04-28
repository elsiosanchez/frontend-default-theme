const { sh } = require('tasksfile')
const config = require('../../../../config/default.json')
const localConfig = require('../../../../config/local.json')

/**
 * Change view directory ADempiere
 */
// Change directory in the Browser
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/Browser/index.vue`)
// Change directory in the Form
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/Form/index.vue`)
// Change directory in the ImportExcel
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/ImportExcel/index.vue`)
// Change directory in the Process
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/Process/index.vue`)
// Change directory in the ProcessActivity
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/ProcessActivity/index.vue`)
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/ProcessActivity/processActivity.js`)
// Change directory in the Report
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/Report/index.vue`)
// Change directory in the ReportViewer
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/ReportViewer/index.vue`)
// Change directory in the Summary
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/Summary/index.vue`)
// Change directory in the Workflow
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/Workflow/index.vue`)
// Change directory in the Test
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/Test/index.vue`)
// Change directory in the window
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/Window/index.vue`)
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/Window/MultiTabWindow.vue`)
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/ADempiere/Window/windowLogicComponent.vue`)
/**
 * Change view directory dashboard
 */
// Change directory in the Test
sh(`sed -i "s|/themes/default/|/${config.theme}|g" src/views/dashboard/admin/index.vue`)
