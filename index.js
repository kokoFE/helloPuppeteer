const puppeteer = require('puppeteer');
const CREDS = require('./creds');

const USERNAME_SELECTOR = '#login_field';
const PASSWORD_SELECTOR = '#password';
const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://github.com/login');
  // await page.click(USERNAME_SELECTOR);
  await page.type(USERNAME_SELECTOR, CREDS.username);
  await page.type(PASSWORD_SELECTOR, CREDS.password);
  await page.click(BUTTON_SELECTOR);
  
  const userToSearch = 'john';
  const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;
  await page.goto(searchUrl);
  await page.waitFor(2 * 1000);
  // await page.screenshot({ path: 'screenshots/github.png'})

  // await browser.close();
})();