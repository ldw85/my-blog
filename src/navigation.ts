import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Electronics',
      links: [
        { text: 'Audio & Headphones', href: getPermalink('audio', 'category') },
        { text: 'Smart Home', href: getPermalink('smart-home', 'category') },
        { text: 'Phones & Tablets', href: getPermalink('mobile', 'category') },
        { text: 'Computers', href: getPermalink('computing', 'category') },
        { text: 'Peripherals', href: getPermalink('peripherals', 'category') },
        { text: 'Apple', href: getPermalink('apple', 'category') },
        { text: 'Other', href: getPermalink('other', 'category') },
      ],
    },
    {
      text: 'AI & SaaS',
      links: [
        { text: 'AI Tools', href: getPermalink('ai-tools', 'category') },
        { text: 'AI News', href: getPermalink('ai-news', 'category') },
        { text: 'SaaS Tools', href: getPermalink('saas', 'category') },
        { text: 'Open Source', href: getPermalink('open-source', 'category') },
        { text: 'Productivity', href: getPermalink('productivity', 'category') },
      ],
    },
    {
      text: 'Products',
      links: [
        { text: 'Mac mini - AI Server', href: getPermalink('/product/mac-mini') },
        { text: 'Apple Watch Series 11', href: getPermalink('/product/apple-watch') },
        { text: 'All Products', href: getPermalink('/products') },
      ],
    },
    {
      text: 'About',
      links: [
        { text: 'About Us', href: getPermalink('/about') },
        { text: 'Contact', href: getPermalink('/contact') },
        { text: 'Contribute', href: getPermalink('/contact') },
      ],
    },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: 'Categories',
      links: [
        { text: 'Consumer Electronics', href: getBlogPermalink() },
        { text: 'AI & SaaS', href: getBlogPermalink() },
        { text: 'Top Rankings', href: getBlogPermalink() },
        { text: 'Comparisons', href: getBlogPermalink() },
        { text: 'Holiday Deals', href: getPermalink('/landing-pages') },
      ],
    },
    {
      title: 'Electronics',
      links: [
        { text: 'Audio & Headphones', href: getPermalink('audio', 'category') },
        { text: 'Smart Home', href: getPermalink('smart-home', 'category') },
        { text: 'Phones & Tablets', href: getPermalink('mobile', 'category') },
        { text: 'Peripherals', href: getPermalink('peripherals', 'category') },
      ],
    },
    {
      title: 'AI & SaaS',
      links: [
        { text: 'AI Tools', href: getPermalink('ai-tools', 'category') },
        { text: 'AI News', href: getPermalink('ai-news', 'category') },
        { text: 'SaaS Tools', href: getPermalink('saas', 'category') },
        { text: 'Open Source', href: getPermalink('open-source', 'category') },
      ],
    },
    {
      title: 'More',
      links: [
        { text: 'About Us', href: getPermalink('/about') },
        { text: 'Contact', href: getPermalink('/contact') },
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
        { text: 'Terms of Service', href: getPermalink('/terms') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
    { text: 'Terms of Service', href: getPermalink('/terms') },
  ],
  socialLinks: [
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: '#' },
  ],
  footNote: `
    © 2026 TechReviews - Your Guide to Consumer Electronics & AI Tools
  `,
};
