import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const site = 'https://www.goodnewsjapan.com';
const date = '2026-06-16';
const image = 'https://assets.cdn.filesafe.space/pVxIE30GROfdQAaVsJgi/media/686f096a627f396723165ccf.png';
const registerUrl =
  'https://forms.zohopublic.eu/rikki/form/LetUsKnowYoureComing/formperma/HXE-JEIrRKpAvUyNGhJ8wQmyaP3L2wKVsRK1zdSJPSo';
const healingUrl =
  'https://forms.zohopublic.eu/rikki/form/YourHealingClassroomAugustSessionwithTheRaahProphe/formperma/aKDRnUqNo_x0COJZBFJLc_aXWSKBBRTe3HiaRGL43Ig';

const keywordClusters = {
  brand: ['Good News Japan', 'GoodNews Japan', 'GoodNewsJapan', 'GoodNews Japan 2026', 'GoodNews World Japan'],
  prophet: [
    'Uebert Angel Japan',
    'Prophet Uebert Angel Japan',
    "The Ra'ah Japan",
    'Uebert Angel Tokyo',
    'Uebert Angel Saitama',
  ],
  church: [
    'Spirit Embassy Japan',
    'Spirit Embassy Tokyo',
    'GoodNews Church Japan',
    'Spirit Embassy GoodNews Church Japan',
  ],
  event: [
    'GoodNews Japan registration',
    'GoodNews Japan tickets',
    'GoodNews Japan venue',
    'GoodNews Japan August 14 2026',
    'Christian event Japan 2026',
    'prophetic conference Japan',
    'healing event Japan',
    'miracles event Japan',
  ],
  japanese: [
    'グッドニュース ジャパン',
    'グッドニュースジャパン',
    'ユーバート エンジェル 日本',
    '預言者 ユーバート エンジェル',
    'スピリット エンバシー 日本',
    'グッドニュースワールド 日本',
    '日本 キリスト教 イベント 2026',
    '癒し 集会 日本',
    '預言 集会 日本',
    '埼玉 キリスト教 イベント',
    '所沢 ミューズ イベント',
  ],
};

const allKeywordClusters = Object.values(keywordClusters).flat();

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  '@id': `${site}/#event`,
  url: `${site}/`,
  name: 'GoodNews Japan 2026 with Prophet Uebert Angel',
  alternateName: ['Good News Japan', 'GoodNewsJapan', 'グッドニュース・ジャパン 2026', 'グッドニュースジャパン', 'GoodNews Japan'],
  description:
    'Good News Japan, GoodNewsJapan, and GoodNews Japan 2026 with The Raah, Prophet Uebert Angel. A Christian event Japan 2026, healing event Japan, miracles event Japan, and prophetic conference Japan in Tokorozawa, Saitama, near Tokyo.',
  keywords: allKeywordClusters,
  startDate: '2026-08-14',
  endDate: '2026-08-16',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  image: [image],
  location: {
    '@type': 'Place',
    '@id': `${site}/#venue`,
    name: 'Tokorozawa Civic Cultural Centre MUSE, Marquee Hall',
    alternateName: '所沢市民文化センター ミューズ マーキーホール',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1-9-1 Namiki',
      addressLocality: 'Tokorozawa',
      addressRegion: 'Saitama',
      postalCode: '359-0042',
      addressCountry: 'JP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.799,
      longitude: 139.468,
    },
    url: 'https://www.muse-tokorozawa.or.jp/',
  },
  organizer: {
    '@type': 'Organization',
    '@id': `${site}/#organization`,
    name: 'GoodNews World',
    url: 'https://goodnewsworld.com/',
    logo: image,
    sameAs: [
      'https://www.instagram.com/goodnewsworldofficial/',
      'https://www.youtube.com/@UebertangelGNW',
      'https://www.facebook.com/uebertangelextra',
    ],
  },
  performer: {
    '@type': 'Person',
    '@id': `${site}/#prophet-uebert-angel`,
    name: 'Prophet Uebert Angel',
    sameAs: [
      'https://www.instagram.com/uebertangel/',
      'https://www.youtube.com/@UebertangelGNW',
      'https://www.facebook.com/uebertangelextra',
    ],
  },
  offers: {
    '@type': 'Offer',
    url: registerUrl,
    availability: 'https://schema.org/InStock',
    price: '0',
    priceCurrency: 'JPY',
    validFrom: '2026-06-16',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${site}/#organization`,
  name: 'GoodNews World',
  alternateName: ['GoodNews World Japan', 'GoodNews Church Japan', 'Spirit Embassy GoodNews Church Japan'],
  url: 'https://goodnewsworld.com/',
  logo: image,
  sameAs: eventSchema.organizer.sameAs,
};

