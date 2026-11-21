/**
 * 首页唯一数据源（改这一个文件，整个 index 页面自动重渲染）
 *
 * 新增网页入口：在 tools 数组里加一项即可：
 *   { title: '网页标题', link: './your-page/', desc: '一句话说明', category: '开发工具' }
 *
 * 字段说明：
 *   title     必填，卡片标题
 *   link      必填，本站链接，推荐写 ./xxx/ 这种相对路径；也可写完整 http(s) 地址
 *   desc      可选，一句话说明
 *   category  可选，首页按它分组；不写就归到「其他」
 *   soon      可选，true 表示待上线，只展示不跳转
 *
 * 站名、简介、页脚文字也都在下面改，不用动 index.html。
 */

window.SITE_DATA = {
  name: '小兴365 工具站',
  tagline: '做站时顺手写的小工具，用得上就拿去用。本站为纯前端网站，不会上传任何数据（除三方API）',
  description: '小兴365 的在线小工具：建站配置、编码转换、文本处理和开发调试，用得上就拿去用。',
  keywords: '在线工具,建站工具,Cloudflare,Hexo,robots.txt,Base64,JSON,UUID,哈希,JWT,正则',
  footer: {
    blogText: 'xiaoxing365.com',
    blogUrl: 'https://xiaoxing365.com/',
    blogNote: '写点建站和折腾的记录。',
    email: 'mcxiaoxing365@163.com',
    buttonText: '去博客看看'
  },
  tools: [
    {
      title: 'Cloudflare 重定向表达式生成器',
      link: './redirect-generator/',
      desc: '填旧域名和新域名，生成能直接粘进 Cloudflare 重定向规则的表达式。',
      category: '建站工具'
    },
    {
      title: 'robots.txt 生成器',
      link: './robots-generator/',
      desc: '勾目录、按 UA 和 AI 爬虫屏蔽、填抓取延迟，生成 robots.txt。',
      category: '建站工具'
    },
    {
      title: '哪煮米比价工具',
      link: './domain-price/',
      desc: '查域名后缀在各注册商的注册、续费和转入价格。',
      category: '建站工具'
    },
    {
      title: 'Hexo Front-matter 生成器',
      link: './front-matter/',
      desc: '填标题、日期、分类、标签，生成 Hexo 文章的 YAML 头。',
      category: '建站工具'
    },
    {
      title: 'Meta 标签生成器',
      link: './meta-generator/',
      desc: '生成 title、description、keywords，还有 Open Graph 和 Twitter Card。',
      category: '建站工具'
    },
    {
      title: 'JSON 格式化',
      link: './json-formatter/',
      desc: '把 JSON 格式化或压缩，方便查看和复制。',
      category: '文本处理'
    },
    {
      title: 'HTML 实体编码解码',
      link: './html-entity/',
      desc: 'HTML 特殊字符转义和反转义。',
      category: '文本处理'
    },
    {
      title: '文本统计',
      link: './text-stats/',
      desc: '统计字数、行数、中文字符和 UTF-8 字节数。',
      category: '文本处理'
    },
    {
      title: '文本编码转换器',
      link: './encoding-converter/',
      desc: 'UTF-8 和 GBK 互转，中文乱码的时候用得上。',
      category: '编码转换'
    },
    {
      title: 'Base64 编码解码',
      link: './base64/',
      desc: 'UTF-8 文本和 Base64 互转，支持中文。',
      category: '编码转换'
    },
    {
      title: 'URL 编码解码',
      link: './url-encode/',
      desc: 'URL 参数编码和解码，支持中文。',
      category: '编码转换'
    },
    {
      title: '图片转 Base64',
      link: './image-base64/',
      desc: '把本地小图转成可直接用的 Data URL。',
      category: '编码转换'
    },
    {
      title: '时间戳转换器',
      link: './timestamp/',
      desc: 'Unix 时间戳和本地时间互转。',
      category: '开发工具'
    },
    {
      title: 'UUID 生成器',
      link: './uuid/',
      desc: '批量生成 UUID v4。',
      category: '开发工具'
    },
    {
      title: '密码生成器',
      link: './password/',
      desc: '生成随机高强度密码，可选字符类型。',
      category: '开发工具'
    },
    {
      title: '哈希计算',
      link: './hash/',
      desc: '计算文本的 SHA-1 / SHA-256 / SHA-512 摘要。',
      category: '开发工具'
    },
    {
      title: '正则表达式测试',
      link: './regex/',
      desc: '输入模式和测试文本，实时查看匹配结果。',
      category: '开发工具'
    },
    {
      title: 'JWT 解码器',
      link: './jwt/',
      desc: '查看 JWT 的 Header 和 Payload，不验证签名。',
      category: '开发工具'
    },
    {
      title: 'CSS 格式化压缩',
      link: './css-formatter/',
      desc: '把 CSS 美化缩进或压成一行。',
      category: '开发工具'
    },
    {
      title: '颜色转换器',
      link: './color/',
      desc: 'HEX / RGB / HSL 互转并预览。',
      category: '设计工具'
    },
    {
      title: '域名注册商优惠码',
      link: './domain-coupons/',
      desc: '国外注册商优惠码，按后缀、国家、平台和优惠幅度筛选。',
      category: '建站工具'
    }
  ]
};

// 兼容旧代码里直接读工具数组的写法
window.SITE_TOOLS = window.SITE_DATA.tools;
