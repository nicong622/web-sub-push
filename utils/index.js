const vapidPublicKey =
  'BBEB8ZS16nkigo5gCFFDcYvjQasSR_INh_v3r308IMRUDG2Sk3euBGgnMcZUqpL4k8zoraKEVvDLy1QxiTOZoy0'

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// 注册 service worker
export function registerServiceWorker() {
  return navigator.serviceWorker
    .register('service-worker.js')
    .catch(function(err) {
      console.error('Unable to register service worker.', err)
    })
}

// 订阅推送服务
export function subscribe(registration) {
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  }

  return registration.pushManager.subscribe(subscribeOptions)
}

// 获取通知权限
export function askPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result)
    })

    if (permissionResult) {
      permissionResult.then(resolve, reject)
    }
  }).then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error("We weren't granted permission.")
    }
  })
}
