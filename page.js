const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
app.use(bodyParser());
const jsesc = require('jsesc');


(async () => {
    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch({
        //默认配置
        headless: false,   //有浏览器界面启动
        args: [

        ],
    });
    app.use(async ctx => {
        let url = ctx.query.url
        if (url == null) {
            ctx.status = 403;
            ctx.body = "url参数必填";
            return
        }
        console.log(url, 1, ctx.query)
        let htmlContent
        const page = await browser.newPage()
        // 捕获异常
        try {
            // 设置代理
            await page.authenticate({
                username: proxyUser,
                password: proxyPass
            });
            await page.goto(url)
            htmlContent = await page.content()

        } catch (e) {
            console.log(e, 3333);
            await page.deleteCookie();
            await page.close()
            ctx.status = 500;
            ctx.body = e;
            // 释放变量
            htmlContent = null
            url = null

            return
        }

        // 关闭浏览器页面
        await page.deleteCookie();
        await page.close()
        ctx.body = htmlContent;

        // 释放变量
        htmlContent = null
        url = null

        return
    });
    app.listen(2003);
})();
