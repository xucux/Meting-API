let OVERSEAS;
if (typeof globalThis?.WebSocketPair === 'function') {
    OVERSEAS = '1'
} else {
    OVERSEAS = globalThis?.Deno?.env?.get("OVERSEAS") || globalThis?.process?.env?.OVERSEAS
}

const PORT = globalThis?.Deno?.env?.get("PORT") || globalThis?.process?.env?.PORT || 3000

OVERSEAS = (OVERSEAS === '1')

const BANNER = `

██████   ██████           █████     ███                     
▒▒██████ ██████           ▒▒███     ▒▒▒                      
 ▒███▒█████▒███   ██████  ███████   ████  ████████    ███████
 ▒███▒▒███ ▒███  ███▒▒███▒▒▒███▒   ▒▒███ ▒▒███▒▒███  ███▒▒███
 ▒███ ▒▒▒  ▒███ ▒███████   ▒███     ▒███  ▒███ ▒███ ▒███ ▒███
 ▒███      ▒███ ▒███▒▒▒    ▒███ ███ ▒███  ▒███ ▒███ ▒███ ▒███
 █████     █████▒▒██████   ▒▒█████  █████ ████ █████▒▒███████
▒▒▒▒▒     ▒▒▒▒▒  ▒▒▒▒▒▒     ▒▒▒▒▒  ▒▒▒▒▒ ▒▒▒▒ ▒▒▒▒▒  ▒▒▒▒▒███
                                                     ███ ▒███
                                                    ▒▒██████ 
                                                     ▒▒▒▒▒▒  
`

const HELLO = "你好，这是Meting-API 自行部署请参考 https://github.com/xizeyoupan/Meting-API"

export default {
    OVERSEAS,
    isDeno: globalThis?.Deno !== undefined,
    PORT,
    BANNER,
    HELLO
}
