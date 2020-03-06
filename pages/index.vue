<template>
  <div class="container">
    <p>canUseSW: {{ canUseSW ? 'true' : 'false' }}</p>
    <p>canUsePM: {{ canUsePM ? 'true' : 'false' }}</p>
    <p>permission: {{ notifyPermission }}</p>
  </div>
</template>

<script>
import { registerServiceWorker, askPermission } from '@/utils/index'

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

    registerServiceWorker()

    if (this.notifyPermission !== 'granted') {
      askPermission().then((res) => console.log('askPermission res', res))
    }
  }
}
</script>

<style></style>
