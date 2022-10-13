const puppeteer = require("puppeteer");
const path = require('path');
const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
}

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe('Flexbox, Grid and Positioning', () => {
    it("Page should be styled with flexbox", async () => {
        const flexBox = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('display')));
        expect(flexBox.some(f => f === 'flex')).toBe(true);
    })
    it("Page should be styled with grid", async () => {
        const grid = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('display')));
        expect(grid.some(f => f === 'grid')).toBe(true);
    })
    it("Page should be styled with positioning", async () => {
        const poositions = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('position')));
        expect(poositions.some(f => f !== 'static')).toBe(true);
    })
})

describe('Fonts and Icons', () => {
    it("Font Awesome CDN Script should be loaded", async () => {
        const link = await page.$('link[href*="fontawesome"]');
        expect(link).toBeTruthy()
    });
    
    it("'Gill Sans' Font should be present", async () => {
        const fontFamilies = await page.$$eval('body, body *', els => els.map((el) => getComputedStyle(el).fontFamily.split(',')[0]));
        console.log(fontFamilies)
        expect(fontFamilies).toContain('"Gill Sans"');
    });
});

describe('Images', () => {
    it("Page Should contain 9 images/thumbnails", async () => {
        const allBackgroundProperties = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('background-image')));
        const validBackgroundProperties = allBackgroundProperties.filter(e => e !== 'none');
        const imgTags = await page.$$('img')
        expect(imgTags.length >= 9 || validBackgroundProperties.length >= 9).toBeTruthy()
    });
})