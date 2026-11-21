/**
 * 域名优惠码数据源（只收录国外注册商）
 *
 * 字段说明：
 *   platform    平台名
 *   country     平台所属国家/地区
 *   tlds        适用后缀数组，便于按后缀筛选
 *   type        注册 / 续费
 *   code        优惠码
 *   price       到手价（美元，含/不含 ICANN 费以结账页为准）
 *   original    常规价或对比价
 *   discount    近似折扣百分比，用于按优惠大小筛选
 *   validity    长期 / 月度 / 限时
 *   limit       使用限制
 *   note        注意事项
 *   link        官方页面
 *
 * 数据核对日期：2026-11-21。优惠码随时可能失效，请以结账页为准。
 */
window.DOMAIN_COUPONS = [
  {
    platform: 'Spaceship', country: '美国', tlds: ['.com'], type: '注册', code: 'COM67',
    price: '$3.80 首年', original: '$9.68', discount: 67, validity: '长期',
    limit: '每客户 1 个，限量',
    note: '续费约 $10.68–10.88/年，另加 $0.20 ICANN 费；官方促销页未标注结束日期，售完即止。',
    link: 'https://www.spaceship.com/'
  },
  {
    platform: 'Spaceship', country: '美国', tlds: ['.com'], type: '注册', code: 'COMPROS',
    price: '$3.18 首年', original: '$9.68', discount: 67, validity: '长期',
    limit: '每客户 1 个',
    note: '第三方价格跟踪仍在更新，但未出现在 Spaceship 官方促销页，稳定性低于 COM67。',
    link: 'https://www.spaceship.com/'
  },
  {
    platform: 'Spaceship', country: '美国', tlds: ['.net'], type: '注册', code: 'NET19',
    price: '$4.78 首年', original: '$11.20', discount: 57, validity: '长期',
    limit: '每客户 1 个',
    note: '.net 首年价，续费约 $11.20/年；以结账页为准。',
    link: 'https://www.spaceship.com/'
  },
  {
    platform: 'Spaceship', country: '美国', tlds: ['.xyz'], type: '注册', code: 'XYZ52',
    price: '$0.75 首年', original: '$13.77', discount: 95, validity: '长期',
    limit: '每客户 1 个',
    note: '首年超低价，续费约 $13.77/年，适合短期项目或测试。',
    link: 'https://www.spaceship.com/'
  },
  {
    platform: 'Spaceship', country: '美国', tlds: ['.io'], type: '注册', code: 'IO85',
    price: '$14.98 首年', original: '$31.98', discount: 53, validity: '长期',
    limit: '每客户 1 个',
    note: '.io 续费较贵（约 $51.75/年），长期持有请先看续费价。',
    link: 'https://www.spaceship.com/'
  },
  {
    platform: 'Namecheap', country: '美国', tlds: ['.com'], type: '注册', code: 'NEWCOM648',
    price: '$6.48 首年', original: '$15.98', discount: 57, validity: '长期',
    limit: '仅新客户，每客户 1 个',
    note: '官方 2026 常驻活动页标注“无结束日期”，另加 $0.20 ICANN 费。',
    link: 'https://www.namecheap.com/promos/make-more-online-for-less/'
  },
  {
    platform: 'Namecheap', country: '美国', tlds: ['.com', '.net', '.org', '.info', '.biz', '.ca', '.app', '.dev', '.in', '.co', '.co.uk', '.me', '.io'], type: '注册', code: 'THANKFULDOT',
    price: '$11.88 首年', original: '$15.98', discount: 25, validity: '月度',
    limit: '2026-11-01 至 11-30，限首年',
    note: '每月换码，不适用于续费；.com 注册/转入 $11.88/$12.08，均另加 $0.20 ICANN 费。',
    link: 'https://www.namecheap.com/promos/coupons/'
  },
  {
    platform: 'Namecheap', country: '美国', tlds: ['.com'], type: '注册', code: 'COUPONFCNC',
    price: '$11.98', original: '$15.98', discount: 25, validity: '长期',
    limit: '第三方长期跟踪，非官方确认',
    note: '注册 $11.98；实测常提示已过期，请以结账页为准。',
    link: 'https://www.namecheap.com/promos/coupons/'
  },
  {
    platform: 'Namecheap', country: '美国', tlds: ['.com'], type: '续费', code: 'COUPONFCNC',
    price: '$16.18/年', original: '$19.98', discount: 19, validity: '长期',
    limit: '第三方长期跟踪，非官方确认',
    note: 'Namecheap 官方优惠码一般不适用续费，这个码属第三方跟踪，成功率不稳定。',
    link: 'https://www.namecheap.com/promos/coupons/'
  },
  {
    platform: 'Namecheap', country: '美国', tlds: ['.biz', '.xyz', '.site', '.space'], type: '注册', code: '99SPECIAL',
    price: '$0.99 首年', original: '$10.00', discount: 90, validity: '长期',
    limit: '限首年，替代后缀',
    note: '官方常驻 $0.99 域名活动，适合试验项目；续费按常规价。',
    link: 'https://www.namecheap.com/promos/'
  },
  {
    platform: 'Porkbun', country: '美国', tlds: ['.com', '.net', '.org', '.io'], type: '注册', code: 'AWESOMENESS',
    price: '减 $1', original: '$11.81', discount: 8, validity: '长期',
    limit: '每单 1 次，可与首年促销叠加',
    note: 'Porkbun 主打注册/续费/转入同价，优惠码力度小；ACH Only 账户通常还能再省 3% 以上。',
    link: 'https://porkbun.com/'
  },
  {
    platform: 'Porkbun', country: '美国', tlds: ['.com'], type: '注册', code: 'MRKEHEL',
    price: '减 $1', original: '$11.81', discount: 8, validity: '长期',
    limit: '每客户最多 3 个',
    note: '.com 注册约 $10.81；同类 $1 off 码很多（NAMEPROS24、NPSAVINGS26 等）。',
    link: 'https://porkbun.com/'
  },
  {
    platform: 'Dynadot', country: '美国', tlds: ['.com'], type: '注册', code: '899COM',
    price: '$8.99 首年', original: '$11.62', discount: 23, validity: '长期',
    limit: '不限每账户次数，但总量有限',
    note: '官方帮助中心明确“无固定结束日期，售完即止”。首年域名挂在合作注册商名下，60 天内不能续费，首年不支持 DNSSEC。',
    link: 'https://www.dynadot.com/help/question/1093'
  },
  {
    platform: 'Name.com', country: '美国', tlds: ['.com', '.net', '.org'], type: '注册', code: 'SAVE15',
    price: '15% off', original: '$12.99', discount: 15, validity: '长期',
    limit: '仅新客户首单',
    note: '.com 到手约 $12.09；该站 .com 续费 $21.99，长期成本偏高。',
    link: 'https://www.name.com/'
  },
  {
    platform: 'Name.com', country: '美国', tlds: ['.com'], type: '续费', code: '1006ETE6',
    price: '15% off', original: '$21.99', discount: 15, validity: '长期',
    limit: '续费订单',
    note: '.com 续费约 $20.19/年；续费前建议对比其他平台转入价。',
    link: 'https://www.name.com/'
  },
  {
    platform: 'NameSilo', country: '美国', tlds: ['.com', '.net', '.org'], type: '注册', code: 'TLDES',
    price: '约 10% off', original: '$17.29', discount: 10, validity: '长期',
    limit: '每客户 1 个，未用过同类码',
    note: '真正的长期低价来自免费 Discount Program（大账户可到 $7.75–8.99），优惠码只是补充。',
    link: 'https://www.namesilo.com/'
  },
  {
    platform: 'NameSilo', country: '美国', tlds: ['.com', '.net', '.org'], type: '续费', code: 'TLDES',
    price: '约 10% off', original: '$17.29', discount: 10, validity: '长期',
    limit: '每客户 1 个，未用过同类码',
    note: '注册/续费/转入均可尝试；结账页显示为准。',
    link: 'https://www.namesilo.com/'
  },
  {
    platform: 'GoDaddy', country: '美国', tlds: ['.com'], type: '注册', code: 'GDWELCOME',
    price: '$4.99 首年', original: '$15.98', discount: 69, validity: '长期',
    limit: '仅新客户，可能需要电话验证',
    note: '首年便宜但 .com 续费约 $22.99/年；不建议长期持有，以结账页为准。',
    link: 'https://www.godaddy.com/'
  },
  {
    platform: 'Wix', country: '以色列', tlds: ['.com'], type: '注册', code: 'DOM50',
    price: '$3.95 首年', original: '$11.17', discount: 65, validity: '长期',
    limit: '注册/转入同价',
    note: 'Wix 域名服务，适合顺手在 Wix 建站的用户；续费价请在结账页确认。',
    link: 'https://www.wix.com/'
  },
  {
    platform: 'Network Solutions', country: '美国', tlds: ['.com'], type: '注册', code: 'DOMAIN20',
    price: '$9.79 首年', original: '$15.98', discount: 39, validity: '长期',
    limit: '限新客户，最多 5 个',
    note: '续费约 $22.99/年，WHOIS 隐私另收 $11.99/年，长期使用成本较高。',
    link: 'https://www.networksolutions.com/'
  },
  {
    platform: 'Hostinger', country: '立陶宛', tlds: ['.com'], type: '注册', code: 'TLDLIST15',
    price: '$8.69 首年', original: '$11.17', discount: 22, validity: '限时',
    limit: '每客户 1 个',
    note: 'Hostinger 域名优惠多为限时活动，买主机套餐常可首年免费送域名。',
    link: 'https://www.hostinger.com/'
  }
];
