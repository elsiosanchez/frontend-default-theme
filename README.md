<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Adempiere-logo.png" />
</p>


# adv-default-theme - Theme based on [Vue Element Admin](https://panjiachen.github.io/vue-element-admin-site) for [ADempiere Vue](https://github.com/adempiere/adempiere-vue)

New adv-default-theme template theme for [ADempiere Vue](https://github.com/adempiere/adempiere-vue), based on [Vue Element Admin](https://panjiachen.github.io/vue-element-admin-site/). 90% of the adv-default-theme code is locked in the [Vue Element Admin](https://panjiachen.github.io/vue-element-admin-site) library. Thanks to this, adv-default-theme can keep its flexibility, but minimize the risk of errors.

## 🔌  Installation
In order to use the new ADVue Theme Pos theme in your [ADempiere Vue](https://github.com/adempiere/adempiere-vue) installation, you need:

1. Install `lerna` globally:

   ```
   yarn global add lerna
   ```

   or

   ```
   npm install -g lerna
   ```

1. Configure `adv-default-theme` repository as a git submodule in theme path of your [ADempiere Vue](https://github.com/adempiere/adempiere-vue) workspace, and then track `develop` branch:

   ```
   git submodule add -b develop https://github.com/adempiere/adv-default-theme.git src/themes/advDefaultTheme
   ```

1. Fetch all the data:

   ```
   git submodule update --init --remote
   ```
1. Generate `local.json` file from script `generate-local-config.js`. Update [ADempiere Vue](https://github.com/adempiere/adempiere-vue) configuration by copying `local.json` file from `src/themes/advDefaultTheme` to root `config` directory:

   ```
   node src/themes/advDefaultTheme/scripts/generate-local-config.js
   ```
1. Download all dependencies and start development server:

   ```
   yarn && yarn dev
   ```

1. That's it! Now, after opening your development server (http://localhost:9527 by adv-default-theme), you should see [ADempiere Vue](https://github.com/adempiere/adempiere-vue) with the adv-default-theme. 🎉

## Design customization

You can use this template project to create your own project.
