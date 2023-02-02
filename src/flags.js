import { get_runtime } from "./util.js"
import { parse } from "https://deno.land/std@0.175.0/flags/mod.ts";


const runtime = get_runtime()
console.log("system runtime:"+runtime)

// https://deno.land/std@0.163.0/flags/README.md
let params = parse(Deno.args);
console.dir(params);

// 端口
const PORT = params['PORT'] || 3000
// access-control-allow-origin
const ORIGIN = params['ORIGIN'] || "https://xucux.github.io"
// 域名
const DOMAIN = params['DOMAIN'] || "xucux.github.io"
// REFERER允许为空
const REFERER_EMPTY = params['REFERER_EMPTY'] || true
// 校验REFERER
const REFERER_CHECK = params['REFERER_CHECK'] || null

const CROS = {
    origin: ORIGIN,
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
    exposeHeaders: ['Content-Length'],
    maxAge: 700,
    credentials: true,
  }

const HELLO_WORLD = params['HELLO_WORLD'] || "🎊你好，这是Meting-API🚀 自行部署请参考 https://github.com/xizeyoupan/Meting-API"

export default {
    PORT,
    ORIGIN,
    DOMAIN,
    REFERER_EMPTY,
    REFERER_CHECK,
    CROS,
    HELLO_WORLD
}

