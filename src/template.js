const html = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>测试页面</title>
    <link rel="stylesheet" href="https://unpkg.com/aplayer/dist/APlayer.min.css">
</head>

<body>
    <script src="https://unpkg.com/aplayer/dist/APlayer.min.js"></script>
    <script>
        var meting_api = 'api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
    </script>
    <script src="https://unpkg.com/@xizeyoupan/meting@latest/dist/Meting.min.js"></script>

    <div>网易单曲
    <meting-js server="netease" type="song" id="473403185" />
    </div>

    <div>网易歌单
    <meting-js server="netease" type="playlist" id="6907557348" />
    </div>

    <div>qq单曲
    <meting-js server="tencent" type="song" id="001jDFoN3nXu44" />
    </div>

    <div>qq歌单
    <meting-js server="tencent" type="playlist" id="7326220405" />
    </div>
</body>

</html>
`

export const handler = (c) => {
    return c.html(html)
}
