#!/usr/bin/env node
/**
 * 小兴365 工具站构建脚本
 *
 * 用法（项目根目录）：
 *   node build.js
 *
 * 它会做这些事：
 *   1. 读取 tools.js 的 window.SITE_DATA
 *   2. 重新生成 index.html 里的静态工具卡片、首页 JSON-LD、页脚
 *   3. 同步每个工具页的 title / description / canonical / OG / JSON-LD
 *   4. 在每个工具页插入「关于这个工具 / 怎么用 / 常见问题 / 相关工具」
 *   5. 重新生成 sitemap.xml
 *
 * 不依赖 npm，不联网，不碰 git。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const SITE_URL = 'https://xiaoxing365.top';
const SITE_NAME = '小兴365 工具站';
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

const CATEGORY_ORDER = ['建站工具', '文本处理', '编码转换', '开发工具', '设计工具', '其他'];

function loadSiteData() {
  const file = path.join(ROOT, 'tools.js');
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: file, timeout: 2000 });
  if (!sandbox.window.SITE_DATA) {
    throw new Error('tools.js 没有设置 window.SITE_DATA');
  }
  return sandbox.window.SITE_DATA;
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonLd(value) {
  return JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
}

function isExternal(link) {
  return /^https?:\/\//i.test(String(link || ''));
}

function slugOf(link) {
  return String(link || '')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

function pagePath(link) {
  if (isExternal(link)) return link;
  return '/' + slugOf(link) + '/';
}

function absUrl(link) {
  if (isExternal(link)) return link;
  return SITE_URL + pagePath(link);
}

function toolSeoTitle(tool) {
  return tool.seoTitle || (tool.title + ' - 小兴365');
}

function toolSeoDesc(tool) {
  return tool.seoDesc || tool.desc || '';
}

function appCategory(category) {
  switch (category) {
    case '建站工具': return 'BusinessApplication';
    case '文本处理': return 'UtilitiesApplication';
    case '设计工具': return 'DesignApplication';
    case '编码转换':
    case '开发工具':
    default: return 'DeveloperApplication';
  }
}

function replaceBlock(html, start, end, content, file) {
  const s = html.indexOf(start);
  if (s === -1) throw new Error('[' + file + '] 找不到开始标记 ' + start);
  const e = html.indexOf(end, s + start.length);
  if (e === -1) throw new Error('[' + file + '] 找不到结束标记 ' + end);
  return html.slice(0, s + start.length) + '\n' + content + '\n' + html.slice(e);
}

function groupTools(tools) {
  const groups = new Map();
  tools.forEach(function (tool) {
    const name = tool.category || '其他';
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(tool);
  });
  const names = CATEGORY_ORDER.filter(function (name) { return groups.has(name); });
  groups.forEach(function (_items, name) {
    if (names.indexOf(name) === -1) names.push(name);
  });
  return names.map(function (name) {
    return { name: name, items: groups.get(name) };
  });
}

function renderCard(tool) {
  const external = isExternal(tool.link);
  const search = [tool.title, tool.desc, tool.category, tool.seoTitle, tool.seoDesc]
    .filter(Boolean)
    .join(' ');
  const top = [
    '        <div class="card-top">',
    '          <span class="tool-icon">' + escapeHtml(tool.title.charAt(0)) + '</span>',
    '          <span class="card-arrow">' + (external ? '↗' : '→') + '</span>',
    '        </div>'
  ].join('\n');
  const body = [
    '        <h3>' + escapeHtml(tool.title) + '</h3>',
    '        <p>' + escapeHtml(tool.desc || '') + '</p>',
    '        <span class="card-tag">' + escapeHtml(tool.category || '其他') + '</span>'
  ].join('\n');

  if (tool.soon) {
    return [
      '      <div class="tool-card soon" data-search="' + escapeHtml(search) + '">',
      top,
      body,
      '      </div>'
    ].join('\n');
  }

  return [
    '      <a class="tool-card" href="' + escapeHtml(tool.link) + '" data-search="' + escapeHtml(search) + '"' +
      (external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>',
    top,
    body,
    '      </a>'
  ].join('\n');
}

function renderGroups(tools) {
  return groupTools(tools).map(function (group) {
    return [
      '    <section class="group" data-group="' + escapeHtml(group.name) + '">',
      '      <h2 class="group-title">' + escapeHtml(group.name) + ' <span>' + group.items.length + '</span></h2>',
      '      <div class="tool-grid">',
      group.items.map(renderCard).join('\n'),
      '      </div>',
      '    </section>'
    ].join('\n');
  }).join('\n\n');
}

function renderHomeFooter(data) {
  const footer = data.footer || {};
  const email = footer.email || '';
  const blogUrl = footer.blogUrl || '';
  return [
    '      <div>博客在 <a href="' + escapeHtml(blogUrl) + '">' + escapeHtml(footer.blogText || '') + '</a>，' + escapeHtml(footer.blogNote || '') + '</div>',
    '      <div>有问题发邮件：<a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + '</a></div>',
    '      <div class="footer-links"><a href="/about/">关于本站</a> · <a href="/privacy/">隐私政策</a> · <a href="/contact/">联系我们</a></div>',
    '      <a class="btn" href="' + escapeHtml(blogUrl) + '">' + escapeHtml(footer.buttonText || '去博客看看') + '</a>'
  ].join('\n');
}

function renderHomeJsonLd(data, tools) {
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name || SITE_NAME,
    url: SITE_URL + '/',
    description: data.seoDesc || data.description || '',
    inLanguage: 'zh-CN'
  };
  const list = tools.filter(function (tool) {
    return !tool.soon && !isExternal(tool.link);
  });
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '小兴365 在线工具',
    numberOfItems: list.length,
    itemListElement: list.map(function (tool, index) {
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        url: absUrl(tool.link)
      };
    })
  };
  return [
    '<script type="application/ld+json">' + jsonLd(website) + '</script>',
    '<script type="application/ld+json">' + jsonLd(itemList) + '</script>'
  ].join('\n');
}

function buildHomepage(data) {
  const file = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const tools = data.tools || [];
  const available = tools.filter(function (tool) { return !tool.soon; });
  const title = data.seoTitle || (data.name + ' - 在线工具');
  const desc = data.seoDesc || data.description || '';

  const socialTitle = data.seoTitle || data.name || SITE_NAME;
  const socialDesc = data.description || desc;

  html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>' + escapeHtml(title) + '</title>');
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*>/, '<meta name="description" content="' + escapeHtml(desc) + '">');
  html = html.replace(/<meta\s+name="keywords"\s+content="[^"]*"\s*>/, '<meta name="keywords" content="' + escapeHtml(data.keywords || '') + '">');
  html = html.replace(/<meta\s+property="og:site_name"\s+content="[^"]*"\s*>/, '<meta property="og:site_name" content="' + escapeHtml(data.name || SITE_NAME) + '">');
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*>/, '<meta property="og:title" content="' + escapeHtml(socialTitle) + '">');
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*>/, '<meta property="og:description" content="' + escapeHtml(socialDesc) + '">');
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*>/, '<meta name="twitter:title" content="' + escapeHtml(socialTitle) + '">');
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*>/, '<meta name="twitter:description" content="' + escapeHtml(socialDesc) + '">');
  html = replaceBlock(html, '<!-- TOOLS:START -->', '<!-- TOOLS:END -->', renderGroups(tools), 'index.html');
  html = replaceBlock(html, '<!-- JSONLD:START -->', '<!-- JSONLD:END -->', renderHomeJsonLd(data, tools), 'index.html');
  html = replaceBlock(html, '<!-- FOOTER:START -->', '<!-- FOOTER:END -->', renderHomeFooter(data), 'index.html');
  html = html.replace(/\{\{TOOL_COUNT\}\}/g, String(available.length));
  html = html.replace(/\{\{SITE_NAME\}\}/g, escapeHtml(data.name || SITE_NAME));
  html = html.replace(/\{\{SITE_TAGLINE\}\}/g, escapeHtml(data.tagline || ''));

  fs.writeFileSync(file, html, 'utf8');
  return { total: tools.length, available: available.length };
}

function renderToolSeo(tool) {
  const url = absUrl(tool.link);
  const title = toolSeoTitle(tool);
  const desc = toolSeoDesc(tool);
  const app = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: url,
    description: desc,
    applicationCategory: appCategory(tool.category),
    operatingSystem: 'Any',
    inLanguage: 'zh-CN',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL + '/'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY'
    }
  };

  const lines = [
    '<link rel="canonical" href="' + escapeHtml(url) + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="' + escapeHtml(SITE_NAME) + '">',
    '<meta property="og:title" content="' + escapeHtml(title) + '">',
    '<meta property="og:description" content="' + escapeHtml(desc) + '">',
    '<meta property="og:url" content="' + escapeHtml(url) + '">',
    '<meta property="og:locale" content="zh_CN">',
    '<meta name="twitter:card" content="summary">',
    '<meta name="twitter:title" content="' + escapeHtml(title) + '">',
    '<meta name="twitter:description" content="' + escapeHtml(desc) + '">',
    '<meta name="theme-color" content="#4f46e5" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#0f1115" media="(prefers-color-scheme: dark)">',
    '<script type="application/ld+json">' + jsonLd(app) + '</script>'
  ];

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: SITE_URL + '/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.title,
        item: url
      }
    ]
  };
  lines.push('<script type="application/ld+json">' + jsonLd(breadcrumb) + '</script>');

  if (tool.faqs && tool.faqs.length) {
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map(function (item) {
        return {
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a
          }
        };
      })
    };
    lines.push('<script type="application/ld+json">' + jsonLd(faq) + '</script>');
  }

  return lines.join('\n');
}

function renderToolContent(tool) {
  const lines = [
    '<section class="tool-content card">',
    '  <h2>关于 ' + escapeHtml(tool.title) + '</h2>'
  ];
  if (tool.intro) {
    lines.push('  <p>' + escapeHtml(tool.intro) + '</p>');
  }
  if (tool.steps && tool.steps.length) {
    lines.push('  <h2>怎么用</h2>', '  <ol>');
    tool.steps.forEach(function (step) {
      lines.push('    <li>' + escapeHtml(step) + '</li>');
    });
    lines.push('  </ol>');
  }
  if (tool.faqs && tool.faqs.length) {
    lines.push('  <h2>常见问题</h2>');
    tool.faqs.forEach(function (item) {
      lines.push('  <h3>' + escapeHtml(item.q) + '</h3>');
      lines.push('  <p>' + escapeHtml(item.a) + '</p>');
    });
  }
  lines.push('  <p class="updated">最后更新：' + LAST_UPDATED + '</p>');
  lines.push('</section>');
  return lines.join('\n');
}

function renderRelated(tool, tools) {
  const seen = new Set([tool.link]);
  const related = [];
  const ordered = tools.filter(function (item) {
    return item !== tool && !item.soon && item.category === tool.category;
  }).concat(tools.filter(function (item) {
    return item !== tool && !item.soon && item.category !== tool.category;
  }));

  ordered.forEach(function (item) {
    if (related.length >= 4 || seen.has(item.link)) return;
    seen.add(item.link);
    related.push(item);
  });

  return [
    '<section class="related card">',
    '  <h2>相关工具</h2>',
    '  <div class="related-links">',
    related.map(function (item) {
      return '    <a href="' + escapeHtml(pagePath(item.link)) + '">' + escapeHtml(item.title) + '</a>';
    }).join('\n'),
    '  </div>',
    '</section>'
  ].join('\n');
}

function syncHead(html, seoBlock, file) {
  if (html.indexOf('<!-- SEO:START -->') !== -1) {
    return replaceBlock(html, '<!-- SEO:START -->', '<!-- SEO:END -->', seoBlock, file);
  }
  const descRe = /<meta\s+name="description"\s+content="[^"]*"\s*>/i;
  if (!descRe.test(html)) {
    throw new Error('[' + file + '] 找不到 meta description');
  }
  return html.replace(descRe, function (match) {
    return match + '\n<!-- SEO:START -->\n' + seoBlock + '\n<!-- SEO:END -->';
  });
}

function insertBeforeFooter(html, block, start, end, file) {
  if (html.indexOf(start) !== -1) {
    return replaceBlock(html, start, end, block, file);
  }
  const footerIndex = html.indexOf('<footer>');
  if (footerIndex === -1) {
    throw new Error('[' + file + '] 找不到 <footer>');
  }
  return html.slice(0, footerIndex) + start + '\n' + block + '\n' + end + '\n  ' + html.slice(footerIndex);
}

function addFooterLinks(html, file) {
  const block = '<br><a href="/about/">关于</a> · <a href="/privacy/">隐私政策</a> · <a href="/contact/">联系</a>';
  if (html.indexOf('<!-- FOOTER-LINKS:START -->') !== -1) {
    return replaceBlock(html, '<!-- FOOTER-LINKS:START -->', '<!-- FOOTER-LINKS:END -->', block, file);
  }
  const footerEnd = html.indexOf('</footer>');
  if (footerEnd === -1) {
    throw new Error('[' + file + '] 找不到 </footer>');
  }
  return html.slice(0, footerEnd) +
    '<!-- FOOTER-LINKS:START -->' + block + '<!-- FOOTER-LINKS:END -->\n  ' +
    html.slice(footerEnd);
}

function buildToolPages(data) {
  const tools = data.tools || [];
  const results = [];

  tools.forEach(function (tool) {
    if (tool.soon || isExternal(tool.link)) return;
    const slug = slugOf(tool.link);
    const file = path.join(ROOT, slug, 'index.html');
    if (!fs.existsSync(file)) {
      results.push({ slug: slug, status: 'missing' });
      return;
    }

    let html = fs.readFileSync(file, 'utf8');
    const title = toolSeoTitle(tool);
    const desc = toolSeoDesc(tool);

    html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>' + escapeHtml(title) + '</title>');
    const descRe = /<meta\s+name="description"\s+content="[^"]*"\s*>/i;
    if (descRe.test(html)) {
      html = html.replace(descRe, '<meta name="description" content="' + escapeHtml(desc) + '">');
    } else {
      html = html.replace(/<title>[\s\S]*?<\/title>/, function (match) {
        return match + '\n<meta name="description" content="' + escapeHtml(desc) + '">';
      });
    }

    html = syncHead(html, renderToolSeo(tool), file);
    html = insertBeforeFooter(html, renderToolContent(tool), '<!-- CONTENT:START -->', '<!-- CONTENT:END -->', file);
    html = insertBeforeFooter(html, renderRelated(tool, tools), '<!-- RELATED:START -->', '<!-- RELATED:END -->', file);
    html = addFooterLinks(html, file);

    if (slug === 'domain-price') {
      html = html.replace(/<h1>[\s\S]*?<\/h1>/, '<h1>域名注册价格比价</h1>');
      html = html.replace(/<p class="subtitle">[\s\S]*?<\/p>/, '<p class="subtitle">查询域名后缀在各注册商的注册、续费、转入价格，数据来自哪煮米</p>');
    }

    fs.writeFileSync(file, html, 'utf8');
    results.push({ slug: slug, status: 'ok' });
  });

  return results;
}

function renderSitemap(data) {
  const urls = [
    { loc: SITE_URL + '/', changefreq: 'weekly', priority: '1.0' }
  ];
  (data.tools || []).forEach(function (tool) {
    if (tool.soon || isExternal(tool.link)) return;
    const slug = slugOf(tool.link);
    urls.push({
      loc: absUrl(tool.link),
      changefreq: (slug === 'domain-price' || slug === 'domain-coupons') ? 'weekly' : 'monthly',
      priority: '0.8'
    });
  });
  urls.push(
    { loc: SITE_URL + '/about/', changefreq: 'yearly', priority: '0.3' },
    { loc: SITE_URL + '/privacy/', changefreq: 'yearly', priority: '0.3' },
    { loc: SITE_URL + '/contact/', changefreq: 'yearly', priority: '0.3' }
  );

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];
  urls.forEach(function (item) {
    lines.push('  <url><loc>' + escapeHtml(item.loc) + '</loc><lastmod>' + LAST_UPDATED +
      '</lastmod><changefreq>' + item.changefreq + '</changefreq><priority>' + item.priority + '</priority></url>');
  });
  lines.push('</urlset>', '');
  return lines.join('\n');
}

function buildSitemap(data) {
  const file = path.join(ROOT, 'sitemap.xml');
  fs.writeFileSync(file, renderSitemap(data), 'utf8');
}

function main() {
  const data = loadSiteData();
  const home = buildHomepage(data);
  const pages = buildToolPages(data);
  buildSitemap(data);

  console.log('站点：' + data.name);
  console.log('工具：' + home.available + ' 个可用 / ' + home.total + ' 个条目');
  console.log('首页静态卡片：已生成');
  console.log('工具页：' + pages.filter(function (p) { return p.status === 'ok'; }).length + ' 个已同步');
  const missing = pages.filter(function (p) { return p.status === 'missing'; });
  if (missing.length) {
    console.log('缺失页面：' + missing.map(function (p) { return p.slug; }).join(', '));
  }
  console.log('sitemap.xml：已生成（lastmod ' + LAST_UPDATED + '）');
}

main();
