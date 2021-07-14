<template>
  <div class="flex flex-col w-screen h-screen">
    <div class="flex flex-row bg-gray-100">
      <i
        class="nav-icon"
        :title="t('web.back')"
        @click="onWebCommand(WebCommand.Back)"
      >
        <img src="/@/assets/images/svg/ic_back.svg" />
      </i>
      <i
        class="nav-icon"
        :title="t('web.prev')"
        @click="onWebCommand(WebCommand.Prev)"
      >
        <img src="/@/assets/images/svg/ic_prev.svg" />
      </i>
      <i
        class="nav-icon"
        :title="t('web.refresh')"
        @click="onWebCommand(WebCommand.Refresh)"
      >
        <img src="/@/assets/images/svg/ic_refresh.svg" />
      </i>
      <div class="flex flex-row ml-auto">
        <i
          class="nav-icon"
          :title="t('web.copy')"
          @click="onWebCommand(WebCommand.Copy)"
        >
          <img src="/@/assets/images/svg/ic_copy_link.svg" />
        </i>
        <i
          class="nav-icon"
          :title="t('web.open_external')"
          @click="onWebCommand(WebCommand.Open)"
        >
          <img src="/@/assets/images/svg/ic_browser.svg" />
        </i>
      </div>
    </div>
    <webview
      ref="browser"
      class="flex w-full h-full"
      :src="state.url"
      allowpopups
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from '../utils/util'
const { clipboard, shell } = require('electron')
const TAG = 'pages/web'
enum WebCommand {
  Back,
  Prev,
  Refresh,
  Copy,
  Open,
}
// doc# https://www.electronjs.org/docs/api/webview-tag
export default defineComponent({
  setup() {
    const { t } = useI18n()
    const browser = ref()
    const state = reactive({
      url: 'http://www.baidu.com',
    })
    const onWebCommand = (cmd: WebCommand) => {
      console.log(TAG, 'onWebCommand', cmd)
      switch (cmd) {
        case WebCommand.Refresh:
          browser.value.reload()
          break
        case WebCommand.Copy:
          clipboard.writeText(browser.value.getURL())
          showToast(t('web.copied'))
          break
        case WebCommand.Open:
          shell.openExternal(browser.value.getURL())
          break
      }
    }
    const bindWebEvent = () => {
      const PageTitleUpdated = 'page-title-updated'
      browser.value.addEventListener(
        PageTitleUpdated,
        (title: string, explicitSet: boolean) => {
          console.log(TAG, PageTitleUpdated, title)
        }
      )
    }
    onMounted(() => {
      bindWebEvent()
    })
    return { t, state, browser, WebCommand, onWebCommand }
  },
})
</script>
<style scoped>
.nav-icon {
  @apply w-8 h-8 flex justify-center items-center mx-2;
}
.nav-icon img {
  @apply w-6 h-6;
}
.nav-icon:active {
  @apply opacity-50;
}
</style>
