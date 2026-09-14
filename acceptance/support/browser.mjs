import {chromium} from 'playwright';
export const browserLabel='Playwright Chromium 1.62.1 desktop headless';
export const launchBrowser=()=>chromium.launch({headless:true});
