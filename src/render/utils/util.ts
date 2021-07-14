import { Dialog, Toast } from 'vant'
import { ToastOptions } from 'vant/lib/toast'

const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(':')}`
}
const formatNumber = (n: number) => {
  const nStr = n.toString()
  return nStr[1] ? n : `0${n}`
}

const showAlert = (message: string, title = '', confirmButtonText = '') => {
  Dialog.alert({
    message,
    title,
    confirmButtonText,
  })
}

const showToast = (options?: string | ToastOptions) => Toast(options)

export { formatTime, showAlert, showToast }
