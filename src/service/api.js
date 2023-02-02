import Providers from "../providers/index.js"
import { get_runtime } from "../util.js"
import flags from "../flags.js"
import { format as lyricFormat, getPathFromURL } from "../util.js"


function checkrefer(referer){
    return flags.REFERER_CHECK.split(",").find(s => referer.includes(s))
}

export default async (ctx) => {
    const referer = ctx.req.headers.get('Referer')
    console.log(referer)
    // 如果允许空referer则放行，即只有REFERER_EMPTY为true是允许放行
    if (!(flags.REFERER_EMPTY === true || flags.REFERER_EMPTY === 'true')) {
        if( (!referer || referer === null || referer === '') ) {
            ctx.status(500)
            return ctx.json({ status: 500, message: 'Gateway Error' })
        }
    }

    // 如果referer包含放行的域名，则放行
    if( referer && flags.REFERER_CHECK && checkrefer(referer)  ) {
        ctx.status(500)
        return ctx.json({ status: 500, message: 'Error Referer' })
    }
    const p = new Providers()

    const query = ctx.req.query()
    const server = query.server || 'tencent'
    const type = query.type || 'playlist'
    const id = query.id || '7326220405'

    if (!p.get_provider_list().includes(server)) {
        ctx.status(400)
        return ctx.json({ status: 400, message: 'server 参数不合法' })
    }
    if (!p.get(server).support_type.includes(type)) {
        ctx.status(400)
        return ctx.json({ status: 400, message: 'type 参数不合法' })
    }

    let data = await p.get(server).handle(type, id)

    if (type === 'url') {
        let url = data

        if (!url) {
            ctx.status(403)
            return ctx.json({ error: 'no url' })
        }
        if (url.startsWith('@'))
            return ctx.text(url)

        return ctx.redirect(url)
    }

    if (type === 'pic') {
        return ctx.redirect(data)
    }

    if (type === 'lrc') {
        return ctx.text(lyricFormat(data.lyric, data.tlyric || ''))
    }

    const runtime = get_runtime()
    const perfix = ctx.req.header('X-Forwarded-Url')
    let req_url = perfix ? perfix + getPathFromURL(ctx.req.url.split('?')[0]) : ctx.req.url.split('?')[0]
    if (runtime === 'vercel') req_url = req_url.replace('http://', 'https://')

    return ctx.json(data.map(x => {
        for (let i of ['url', 'pic', 'lrc']) {
            const _ = String(x[i])
            if (!_.startsWith('@') && !_.startsWith('http') && _.length > 0) {
                x[i] = `${req_url}?server=${server}&type=${i}&id=${_}`
            }
        }
        return x
    }))
}
