self.addEventListener('push', function(event) {
  if (event.data) {
    const notifyObj = event.data.json()
    const promiseChain = self.registration.showNotification(
      notifyObj.title,
      notifyObj.body
    )

    event.waitUntil(promiseChain)
  } else {
    console.log('has received push, but no event data', event)
  }
})
