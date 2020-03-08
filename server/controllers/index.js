const coBody = require('co-body')
const mongoose = require('mongoose')
const webpush = require('web-push')

const Schema = mongoose.Schema

const subListSchema = new Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  }
})

const SubListModel = mongoose.model('subList', subListSchema)

function save(doc) {
  return new Promise((resolve, reject) => {
    doc.save((err, val) => {
      if (err) reject(err)
      resolve(val)
    })
  })
}

const saveSubscribe = async function(ctx) {
  const body = await coBody(ctx.req)

  const doc = new SubListModel({
    endpoint: body.endpoint,
    keys: body.keys
  })

  let res
  try {
    res = await save(doc)
  } catch (e) {
    res = e
  }

  console.log('save res', res)
  ctx.body = res
}

function getAllSub() {
  return new Promise((resolve, reject) => {
    SubListModel.find(function(err, list) {
      if (err) reject(err)
      resolve(list)
    })
  })
}

const getSubList = async function(ctx) {
  const list = await getAllSub()
  ctx.body = list
}

const pushMsg = async function(ctx, next) {
  const vapidKeys = {
    publicKey:
      'BBEB8ZS16nkigo5gCFFDcYvjQasSR_INh_v3r308IMRUDG2Sk3euBGgnMcZUqpL4k8zoraKEVvDLy1QxiTOZoy0',
    privateKey: 'MQP9LE6qAm4rHLsClZeS2HcBkoBfJXsYnuxUXITVqX0'
  }

  webpush.setVapidDetails(
    'mailto:liangningcong@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  )

  const list = await getAllSub()
  console.log('target to send: ', list[0])

  const pushSubscription = {
    endpoint: list[0].endpoint,
    keys: {
      auth: list[0].keys.auth,
      p256dh: list[0].keys.p256dh
    }
  }

  const body = await coBody(ctx.req)

  let res
  try {
    res = await webpush.sendNotification(pushSubscription, body.msg)
  } catch (error) {
    res = error
  }

  console.log('sending respone: ', res)

  ctx.body = 'ok'
}

module.exports = {
  saveSubscribe,
  getSubList,
  pushMsg
}
