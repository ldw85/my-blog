/**
 * Google Ads 跟踪配置 —— 单一数据源 (single source of truth)
 *
 * 所有 Google Ads 相关的 ID / 转化标签一律写在这里，代码中禁止再出现魔法字符串。
 * 新增/删除广告账号只改本文件，不用动 Layout 或组件。
 *
 * 背景 (2026-10-07): 之前 AW 号散落在 Layout.astro 硬编码 + GoogleTag.astro 组件参数 +
 * 4 个页面各自复制的 gtag_report_conversion 脚本里，导致:
 *   1. 同一页面加载两次 gtag.js
 *   2. 页面一打开就误打 conversion (灌水)
 *   3. 不走 Layout 的独立页面漏埋点
 * 本文件是统一收口。
 */

/** 需要在页面上 config 的 Google Ads 账号 (AW 号) */
export interface AdTag {
  /** AW 号, 如 AW-18013696631 */
  id: string;
  /** 账号用途备注 */
  note: string;
}

/* ── AW 号常量 ─────────────────────────────────────────────────────── */

/** 主转化账号: CTA 点击转化走这个号 */
export const AW_MAIN = 'AW-18013696631';
/**
 * 备用账号: 历史上只有 2 个页面 (luxury-accessories / mary-jane-sneakers) 按需加载过它。
 *
 * ⚠️ 故意 **不** 放进 AD_TAGS: 那 2 个页面通过 GoogleTag.astro 单独 config 这个号,
 * 若全站再 config 一次, 该账号的 page view 会被重复计数 2 倍。
 */
export const AW_SECONDARY = 'AW-17760696639';
/** 新接入账号 (2026-10-07): 后台类别为「网页浏览 / Page view」 */
export const AW_PAGEVIEW = 'AW-18417039939';

/**
 * 全站需要跟踪的 Google Ads 账号。
 *
 * ⚠️ 重要: gtag.js 脚本全页只加载一次 (取第一个 AW 号作为 loader id), 其余账号仅通过
 * `gtag('config', id)` 追加 —— 多个 AW 号共用同一个 dataLayer 与同一个 gtag.js, 不会冲突。
 * 重复加载两次 gtag.js 才是冲突的根因。
 * 参考: https://support.google.com/tagmanager/answer/12326985
 */
export const AD_TAGS: AdTag[] = [
  { id: AW_MAIN, note: '主转化账号 —— CTA 点击转化' },
  { id: AW_PAGEVIEW, note: '网页浏览类别转化账号 (2026-10-07 接入)' },
];

/** gtag.js 脚本的 loader ID: 全站只加载一次, 取第一个 AW 号 */
export const GTAG_LOADER_ID = AD_TAGS[0].id;

/* ── 转化事件 ──────────────────────────────────────────────────────── */

export interface PageViewConversion {
  /** 完整转化标签, 格式必须是 AW-ID/label, 否则跨账号时 Google 无法路由 */
  sendTo: string;
  note: string;
}

/**
 * 页面加载时触发的转化事件。
 *
 * 来源: Google Ads 后台 "Page view" 转化动作给出的 Event snippet (David 2026-10-07 提供)。
 *
 * ⚠️ 待验证: 后台类别为「网页浏览」的转化动作, 在执行 `gtag('config', id)` 时通常已经会记一次
 * page view。这里额外显式打一次 event, 若上线后发现后台 Page view 转化数约为预期的 2 倍,
 * 说明两处重复计数 —— 只需把本数组清空, 不需要改任何其他代码。
 */
export const PAGE_VIEW_CONVERSIONS: PageViewConversion[] = [
  {
    sendTo: `${AW_PAGEVIEW}/oioLCM2MoPQcEMP09s1E`,
    note: '网页浏览类别转化 (Google Ads 后台 Event snippet)',
  },
];

/* ── CTA 点击转化 ──────────────────────────────────────────────────── */

/**
 * CTA 点击转化 (affiliate 出站点击)。
 * value/currency 沿用现有线上实现, 保持历史数据可比。
 */
export const CTA_CONVERSION = {
  sendTo: `${AW_MAIN}/-luUCMfpjZEcEPfkzI1D`,
  value: 0.5,
  currency: 'CNY',
} as const;

/** 备用 CTA 点击转化 label (仅 macbook-neo 使用, 保留兼容) */
export const CTA_CONVERSION_MACBOOK = {
  sendTo: `${AW_MAIN}/tmFtCPCO6J8cEPfkzI1D`,
  value: 0.5,
  currency: 'CNY',
} as const;

/** 完整校验: sendTo 必须符合 AW-ID/label 格式, 否则跨账号时 Google 无法路由 */
export function isValidSendTo(sendTo: string): boolean {
  return /^AW-\d+\/[A-Za-z0-9_-]+$/.test(sendTo);
}