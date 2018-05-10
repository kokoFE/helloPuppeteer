const puppeteer = require('puppeteer');
const CREDS = require('./creds');

const USERNAME_SELECTOR = '#login_field';
const PASSWORD_SELECTOR = '#password';
const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

async function run () {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://github.com/login');
  // await page.goto('https://www.jianshu.com/sign_in');
  // await page.click(USERNAME_SELECTOR);
  await page.type(USERNAME_SELECTOR, CREDS.username);
  await page.type(PASSWORD_SELECTOR, CREDS.password);
  await page.click(BUTTON_SELECTOR);
  
  const userToSearch = 'vue';
  const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;
  await page.goto(searchUrl);
  await page.waitFor(2 * 1000);
  // await page.screenshot({ path: 'screenshots/github.png'})

  const USER_LIST_INFO_SELECTOR = '.user-list-item';
  const USER_LIST_USERNAME_SELECTOR = '.user-list-info>a:nth-child(1)';
  const USER_LIST_LOCATION_SELECTOR = '.user-list-info>.user-list-meta li.mr-3';
  
  const numPages = await getNumPages(page);
  for (let h = 1; h <= numPages; h++) {
    await page.goto(`${searchUrl}&p=${h}`)
  }
  const users = await page.evaluate((sInfo, sName, sLocation) => {
    return Array.prototype.slice.apply(document.querySelectorAll(sInfo))
      .map($userListItem => {
        const username = $userListItem.querySelector(sName).innerText;
        const $location = $userListItem.querySelector(sLocation);
        const location = $location ? $location.innerText.trim() : undefined;
        return {
          username,
          location
        };
      });
      // .filter(u => !!u.location);
  }, USER_LIST_INFO_SELECTOR, USER_LIST_USERNAME_SELECTOR, USER_LIST_LOCATION_SELECTOR);

  console.log(users)
  console.log('index end')
  await browser.close();
};

async function getNumPages (page) {
  const NUM_USER_SELECTOR = '#js-pjax-container > div > div.columns > div.column.three-fourths.codesearch-results > div > div.d-flex.flex-justify-between.border-bottom.pb-3 > h3';

  let inner = await page.evaluate((sel) => {
    return document.querySelector(sel).innerHTML;
  }, NUM_USER_SELECTOR);

  inner = inner.replace(',', '').replace(' user', '');
  const numUsers = parseInt(inner);
  console.log('numUsers：', numUsers);

  const numPages = Math.ceil(numUsers / 10);
  return numPages;
}

run();