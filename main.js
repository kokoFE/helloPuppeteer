
const puppeteer = require('puppeteer');
const EventEmitter = require('events');
const emitter = new EventEmitter()
emitter.setMaxListeners(0)
// process.setMaxListeners(Infinity);
const CREDS = require('./creds');
// npm install -g jsondiffpatch
// str.replace(/<[^>]+>/g,"");
const USERNAME_SELECTOR = '#login_field';
const PASSWORD_SELECTOR = '#password';
const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

async function run (error) {
  let start = Date.parse(new Date());
  const browser = await puppeteer.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  await page.goto('https://cn.vuejs.org/v2/guide/');
  const guideMenu = await getMenus(page)

  // Array.prototype.forEach.apply(guideMenu)
    await guideMenu.forEach(async (item, index) => {
      if (item.href) {
        setTimeout(async () => {
          try {
            await page.goto(item.href)
            const CONTEXT_SELECTOR = '#main > div.content.guide.with-sidebar';
            await page.evaluate((contextSelector) => {
              console.log(document)
              const $context = document.querySelector(contextSelector);
              // console.log($context)
            }, CONTEXT_SELECTOR)
          } catch (error) {
            console.log('error:' + error)
          }
        }, index * 1000)
        // try {
        //   await page.goto(item.href);
        //   const CONTEXT_SELECTOR = '#main > div.content.guide.with-sidebar.installation-guide';
        //   await page.evaluate((contextSelector) => {
        //     const context = document.querySelector(contextSelector);
        //     console.log(context)
        //   }, CONTEXT_SELECTOR)
        // } catch (error) {
        //   console.log('error:' + error);
        // }
      }
    })

  // await page.click(USERNAME_SELECTOR);

  // await page.screenshot({ path: 'screenshots/github.png'})
  let end = Date.parse(new Date());
  let duration = end - start;
  console.log(duration)
  // await browser.close();
};

async function getMenus (page) {
  const MENU_ROOT = 'ul.menu-root';
  const MENU_ITEM = '#main > div.sidebar > div > div > ul > li'

  const users = await page.evaluate((menuItem) => {
    return Array.prototype.slice.apply(document.querySelectorAll(menuItem))
      .map($menuItem => {
        isFirstClassMenu = !!$menuItem.querySelector('h3');
        if (isFirstClassMenu) return {
          desc: $menuItem.querySelector('h3').innerText
        }
        const title = $menuItem.querySelector('a.sidebar-link').innerText;
        const href = $menuItem.querySelector('a.sidebar-link').href;
        return {
          title,
          href
        };
      });
      // .filter(u => !!u.location);
  }, MENU_ITEM);
  console.log(users)
  return users
}

run();