const enNav = [
  ['GoodNews Japan 2026', '/en/goodnews-japan-2026/'],
  ['Uebert Angel Japan', '/en/uebert-angel-japan/'],
  ['Spirit Embassy Japan', '/en/spirit-embassy-japan/'],
  ['Venue', '/en/venue/'],
  ['Register', '/en/register/'],
];

const jaNav = [
  ['グッドニュースジャパン2026', '/ja/goodnews-japan-2026/'],
  ['ユーバート・エンジェル師 日本', '/ja/uebert-angel-japan/'],
  ['スピリット エンバシー 日本', '/ja/spirit-embassy-japan/'],
  ['会場', '/ja/venue/'],
  ['登録', '/ja/register/'],
];

const pages = [
  {
    slug: 'goodnews-japan-2026',
    en: {
      title: 'Good News Japan 2026 | GoodNewsJapan | Prophet Uebert Angel',
      description:
        'Register for Good News Japan 2026, also searched as GoodNewsJapan, with Prophet Uebert Angel, August 14-16 at Tokorozawa MUSE in Saitama.',
      h1: 'Good News Japan 2026',
      eyebrow: 'August 14-16, 2026 / Tokorozawa, Saitama',
      intro:
        "Good News Japan 2026 is the spaced-name search version of GoodNews Japan and GoodNewsJapan. It is a healing and miracles event with The Raah, Prophet Uebert Angel, coming to Tokorozawa Civic Cultural Centre MUSE, Marquee Hall in Saitama, Japan.",
      sections: [
        ['Why Good News Japan matters', 'Japan is entering a special season of blessing, healing, miracles, and the GoodNews message. This page gives search engines and visitors a clear summary of the event, date, venue, speaker, and registration route for GoodNews Japan registration and GoodNews Japan tickets.'],
        ['Event details', 'The event runs August 14-16, 2026 at Tokorozawa Civic Cultural Centre MUSE, Marquee Hall, 1-9-1 Namiki, Tokorozawa, Saitama 359-0042, Japan.'],
        ["Speaker and organizer", "The featured speaker is Prophet Uebert Angel. This connects search intent around Uebert Angel Japan, Prophet Uebert Angel Japan, The Ra'ah Japan, Uebert Angel Tokyo, and Uebert Angel Saitama with the official event details."],
      ],
      cta: 'Register for GoodNews Japan 2026',
      keywords: [...keywordClusters.brand, ...keywordClusters.event],
    },
    ja: {
      title: 'グッドニュースジャパン2026 | ユーバート・エンジェル師 来日',
      description:
        'グッドニュースジャパン2026は、預言者ユーバート・エンジェル師による癒しと奇跡のイベントです。2026年8月14～16日、所沢ミューズで開催。',
      h1: 'グッドニュースジャパン2026',
      eyebrow: '2026年8月14～16日 / 埼玉県所沢市',
      intro:
        'グッドニュースジャパン2026は、預言者ユーバート・エンジェル師が日本に来られる、癒しと奇跡のイベントです。会場は埼玉県所沢市の所沢市民文化センター ミューズ マーキーホールです。グッドニュース ジャパン、グッドニュースワールド 日本、日本 キリスト教 イベント 2026を探している方にも分かりやすい情報です。',
      sections: [
        ['グッドニュースジャパンについて', '日本に素晴らしいニュースが届きました。癒し、奇跡、回復、祝福のメッセージが、GoodNews Japan 2026を通して日本に届けられます。癒し 集会 日本、預言 集会 日本、埼玉 キリスト教 イベントを探している方にも関連するイベントです。'],
        ['日程と会場', '2026年8月14日から16日まで、所沢市民文化センター ミューズ マーキーホールで開催されます。住所は〒359-0042 埼玉県所沢市並木1-9-1です。'],
        ['講師と主催', '講師は預言者ユーバート・エンジェル師です。GoodNews World、GoodNews Daily Project Japan、Healing Institute Japanに関連するイベントです。'],
      ],
      cta: 'グッドニュースジャパン2026に登録する',
      keywords: keywordClusters.japanese,
    },
  },
  {
    slug: 'uebert-angel-japan',
    en: {
      title: 'Uebert Angel Japan | GoodNews Japan 2026 Event',
      description:
        'Prophet Uebert Angel is coming to Japan for GoodNews Japan 2026, August 14-16 at Tokorozawa MUSE, Marquee Hall in Saitama.',
      h1: 'Uebert Angel Japan',
      eyebrow: 'Prophet Uebert Angel in Japan',
      intro:
        "Prophet Uebert Angel, The Raah, is coming to Japan for GoodNews Japan 2026. This page summarizes the Japan event, venue, dates, and registration details for people searching for Uebert Angel Japan, Prophet Uebert Angel Japan, The Ra'ah Japan, Uebert Angel Tokyo, and Uebert Angel Saitama.",
      sections: [
        ['Prophet Uebert Angel in Japan', 'GoodNews Japan 2026 brings Prophet Uebert Angel to Saitama for a focused season of healing, miracles, GoodNews, and prophetic ministry.'],
        ['When and where', 'The event takes place August 14-16, 2026 at Tokorozawa Civic Cultural Centre MUSE, Marquee Hall, near Tokyo.'],
        ['How to attend', 'Visitors can register through the official GoodNews Japan registration form and review healing-line details through the Healing Institute Japan form.'],
      ],
      cta: 'Register for Uebert Angel Japan',
      keywords: keywordClusters.prophet,
    },
    ja: {
      title: '預言者 ユーバート・エンジェル師 日本 | GoodNews Japan 2026',
      description:
        '預言者ユーバート・エンジェル師がGoodNews Japan 2026のために来日します。2026年8月14～16日、埼玉県所沢市で開催。',
      h1: '預言者 ユーバート・エンジェル師 日本',
      eyebrow: 'ユーバート・エンジェル師 来日イベント',
      intro:
        '預言者ユーバート・エンジェル師が、GoodNews Japan 2026のために日本に来られます。ユーバート エンジェル 日本、預言者 ユーバート エンジェルを探している方のための来日イベント情報です。',
      sections: [
        ['ユーバート・エンジェル師について', 'GoodNews Worldの預言者ユーバート・エンジェル師が、日本に祝福のメッセージを届けるために来日されます。'],
        ['開催情報', '日程は2026年8月14～16日。会場は埼玉県所沢市の所沢市民文化センター ミューズ マーキーホールです。'],
        ['参加方法', '参加希望の方は、GoodNews Japan公式登録フォームから事前登録できます。癒しのラインに関する詳細も公式フォームで案内されています。'],
      ],
      cta: 'ユーバート・エンジェル師 来日イベントに登録する',
      keywords: ['預言者 ユーバート エンジェル', 'ユーバート エンジェル 日本', 'グッドニュースジャパン'],
    },
  },
  {
    slug: 'spirit-embassy-japan',
    en: {
      title: 'Spirit Embassy Japan | GoodNews Church Event in Japan',
      description:
        'Find Spirit Embassy Japan and GoodNews Church Japan event information for GoodNews Japan 2026 with Prophet Uebert Angel in Saitama.',
      h1: 'Spirit Embassy Japan',
      eyebrow: 'GoodNews Church event in Japan',
      intro:
        'People searching for Spirit Embassy Japan, Spirit Embassy Tokyo, GoodNews Church Japan, or Spirit Embassy GoodNews Church Japan can find event information here for GoodNews Japan 2026 with Prophet Uebert Angel.',
      sections: [
        ['GoodNews Church in Japan', 'GoodNews Japan 2026 connects Japanese visitors with the GoodNews message, healing ministry, GoodNews World, and the wider Spirit Embassy family.'],
        ['Event focus', 'The event focuses on healing, miracles, prophetic ministry, registration, and clear venue information for visitors travelling to Saitama.'],
        ['Plan your visit', 'The venue is Tokorozawa Civic Cultural Centre MUSE, Marquee Hall, an accessible location in Saitama near Tokyo.'],
      ],
      cta: 'Register for GoodNews Church Japan event',
      keywords: keywordClusters.church,
    },
    ja: {
      title: 'スピリット エンバシー 日本 | GoodNews Japan 2026',
      description:
        'スピリット エンバシー 日本、GoodNews Church Japanを探している方へ。GoodNews Japan 2026の開催情報、会場、登録案内です。',
      h1: 'スピリット エンバシー 日本',
      eyebrow: 'GoodNews Church Japan イベント情報',
      intro:
        'スピリット エンバシー 日本、GoodNews Church Japan、グッドニュースワールド 日本を検索している方のために、GoodNews Japan 2026の情報をまとめました。',
      sections: [
        ['日本でのGoodNewsイベント', 'GoodNews Japan 2026は、日本の方々にGoodNewsのメッセージ、癒し、奇跡、預言的な働きを届けるイベントです。'],
        ['開催の目的', '癒しと奇跡、回復、祝福、そしてGoodNews Worldのメッセージを日本に届けることを目的としています。'],
        ['会場とアクセス', '会場は埼玉県所沢市の所沢市民文化センター ミューズ マーキーホールです。東京近郊からもアクセスしやすい場所です。'],
      ],
      cta: 'GoodNews Japan 2026に登録する',
      keywords: ['スピリット エンバシー 日本', 'グッドニュースワールド 日本', 'グッドニュースジャパン'],
    },
  },
  {
    slug: 'venue',
    en: {
      title: 'Tokorozawa MUSE Venue | GoodNews Japan 2026 in Saitama',
      description:
        'GoodNews Japan 2026 venue details: Tokorozawa Civic Cultural Centre MUSE, Marquee Hall, 1-9-1 Namiki, Tokorozawa, Saitama.',
      h1: 'Tokorozawa MUSE Venue',
      eyebrow: 'Saitama Christian event venue',
      intro:
        'GoodNews Japan 2026 will be held at Tokorozawa Civic Cultural Centre MUSE, Marquee Hall, in Tokorozawa, Saitama, Japan. This page targets GoodNews Japan venue, Tokorozawa MUSE, Saitama Christian event, and venue searches near Tokyo.',
      sections: [
        ['Venue name', 'Tokorozawa Civic Cultural Centre MUSE, Marquee Hall. Japanese: 所沢市民文化センター ミューズ マーキーホール.'],
        ['Venue address', '1-9-1 Namiki, Tokorozawa, Saitama 359-0042, Japan. This Saitama venue is near Tokyo and suitable for visitors travelling from the wider region.'],
        ['Event dates', 'GoodNews Japan 2026 takes place August 14-16, 2026. Attendees should register before travelling so the team can prepare for arrival and session instructions.'],
      ],
      cta: 'Register before visiting Tokorozawa MUSE',
      keywords: ['GoodNews Japan venue', 'Tokorozawa MUSE', 'Saitama Christian event', 'Uebert Angel Saitama'],
    },
    ja: {
      title: '所沢ミューズ 会場 | グッドニュースジャパン2026',
      description:
        'グッドニュースジャパン2026の会場は、埼玉県所沢市の所沢市民文化センター ミューズ マーキーホールです。',
      h1: '所沢ミューズ 会場',
      eyebrow: '埼玉県所沢市の会場情報',
      intro:
        'GoodNews Japan 2026は、埼玉県所沢市の所沢市民文化センター ミューズ マーキーホールで開催されます。所沢 ミューズ イベント、埼玉 キリスト教 イベントを探している方のための会場情報です。',
      sections: [
        ['会場名', '所沢市民文化センター ミューズ マーキーホール。英語表記はTokorozawa Civic Cultural Centre MUSE, Marquee Hallです。'],
        ['住所', '〒359-0042 埼玉県所沢市並木1-9-1。東京近郊からもアクセスしやすい埼玉県所沢市の会場です。'],
        ['開催日', '開催日は2026年8月14日から16日です。来場前に公式フォームから登録してください。'],
      ],
      cta: '所沢ミューズのイベントに登録する',
      keywords: ['所沢 ミューズ イベント', '所沢ミューズ', '埼玉 キリスト教 イベント', 'グッドニュースジャパン'],
    },
  },
  {
    slug: 'register',
    en: {
      title: 'GoodNews Japan Registration | Tickets for 2026 Event',
      description:
        'Register for GoodNews Japan 2026 with Prophet Uebert Angel. Secure your place for August 14-16 at Tokorozawa MUSE in Saitama.',
      h1: 'GoodNews Japan Registration',
      eyebrow: 'Registration and ticket information',
      intro:
        'Use the official GoodNews Japan registration form to let the team know you are coming to the August 14-16, 2026 event in Saitama. This page supports search intent for GoodNews Japan registration, GoodNews Japan tickets, and GoodNews Japan August 14 2026.',
      sections: [
        ['Register early', 'Spaces and session planning are managed through the official registration form. Registering early helps the team prepare admission and communication details.'],
        ['Healing line', 'Visitors seeking healing can also review the Healing Institute Japan form for healing-line information and session instructions.'],
        ['What to prepare', 'Prepare your name, country, attendance details, and contact information before completing the official form.'],
      ],
      cta: 'Open registration form',
      keywords: ['GoodNews Japan registration', 'GoodNews Japan tickets', 'GoodNews Japan August 14 2026', 'Christian event Japan 2026'],
    },
    ja: {
      title: 'グッドニュースジャパン 登録 | GoodNews Japan 2026',
      description:
        'グッドニュースジャパン2026の登録ページです。2026年8月14～16日、所沢ミューズで開催されるイベントに事前登録できます。',
      h1: 'グッドニュースジャパン 登録',
      eyebrow: '参加登録とチケット案内',
      intro:
        'GoodNews Japan 2026に参加希望の方は、公式登録フォームからお越しになることをお知らせください。グッドニュースジャパン 登録、日本 キリスト教 イベント 2026、癒し 集会 日本を探している方の登録ページです。',
      sections: [
        ['早めの登録', '参加登録を行うことで、入場やセッション案内、イベント連絡をスムーズに受け取ることができます。'],
        ['癒しのライン', '癒しを求めて参加される方は、Healing Institute Japanのフォームも確認してください。'],
        ['準備する情報', '氏名、国、参加区分、メールアドレスなど、必要な連絡情報を準備して登録してください。'],
      ],
      cta: '公式登録フォームを開く',
      keywords: ['グッドニュースジャパン 登録', 'GoodNews Japan チケット', '日本 キリスト教 イベント 2026', '癒し 集会 日本'],
    },
  },
];

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function jsonLd(data) {
  return JSON.stringify(data, null, 2).replaceAll('</script', '<\\/script');
}

