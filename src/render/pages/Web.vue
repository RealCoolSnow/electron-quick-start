<template>
  <div class="flex flex-col w-screen h-screen">
    <div class="flex flex-row bg-gray-100 bg-opacity-50">
      <i
        :class="'nav-icon ' + (state.canGoBack ? '' : 'nav-icon-disabled')"
        :title="t('web.back')"
        @click="onBrowserCommand(BrowserCommand.Back)"
      >
        <img src="/@/assets/images/svg/ic_back.svg" />
      </i>
      <i
        :class="'nav-icon ' + (state.canGoForward ? '' : 'nav-icon-disabled')"
        :title="t('web.prev')"
        @click="onBrowserCommand(BrowserCommand.Prev)"
      >
        <img src="/@/assets/images/svg/ic_prev.svg" />
      </i>
      <i
        class="nav-icon"
        :title="t('web.refresh')"
        @click="onBrowserCommand(BrowserCommand.Refresh)"
      >
        <img src="/@/assets/images/svg/ic_refresh.svg" />
      </i>
      <div class="flex flex-row ml-auto">
        <i
          class="nav-icon"
          :title="t('web.copy')"
          @click="onBrowserCommand(BrowserCommand.Copy)"
        >
          <img src="/@/assets/images/svg/ic_copy_link.svg" />
        </i>
        <i
          class="nav-icon"
          :title="t('web.open_external')"
          @click="onBrowserCommand(BrowserCommand.Open)"
        >
          <img src="/@/assets/images/svg/ic_browser.svg" />
        </i>
      </div>
    </div>
    <webview
      ref="browser"
      class="flex w-full h-full"
      :src="state.url"
      :allowpopups="state.allowpopups"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from '../utils/util'
const { clipboard, shell } = require('electron')
const TAG = 'pages/web'
const WebURL: string = import.meta.env.VITE_WEB_URL?.toString() || ''
enum BrowserCommand {
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
      url: WebURL,
      canGoBack: false,
      canGoForward: false,
      allowpopups: false,
    })
    const onBrowserCommand = (cmd: BrowserCommand) => {
      switch (cmd) {
        case BrowserCommand.Back:
          if (state.canGoBack) browser.value.goBack()
          break
        case BrowserCommand.Prev:
          if (state.canGoForward) browser.value.goForward()
          break
        case BrowserCommand.Refresh:
          browser.value.reload()
          break
        case BrowserCommand.Copy:
          clipboard.writeText(browser.value.getURL())
          showToast(t('web.copied'))
          break
        case BrowserCommand.Open:
          shell.openExternal(browser.value.getURL())
          break
      }
    }
    const updateBrowserState = () => {
      state.canGoBack = browser.value.canGoBack()
      state.canGoForward = browser.value.canGoForward()
    }
    const bindBrowserEvent = () => {
      const PageTitleUpdated = 'page-title-updated'
      browser.value.addEventListener(PageTitleUpdated, (e: any) => {
        // console.log(TAG, PageTitleUpdated, e)
        document.title = e.title
      })
      const DomReady = 'dom-ready'
      browser.value.addEventListener(DomReady, (e: any) => {
        // console.log(TAG, DomReady, e)
        document.title = browser.value.getTitle()
        updateBrowserState()
      })
      const NewWindow = 'new-window'
      browser.value.addEventListener(NewWindow, async (e: any) => {
        const protocol = new URL(e.url).protocol
        if (protocol === 'http:' || protocol === 'https:') {
          browser.value.loadURL(e.url)
        } else {
          await shell.openExternal(e.url)
        }
      })
    }
    onMounted(() => {
      bindBrowserEvent()
    })
    return { t, state, browser, BrowserCommand, onBrowserCommand }
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
.nav-icon-disabled,
.nav-icon-disabled:active {
  @apply opacity-20;
}
</style>
