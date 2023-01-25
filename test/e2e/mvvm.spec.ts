import puppeteer from "puppeteer";
import * as path from "path";

describe('mvvm', () => {
    test('normal work', async () => {
        // 用于获取dom文本内容
        const getText = async (selector: string) => {
            return await page.$eval(selector, x => x.textContent)
        }

        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.goto(`file://${path.resolve(__dirname, `mvvm.html`)}`)

        // 输入事件
        await page.type('#case-1 input', ' world')
        expect(await page.$eval('#case-1 input', x => x.value)).toBe('hello world')
        expect(await getText('#case-1 h1')).toBe('hello world')

        // 点击事件
        await page.click('#case-2 button')
        expect(await getText('#case-2 button')).toBe('not showing')
        expect(await getText('#case-2 h1')).toContain('1')

        await page.click('#case-2 button')
        expect(await getText('#case-2 button')).toBe('is showing')
        expect(await getText('#case-2 h1')).toContain('2')
    })
})