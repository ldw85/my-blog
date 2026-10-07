#!/usr/bin/env node
/**
 * Google Ads 埋点注入器 —— 给「无 frontmatter 的静态页面」补埋点
 *
 * 背景 (2026-10-07): my-blog 里有一批页面是裸 HTML (无 Astro frontmatter),
 * 用不了 <AdsTagHead /> / <AffiliateClick /> 组件, 之前一直是零埋点。
 *
 * 本脚本从 src/config/tracking.ts 读取配置, 生成脚本片段并注入到静态页面。
 * 这样保持单一数据源 (改账号只改 tracking.ts, 不必改 HTML, 也避免硬编码魔法字符串)。
 *
 * 用法:
 *   node scripts/inject-ads-snippet.mjs           # 注入/更新所有静态页面
 *   node scripts/inject-ads-snippet.mjs --check   # 只检查是否已是最新 (CI 用)
 *
 * 幂等: 每次运行都按 MARKER 之间的内容整体替换, 可反复执行。
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK_ONLY = process.argv.includes('--check');

const HEAD_BEGIN = '<!-- ADS_TAG_HEAD:BEGIN (自动注入, 勿手改) -->';
const HEAD_END = '<!-- ADS_TAG_HEAD:END -->';
const CLICK_BEGIN = '<!-- AFFILIATE_CLICK:BEGIN (自动注入, 勿手改) -->';
const CLICK_END = '<!-- AFFILIATE_CLICK:END -->';

/**
 * 需要注入的静态页面。
 * selectors 留空 = 该页没有联盟 CTA, 只补埋点头部。
 */
const PAGES = [
  {
    file: 'src/pages/product/samsung-galaxy-tab-a11.astro',
    reason: '有 CTA 转化脚本但从未加载 gtag.js → 转化全丢',
    selectors: ['a.hero-cta-btn', 'a.sticky-cta-btn', 'a.final-btn'],
  },
  {
    file: 'src/pages/product/easter-gifts.html',
    reason: '裸 HTML, 完全零埋点',
    selectors: ['a.sticky-cta-btn', 'a.hero-btn', 'a.final-btn', 'a.other-card'],
  },
  {
    file: 'src/pages/product/easter-gifts-b.html',
    reason: '裸 HTML, 完全零埋点',
    selectors: ['a.sticky-cta-btn', 'a.hero-card-cta', 'a.final-btn', 'a.other-card'],
  },
  {
    file: 'src/pages/product/mac-mini-2024.html',
    reason: '裸 HTML, 完全零埋点 (无联盟 CTA, 仅补头部)',
    selectors: [],
  },
];

const cfg = await import(resolve(ROOT, 'src/config/tracking.ts'));

const loaderId = cfg.GTAG_LOADER_ID;
const adTags = cfg.AD_TAGS.map((t) => t.id);
const pageViews = cfg.PAGE_VIEW_CONVERSIONS.map((c) => c.sendTo);
const cta = cfg.CTA_CONVERSION;

const j = (arr) => JSON.stringify(arr);

/**
 * 埋点头部: gtag.js 只加载一次, 其余 AW 号追加 config, 再打 page view 转化。
 * 与 src/components/AdsTagHead.astro 逻辑保持一致。
 */
function headSnippet() {
  return `${HEAD_BEGIN}
<!-- 账号清单: src/config/tracking.ts -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${loaderId}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${j(adTags)}.forEach(function(id){ gtag('config', id); });
${j(pageViews)}.forEach(function(sendTo){ gtag('event', 'conversion', {'send_to': sendTo}); });
</script>
${HEAD_END}`;
}

/** CTA 点击转化: 与 src/components/AffiliateClick.astro 逻辑保持一致 */
function clickSnippet(selectors) {
  return `${CLICK_BEGIN}
<script>
(function(){
  var SEL = ${j(selectors.join(', '))};
  var SEND_TO = ${j(cta.sendTo)};
  var VALUE = ${cta.value};
  var CURRENCY = ${j(cta.currency)};
  window.__acB = window.__acB || {};
  function go(url){ window.open(url, '_blank'); }
  function bind(){
    if (window.__acB[SEL]) return;
    document.querySelectorAll(SEL).forEach(function(el){
      el.addEventListener('click', function(e){
        var url = this.getAttribute('href');
        if (!url || url.charAt(0) === '#') return;
        e.preventDefault();
        if (typeof gtag === 'undefined') { go(url); return; }
        gtag('event', 'conversion', {
          'send_to': SEND_TO, 'value': VALUE, 'currency': CURRENCY,
          'event_callback': function(){ go(url); }
        });
        setTimeout(function(){ go(url); }, 4000);
      });
    });
    window.__acB[SEL] = true;
  }
  bind();
  document.addEventListener('astro:page-load', bind);
})();
</script>
${CLICK_END}`;
}

/** 替换 MARKER 之间的内容; 若不存在则插到指定锚点前 */
function upsert(src, { begin, end, snippet }, anchor) {
  const b = src.indexOf(begin);
  if (b !== -1) {
    const e = src.indexOf(end, b);
    if (e === -1) throw new Error(`片段缺少结束标记: ${begin}`);
    return src.slice(0, b) + snippet + src.slice(e + end.length);
  }
  const i = src.indexOf(anchor);
  if (i === -1) throw new Error(`找不到锚点 <${anchor}>`);
  return src.slice(0, i) + snippet + '\n' + src.slice(i);
}

let changed = 0;
let stale = [];

for (const page of PAGES) {
  const path = resolve(ROOT, page.file);
  const original = readFileSync(path, 'utf-8');

  let next = upsert(original, { begin: HEAD_BEGIN, end: HEAD_END, snippet: headSnippet() }, '</head>');

  if (page.selectors.length) {
    next = upsert(
      next,
      { begin: CLICK_BEGIN, end: CLICK_END, snippet: clickSnippet(page.selectors) },
      '</body>',
    );
  }

  if (next === original) {
    console.log(`  ✓ 已是最新  ${page.file}`);
    continue;
  }
  stale.push(page.file);
  if (CHECK_ONLY) continue;
  writeFileSync(path, next, 'utf-8');
  changed++;
  console.log(`  ✎ 已更新   ${page.file}  (${page.reason})`);
}

if (CHECK_ONLY && stale.length) {
  console.error(`\n❌ 以下页面埋点未同步 (跑 node scripts/inject-ads-snippet.mjs):\n${stale.map((s) => '   ' + s).join('\n')}`);
  process.exit(1);
}

console.log(
  CHECK_ONLY
    ? '\n✓ 静态页面埋点全部最新'
    : `\n完成: ${changed} 个页面更新, ${PAGES.length - changed} 个已最新`,
);