import Providers from "../providers/index.js"
import { format as lyricFormat, getPathFromURL } from "../util.js"

export default async (ctx) => {
    const referer = ctx.req.headers.get('Referer')
    console.log(referer)
    if(!referer || referer === '') {
        ctx.status(500)
        return ctx.json({ status: 500, message: 'Gateway Error' })
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

        if (server === 'netease') {
            url = url
                .replace('://m7c.', '://m7.')
                .replace('://m8c.', '://m8.')
                .replace('http://', 'https://')
        }
        if (server === 'tencent') {
            url = url
                .replace('http://', 'https://')
                .replace('://ws.stream.qqmusic.qq.com', '://dl.stream.qqmusic.qq.com')
        }
        if (server === 'baidu') {
            url = url
                .replace('http://zhangmenshiting.qianqian.com', 'https://gss3.baidu.com/y0s1hSulBw92lNKgpU_Z2jR7b2w6buu')
        }
        return ctx.redirect(url)
    }

    if (type === 'pic') {
        return ctx.redirect(data)
    }

    if (type === 'lrc') {
        return ctx.text(lyricFormat(data.lyric, data.tlyric || ''))
    }

    const perfix = ctx.req.header('X-Forwarded-Url')
    const req_url = perfix ? perfix + getPathFromURL(ctx.req.url.split('?')[0]) : ctx.req.url.split('?')[0]

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