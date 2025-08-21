import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { expect, test } from '@playwright/test';

test('Lighthouse audit', async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const results = await lighthouse('http://localhost:3000', options);
  await chrome.kill();

  const scores = {
    performance: results.lhr.categories.performance.score * 100,
    accessibility: results.lhr.categories.accessibility.score * 100,
    bestPractices: results.lhr.categories['best-practices'].score * 100,
    seo: results.lhr.categories.seo.score * 100,
  };

  expect(scores.performance).toBeGreaterThan(90);
  expect(scores.accessibility).toBeGreaterThan(90);
  expect(scores.bestPractices).toBeGreaterThan(90);
  expect(scores.seo).toBeGreaterThan(90);
});