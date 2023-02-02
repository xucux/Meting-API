import { handler } from './src/template.js'
import config from './src/config.js'
import flags from './src/flags.js'
import api from './src/service/api.js'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'

const app = new Hono()
// CROS https://honojs.dev/docs/builtin-middleware/cors/
app.use('*', cors())
app.use('*', logger())
app.get('/', (c) => c.text(flags.HELLO_WORLD))
app.use('/api', cors(flags.CROS))
app.get('/api', api)
app.get('/test', handler)
// Server Error https://honojs.dev/docs/api/hono/
app.notFound((c) => {
    return c.text('404 Not Found 🌏', 404)
})
app.onError((err, c) => {
    console.error(`${err}`)
    return c.text('500 Server Error 🎃', 500)
})
serve({
    fetch: app.fetch,
    port: config.PORT
})
