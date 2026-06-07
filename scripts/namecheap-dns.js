import { chromium } from '@playwright/test';

const NAMECHEAP_USERNAME = process.env.NAMECHEAP_USERNAME;
const NAMECHEAP_PASSWORD = process.env.NAMECHEAP_PASSWORD;
const NAMECHEAP_DOMAIN = process.env.NAMECHEAP_DOMAIN || 'mabroka.org';
const HEADLESS = process.env.PLAYWRIGHT_HEADLESS !== 'false';

if (!NAMECHEAP_USERNAME || !NAMECHEAP_PASSWORD) {
  console.error('Missing required environment variables: NAMECHEAP_USERNAME and NAMECHEAP_PASSWORD');
  console.error('Example: NAMECHEAP_USERNAME=me NAMECHEAP_PASSWORD=secret npm run dns:namecheap');
  process.exit(1);
}

const aRecords = [
  { host: '@', value: '185.199.108.153' },
  { host: '@', value: '185.199.109.153' },
  { host: '@', value: '185.199.110.153' },
  { host: '@', value: '185.199.111.153' },
];

const cnameRecords = [
  { host: 'www', value: 'belabedmohammed.github.io' },
];

async function login(page) {
  console.log('Opening Namecheap login page...');
  await page.goto('https://www.namecheap.com/myaccount/login/');
  await page.waitForLoadState('networkidle');

  const usernameLocator = page.locator('input[name="username"], input[type="email"], input[name="LoginUserName"]');
  const passwordLocator = page.locator('input[name="password"], input[type="password"], input[name="LoginPassword"]');
  await usernameLocator.fill(NAMECHEAP_USERNAME);
  await passwordLocator.fill(NAMECHEAP_PASSWORD);

  const signInButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Log In"), button:has-text("Login")');
  await signInButton.first().click();

  await page.waitForLoadState('networkidle');
  console.log('Waiting for authenticated dashboard...');
  await page.waitForURL(/.*namecheap\.com.*/i, { timeout: 120_000 });
}

async function openAdvancedDns(page) {
  const advancedDnsUrl = `https://ap.www.namecheap.com/domains/advanced-dns/${NAMECHEAP_DOMAIN}`;
  console.log(`Navigating to Advanced DNS for ${NAMECHEAP_DOMAIN}...`);
  await page.goto(advancedDnsUrl);
  await page.waitForLoadState('networkidle');
}

async function addDnsRecord(page, type, host, value) {
  console.log(`Adding ${type} record ${host} -> ${value}`);
  const addButton = page.locator('button:has-text("Add New Record"), button:has-text("Add Record"), button:has-text("Add")');
  await addButton.first().click();

  const row = page.locator('.dns-record-row').last();

  const typeSelector = row.locator('select[aria-label*="Type"], select[name*="type"], select');
  const hostInput = row.locator('input[aria-label*="Host"], input[placeholder*="Host"], input[name*="host"], input[type="text"]');
  const valueInput = row.locator('input[aria-label*="Value"], input[placeholder*="Value"], input[name*="value"], input[type="text"]');

  await typeSelector.selectOption({ label: type }).catch(() => {});
  await hostInput.fill(host).catch(() => {});
  await valueInput.fill(value).catch(() => {});

  const saveButton = page.locator('button:has-text("Save Changes"), button:has-text("Save"), button:has-text("Apply")');
  await saveButton.first().click();
  await page.waitForLoadState('networkidle');
}

async function run() {
  const browser = await chromium.launch({ headless: HEADLESS });
  const page = await browser.newPage();

  try {
    await login(page);
    await openAdvancedDns(page);

    for (const record of aRecords) {
      await addDnsRecord(page, 'A', record.host, record.value);
    }

    for (const record of cnameRecords) {
      await addDnsRecord(page, 'CNAME', record.host, record.value);
    }

    console.log('DNS automation completed. Please verify the entries in Namecheap manually.');
  } catch (error) {
    console.error('Automation failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
