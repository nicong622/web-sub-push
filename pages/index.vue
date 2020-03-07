<template>
  <div class="container">
    <p>canUseSW: {{ canUseSW ? 'true' : 'false' }}</p>
    <p>canUsePM: {{ canUsePM ? 'true' : 'false' }}</p>
    <p>permission: {{ notifyPermission }}</p>

    <button @click="subscribeAndSave">subscribe</button>
  </div>
</template>

<script>
import { registerServiceWorker, askPermission, subscribe } from '@/utils/index'
import { saveSubscription } from '@/http/api'

let registration

export default {
  data() {
    return {
      canUseSW: 'serviceWorker' in navigator,
      canUsePM: 'PushManager' in window,
      notifyPermission: Notification.permission
    }
  },

  mounted() {
    if (!this.canUseSW || !this.canUsePM) {
      return
    }

    registerServiceWorker().then((res) => {
      registration = res
    })

    if (this.notifyPermission !== 'granted') {
      askPermission()
    }
  },

  methods: {
    subscribeAndSave() {
      subscribe(registration).then((pushSubscription) => {
        console.log(JSON.stringify(pushSubscription))
        saveSubscription(pushSubscription)
      })
    }
  }
}
</script>

<style></style>