function pageHtml(page, lang) {
  const content = page[lang];
  const otherLang = lang === 'en' ? 'ja' : 'en';
  const nav = lang === 'en' ? enNav : jaNav;
  const path = `/${lang}/${page.slug}/`;
  const otherPath = `/${otherLang}/${page.slug}/`;
  const canonical = `${site}${path}`;
  const pageKeywords = [...new Set([...content.keywords, ...(lang === 'en' ? allKeywordClusters : keywordClusters.japanese)])];
  const imageAlt =
    lang === 'en'
      ? `${content.h1} for GoodNews Japan 2026 with Prophet Uebert Angel in Saitama`
      : `${content.h1} グッドニュースジャパン2026 預言者ユーバート エンジェル 日本`;
  const schema = [
    organizationSchema,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: content.title,
      description: content.description,
      keywords: pageKeywords,
      inLanguage: lang,
      isPartOf: {
        '@id': `${site}/#website`,
      },
      about: {
        '@id': `${site}/#event`,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: image,
        caption: imageAlt,
      },
      breadcrumb: {
        '@id': `${canonical}#breadcrumb`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang === 'en' ? 'Home' : 'ホーム',
          item: `${site}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.h1,
          item: canonical,
        },
      ],
    },
    eventSchema,
  ];

  if (page.slug === 'register') {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'Offer',
      '@id': `${canonical}#registration`,
      url: registerUrl,
      name: content.cta,
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'JPY',
    });
  }

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(content.title)}</title>
    <meta name="description" content="${esc(content.description)}" />
    <meta name="keywords" content="${esc(pageKeywords.join(', '))}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="en" href="${site}/en/${page.slug}/" />
    <link rel="alternate" hreflang="ja" href="${site}/ja/${page.slug}/" />
    <link rel="alternate" hreflang="x-default" href="${site}/en/${page.slug}/" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(content.title)}" />
    <meta property="og:description" content="${esc(content.description)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:locale" content="${lang === 'en' ? 'en_JP' : 'ja_JP'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(content.title)}" />
    <meta name="twitter:description" content="${esc(content.description)}" />
    <meta name="twitter:image" content="${image}" />
    <script type="application/ld+json">${jsonLd(schema)}</script>
    <style>
      :root { color-scheme: dark; font-family: Arial, "Hiragino Sans", "Yu Gothic", sans-serif; background: #080806; color: #fff; }
      body { margin: 0; background: radial-gradient(circle at top left, rgba(215,180,90,.14), transparent 32rem), #080806; }
      main { width: min(1080px, calc(100% - 40px)); margin: 0 auto; padding: 34px 0 56px; }
      nav { display: flex; flex-wrap: wrap; gap: 10px 18px; padding-bottom: 42px; font-size: 14px; }
      a { color: #f0d794; text-underline-offset: 4px; }
      nav a { color: rgba(255,255,255,.76); text-decoration: none; }
      nav a:hover { color: #fff; }
      .eyebrow { color: #f0d794; font-size: 13px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
      h1 { max-width: 920px; font-size: clamp(44px, 9vw, 92px); line-height: .98; margin: 18px 0; letter-spacing: -0.03em; }
      h2 { font-size: clamp(25px, 4vw, 42px); margin: 0 0 14px; }
      p, li { font-size: 18px; line-height: 1.72; color: rgba(255,255,255,.84); }
      .intro { max-width: 850px; font-size: 21px; color: rgba(255,255,255,.92); }
      section { border-top: 1px solid rgba(255,255,255,.14); padding: 34px 0; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; }
      .card { border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); padding: 22px; }
      .hero-image { display: block; width: min(720px, 100%); height: auto; margin: 28px 0 0; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); }
      .keywords { display: flex; flex-wrap: wrap; gap: 10px; padding: 0; list-style: none; }
      .keywords li { border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); padding: 8px 11px; font-size: 14px; line-height: 1.35; color: rgba(255,255,255,.82); }
      .cta { display: inline-block; margin-top: 16px; background: #fff; color: #000; padding: 16px 22px; font-weight: 700; text-decoration: none; }
      footer { margin-top: 34px; color: rgba(255,255,255,.58); font-size: 14px; }
    </style>
  </head>
  <body>
    <main>
      <nav aria-label="${lang === 'en' ? 'SEO page navigation' : 'SEOページナビゲーション'}">
        <a href="/">${lang === 'en' ? 'Main site' : 'メインサイト'}</a>
        ${nav.map(([label, href]) => `<a href="${href}">${esc(label)}</a>`).join('')}
        <a href="${otherPath}">${lang === 'en' ? '日本語' : 'English'}</a>
      </nav>
      <p class="eyebrow">${esc(content.eyebrow)}</p>
      <h1>${esc(content.h1)}</h1>
      <p class="intro">${esc(content.intro)}</p>
      <img class="hero-image" src="${image}" alt="${esc(imageAlt)}" loading="eager" decoding="async" />
      <a class="cta" href="${registerUrl}">${esc(content.cta)}</a>
      <section>
        <h2>${lang === 'en' ? 'Key event facts' : 'イベント基本情報'}</h2>
        <div class="grid">
          <div class="card"><strong>${lang === 'en' ? 'Date' : '日程'}</strong><p>${lang === 'en' ? 'August 14-16, 2026' : '2026年8月14～16日'}</p></div>
          <div class="card"><strong>${lang === 'en' ? 'Venue' : '会場'}</strong><p>${lang === 'en' ? 'Tokorozawa Civic Cultural Centre MUSE, Marquee Hall' : '所沢市民文化センター ミューズ マーキーホール'}</p></div>
          <div class="card"><strong>${lang === 'en' ? 'Speaker' : '講師'}</strong><p>${lang === 'en' ? 'Prophet Uebert Angel' : '預言者ユーバート・エンジェル師'}</p></div>
        </div>
      </section>
      ${content.sections
        .map(([heading, body]) => `<section><h2>${esc(heading)}</h2><p>${esc(body)}</p></section>`)
        .join('')}
      <section>
        <h2>${lang === 'en' ? 'Related search topics' : '関連する検索トピック'}</h2>
        <ul class="keywords">
          ${pageKeywords.slice(0, 18).map((keyword) => `<li>${esc(keyword)}</li>`).join('')}
        </ul>
      </section>
      <section>
        <h2>${lang === 'en' ? 'Registration and healing line' : '参加登録と癒しのライン'}</h2>
        <p>${lang === 'en' ? 'Use the official registration form for attendance and the Healing Institute Japan form for healing-line details.' : '参加登録は公式フォームから行えます。癒しのラインに関する詳細はHealing Institute Japanのフォームをご確認ください。'}</p>
        <p><a href="${registerUrl}">${lang === 'en' ? 'Registration form' : '参加登録フォーム'}</a> · <a href="${healingUrl}">${lang === 'en' ? 'Healing line form' : '癒しのライン フォーム'}</a></p>
      </section>
      <footer>GoodNews Japan 2026 · ${lang === 'en' ? 'Static crawl page for search engines and visitors.' : '検索エンジンと訪問者のための静的ページです。'}</footer>
    </main>
  </body>
</html>
`;
}

function sitemapXml() {
  const urls = [
    { loc: `${site}/`, en: `${site}/`, ja: `${site}/` },
    ...pages.flatMap((page) => [
      { loc: `${site}/en/${page.slug}/`, en: `${site}/en/${page.slug}/`, ja: `${site}/ja/${page.slug}/` },
      { loc: `${site}/ja/${page.slug}/`, en: `${site}/en/${page.slug}/`, ja: `${site}/ja/${page.slug}/` },
    ]),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urls
  .map(
    ({ loc, en, ja }) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${en}" />
    <xhtml:link rel="alternate" hreflang="ja" href="${ja}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${loc === `${site}/` ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
}

for (const page of pages) {
  for (const lang of ['en', 'ja']) {
    const file = join(publicDir, lang, page.slug, 'index.html');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, pageHtml(page, lang), 'utf8');
  }
}

await writeFile(join(publicDir, 'sitemap.xml'), sitemapXml(), 'utf8');

console.log(`Generated ${pages.length * 2} static SEO pages and sitemap.xml`);
