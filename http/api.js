import axios from 'axios'

export const saveSubscription = (data) =>
  axios.post('/api/save-subscription', data)
