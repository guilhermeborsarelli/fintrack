import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
export default defineConfig({
  testDir:'./tests',testMatch:'**/browser.spec.js',workers:1,
  use:{browserName:'chromium',launchOptions:{...(existsSync('/usr/bin/chromium')?{executablePath:'/usr/bin/chromium'}:{}),args:['--no-sandbox']},headless:true},
  webServer:{command:'npm run dev -- --port 5173 --strictPort',url:'http://localhost:5173',reuseExistingServer:!process.env.CI},
  reporter:'list'
});
