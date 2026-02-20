import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: '消费电子',
      links: [
        { text: '耳机音频', href: getPermalink('audio', 'category') },
        { text: '智能家居', href: getPermalink('smart-home', 'category') },
        { text: '手机平板', href: getPermalink('mobile', 'category') },
        { text: '电脑设备', href: getPermalink('computing', 'category') },
        { text: '键鼠外设', href: getPermalink('peripherals', 'category') },
        { text: '苹果生态', href: getPermalink('apple', 'category') },
      ],
    },
    {
      text: 'AI & SaaS',
      links: [
        { text: 'AI 工具', href: getPermalink('ai-tools', 'category') },
        { text: 'AI 资讯', href: getPermalink('ai-news', 'category') },
        { text: 'SaaS 工具', href: getPermalink('saas', 'category') },
        { text: '开源项目', href: getPermalink('open-source', 'category') },
        { text: '生产力', href: getPermalink('productivity', 'category') },
      ],
    },
    {
      text: '产品',
      links: [
        { text: 'Mac mini - AI Server', href: getPermalink('/product/mac-mini') },
        { text: 'All Reviews', href: getBlogPermalink() },
      ],
    },
    {
      text: '关于',
      links: [
        { text: '关于我们', href: getPermalink('/about') },
        { text: '联系方式', href: getPermalink('/contact') },
        { text: '投稿合作', href: getPermalink('/contact') },
      ],
    },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: '内容分类',
      links: [
        { text: '消费电子', href: getBlogPermalink() },
        { text: 'AI & SaaS', href: getBlogPermalink() },
        { text: '热门榜单', href: getBlogPermalink() },
        { text: '对比评测', href: getBlogPermalink() },
      ],
    },
    {
      title: '消费电子',
      links: [
        { text: '耳机音频', href: getPermalink('audio', 'category') },
        { text: '智能家居', href: getPermalink('smart-home', 'category') },
        { text: '手机平板', href: getPermalink('mobile', 'category') },
        { text: '键鼠外设', href: getPermalink('peripherals', 'category') },
      ],
    },
    {
      title: 'AI & SaaS',
      links: [
        { text: 'AI 工具', href: getPermalink('ai-tools', 'category') },
        { text: 'AI 资讯', href: getPermalink('ai-news', 'category') },
        { text: 'SaaS 工具', href: getPermalink('saas', 'category') },
        { text: '开源项目', href: getPermalink('open-source', 'category') },
      ],
    },
    {
      title: '其他',
      links: [
        { text: '关于我们', href: getPermalink('/about') },
        { text: '联系方式', href: getPermalink('/contact') },
        { text: '隐私政策', href: getPermalink('/privacy') },
        { text: '服务条款', href: getPermalink('/terms') },
      ],
    },
  ],
  secondaryLinks: [
    { text: '隐私政策', href: getPermalink('/privacy') },
    { text: '服务条款', href: getPermalink('/terms') },
  ],
  socialLinks: [
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: '#' },
  ],
  footNote: `
    © 2025 科技优选 · 你的消费电子与AI工具指南
  `,
};
