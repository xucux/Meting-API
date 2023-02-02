import { parse } from "https://deno.land/std@0.175.0/flags/mod.ts";
// https://deno.land/std@0.163.0/flags/README.md?source=
let params = parse(Deno.args);
console.dir(params);

let OVERSEAS;
if (typeof globalThis?.WebSocketPair === 'function') {
    OVERSEAS = '1'
} else {
    OVERSEAS = globalThis?.Deno?.env?.get("OVERSEAS") || globalThis?.process?.env?.OVERSEAS
}

OVERSEAS = (OVERSEAS === '1')

// const PORT = globalThis?.Deno?.env?.get("PORT") || globalThis?.process?.env?.PORT || 3000

// const ORIGIN = globalThis?.Deno?.env?.get("ORIGIN") || globalThis?.process?.env?.ORIGIN || "https://xucux.github.io"

// const DOMAIN = globalThis?.Deno?.env?.get("DOMAIN") || globalThis?.process?.env?.DOMAIN || "xucux.github.io"

const PORT = params['PORT'] || 3000

const ORIGIN = params['ORIGIN'] || "*"

const DOMAIN = params['DOMAIN'] || ""

const REFERER_EMPTY = params['REFERER_EMPTY']

const HELLO = "你好，这是Meting-API 自行部署请参考 https://github.com/xizeyoupan/Meting-API"
export default {
    OVERSEAS,
    // isDeno: globalThis?.Deno !== undefined,
    isDeno: true,
    PORT,
    HELLO,
    ORIGIN,
    DOMAIN,
    REFERER_EMPTY
}
