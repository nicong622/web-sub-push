const Koa = require('koa')
const Router = require('koa-router')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const mongoose = require('mongoose')
const config = require('../nuxt.config.js')
const controllers = require('./controllers')

const app = new Koa()
const router = new Router()

// Import and Set Nuxt.js options
config.dev = app.env !== 'production'

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  mongoose.connect('mongodb://127.0.0.1:27017/web-sub-push', {
    useNewUrlParser: true
  })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function() {
    console.log('connected to mongodb')
  })

  await nuxt.ready()
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  router.post('/api/save-subscription', controllers.saveSubscribe)
  router.get('/api/get-sub-list', controllers.getSubList)
  router.post('/api/trigger-push-msg', controllers.pushMsg)
  app.use(router.routes())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
