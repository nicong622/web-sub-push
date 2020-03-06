export function registerServiceWorker() {
  return navigator.serviceWorker
    .register('service-worker.js')
    .then(function(registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey:
          'BBEB8ZS16nkigo5gCFFDcYvjQasSR_INh_v3r308IMRUDG2Sk3euBGgnMcZUqpL4k8zoraKEVvDLy1QxiTOZoy0'
      }

      return registration.pushManager.subscribe(subscribeOptions)
    })
    .then(function(pushSubscription) {
      console.log(
        'Received PushSubscription: ',
        JSON.stringify(pushSubscription)
      )
      return pushSubscription
    })
    .catch(function(err) {
      console.error('Unable to register service worker.', err)
    })
}

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
