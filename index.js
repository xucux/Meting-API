import api from './src/service/api.js'
import config from './src/config.js'

let serve, Hono, logger, cors

const isDeno = config.isDeno
const isNode = globalThis?.process?.release?.name === 'node'

if (isDeno) {
    serve = (await import('https://deno.land/std/http/server.ts')).serve
    Hono = (await import('https://deno.land/x/hono/mod.ts')).Hono
    logger = (await import('https://deno.land/x/hono/middleware.ts')).logger
    cors = (await import('https://deno.land/x/hono/middleware.ts')).cors
} else {
    Hono = (await import('hono')).Hono
    logger = (await import('hono/logger')).logger
    cors = (await import('hono/cors')).cors
}
// 下载deno
// 编译，运行 deno run --allow-net --allow-env .\cloudflare-workers.js
// https://honojs.dev/docs/getting-started/deno/

if (isNode) serve = (await import('@hono/node-server')).serve
// https://honojs.dev/
const app = new Hono()
app.use('/', cors())
// https://honojs.dev/docs/builtin-middleware/cors/
app.use('/api', cors({
    origin: 'https://xucux.github.io/',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 700,
    credentials: true,
  }))
app.use('*', logger())
app.get('/api', api)
app.get('/', (c) => c.html(
    `<!DOCTYPE html>
      <p style="color: #9b9b9b">${config.HELLO}</p>`
))

if (isDeno) {
    serve(app.fetch, { port: config.PORT })
} else if (isNode) {
    serve({
        fetch: app.fetch,
        port: config.PORT
    })
}

export default app
