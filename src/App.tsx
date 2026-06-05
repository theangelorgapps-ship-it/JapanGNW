import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUp, X } from 'lucide-react';
import ScrollReveal from './components/ScrollReveal';

const DESKTOP_FRAME_COUNT = 192;
const MOBILE_FRAME_SOURCE_COUNT = 361;
const MOBILE_FRAME_COUNT = 1;
const INITIAL_PRELOAD_COUNT = 18;
const PRELOADER_MIN_VISIBLE_MS = 2600;
const PRELOADER_DISSOLVE_MS = 900;
const MOBILE_FRAME_MAX_WIDTH = 767;
const LOGO_URL = 'https://assets.cdn.filesafe.space/pVxIE30GROfdQAaVsJgi/media/686f096a627f396723165ccf.png';
const DATE_VENUE_LOGO_URL = 'https://assets.cdn.filesafe.space/pVxIE30GROfdQAaVsJgi/media/6995a97ff02fa4d694442b64.webp';
const HEALING_INSTITUTE_LOGO_URL = 'https://assets.cdn.filesafe.space/pVxIE30GROfdQAaVsJgi/media/697cfce550158bec52c80442.png';
const GOODNEWS_DAILY_LOGO_URL = 'https://assets.cdn.filesafe.space/pVxIE30GROfdQAaVsJgi/media/6a203c12b75a113972d5cc41.webp';
const SPONSOR_VIDEO_URL = 'https://assets.cdn.filesafe.space/pVxIE30GROfdQAaVsJgi/media/6a20453b2f1efbc072040d12.mp4';
const ZOHO_ATTENDANCE_FORM_URL =
  'https://forms.zohopublic.eu/rikki/form/LetUsKnowYoureComing/formperma/HXE-JEIrRKpAvUyNGhJ8wQmyaP3L2wKVsRK1zdSJPSo';
const ZOHO_HEALING_FORM_URL =
  'https://forms.zohopublic.eu/rikki/form/YourHealingClassroomAugustSessionwithTheRaahProphe/formperma/aKDRnUqNo_x0COJZBFJLc_aXWSKBBRTe3HiaRGL43Ig';
const VENUE_MAP_URL =
  'https://www.google.com/maps/place//data=!4m2!3m1!1s0x6018dd914443816b:0x289a3ef1c6c5b4eb?entry=gemini&utm_source=gemini&utm_campaign=gem-default';

type FrameVariant = 'desktop' | 'mobile';

function getFrameSrc(index: number, variant: FrameVariant) {
  const directory = variant === 'mobile' ? 'frames-mobile' : 'frames';
  const sourceIndex =
    variant === 'mobile'
      ? Math.round((index / Math.max(1, MOBILE_FRAME_COUNT - 1)) * (MOBILE_FRAME_SOURCE_COUNT - 1))
      : index;
  return `/${directory}/frame-${String(sourceIndex + 1).padStart(4, '0')}.webp`;
}

function getFrameCount(variant: FrameVariant) {
  return variant === 'mobile' ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
}

function smoothScrollToHash(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function WisaLogo({ className = '', loading = 'lazy' }: { className?: string; loading?: 'eager' | 'lazy' }) {
  return (
    <img
      className={className}
      src={LOGO_URL}
      alt="WISA"
      width="157"
      height="25"
      loading={loading}
      decoding="async"
      style={{ objectFit: 'contain' }}
    />
  );
}

function GlobeIcon() {
  return (
    <svg
      width="71"
      height="43"
      viewBox="0 0 71 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="35.5" cy="21.5" rx="33.5" ry="19.5" stroke="white" strokeOpacity="0.9" />
      <ellipse cx="35.5" cy="21.5" rx="15.5" ry="19.5" stroke="white" strokeOpacity="0.75" />
      <path d="M35.5 2V41" stroke="white" strokeOpacity="0.75" />
      <path d="M3 15.5H68" stroke="white" strokeOpacity="0.55" />
      <path d="M3 27.5H68" stroke="white" strokeOpacity="0.55" />
      <path d="M11 8.5C19.2 13.2 27.8 15.5 35.5 15.5C43.2 15.5 51.8 13.2 60 8.5" stroke="white" strokeOpacity="0.5" />
      <path d="M11 34.5C19.2 29.8 27.8 27.5 35.5 27.5C43.2 27.5 51.8 29.8 60 34.5" stroke="white" strokeOpacity="0.5" />
    </svg>
  );
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function NavItem({ label }: { label: string }) {
  const [cycle, setCycle] = useState(0);
  const bumpCycle = () => setCycle((current) => current + 1);

  return (
    <a
      href="#"
      className="relative flex items-center justify-center overflow-hidden py-1 text-white/64 transition-colors duration-300 group hover:text-white"
      onMouseEnter={bumpCycle}
      onMouseLeave={bumpCycle}
    >
      {cycle === 0 ? (
        <span className="text-white/64 transition-colors duration-300 group-hover:text-white">{label}</span>
      ) : (
        <>
          <span key={`out-${cycle}`} className="animate-fly-out-up">
            {label}
          </span>
          <span key={`in-${cycle}`} className="animate-fly-in-up absolute inset-0 flex items-center justify-center">
            {label}
          </span>
        </>
      )}
    </a>
  );
}

function ArrowCycle({ cycle }: { cycle: number }) {
  if (cycle === 0) {
    return <ArrowRight className="h-5 w-5" strokeWidth={1.75} />;
  }

  return (
    <span className="relative block h-5 w-5 overflow-hidden">
      <ArrowRight key={`arrow-out-${cycle}`} className="animate-fly-out absolute inset-0 h-5 w-5" strokeWidth={1.75} />
      <ArrowRight key={`arrow-in-${cycle}`} className="animate-fly-in absolute inset-0 h-5 w-5" strokeWidth={1.75} />
    </span>
  );
}

function SplitCta({
  label,
  className = '',
  light = false,
  onClick,
}: {
  label: ReactNode;
  className?: string;
  light?: boolean;
  onClick?: () => void;
}) {
  const [arrowCycle, setArrowCycle] = useState(0);
  const bumpCycle = () => setArrowCycle((current) => current + 1);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={bumpCycle}
      onMouseLeave={bumpCycle}
      className={`group flex max-w-full cursor-pointer items-stretch gap-0 border-0 bg-transparent p-0 sm:gap-1 ${className}`}
    >
      <span
        className={`flex min-w-0 flex-1 items-center justify-between gap-4 px-5 py-4 font-mono text-[10px] font-bold tracking-[-0.01em] transition-colors sm:flex-none sm:justify-start sm:px-6 sm:py-4 sm:text-[11px] ${
          light
            ? 'bg-white text-black hover:bg-gray-200'
            : 'bg-white/12 text-white/92 backdrop-blur-[80px] group-hover:bg-white group-hover:text-black'
        }`}
      >
        {label}
        <span className="sm:hidden">
          <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </span>
      <span
        className={`hidden items-center justify-center px-4 transition-colors sm:flex sm:px-5 ${
          light
            ? 'bg-white text-black hover:bg-gray-200'
            : 'bg-white/8 text-white/90 backdrop-blur-[80px] group-hover:bg-white group-hover:text-black'
        }`}
      >
        <ArrowCycle cycle={arrowCycle} />
      </span>
    </button>
  );
}

function useNearViewport<T extends Element>(rootMargin = '700px') {
  const ref = useRef<T | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target || isNearViewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isNearViewport, rootMargin]);

  return [ref, isNearViewport] as const;
}

function LanguageToggle({
  revealLanguage,
  setRevealLanguage,
  className = '',
}: {
  revealLanguage: 'en' | 'ja';
  setRevealLanguage: (language: 'en' | 'ja') => void;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1 bg-[#1A1A1A]/55 p-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white/60 backdrop-blur-[80px] ${className}`}
    >
      <button
        type="button"
        aria-pressed={revealLanguage === 'en'}
        onClick={() => setRevealLanguage('en')}
        className={`px-3 py-2 transition-colors ${revealLanguage === 'en' ? 'bg-white text-black' : 'hover:text-white'}`}
      >
        English
      </button>
      <button
        type="button"
        aria-pressed={revealLanguage === 'ja'}
        onClick={() => setRevealLanguage('ja')}
        className={`px-3 py-2 transition-colors ${revealLanguage === 'ja' ? 'bg-white text-black' : 'hover:text-white'}`}
      >
        日本語
      </button>
    </div>
  );
}

const footerCopy = {
  en: {
    intro:
      'This is a moment in history. Japan you are called! The GoodNews and the prophetic is arriving! Make your plans now.',
    columns: [
      {
        title: 'MENU',
        links: [
          ['Home', '#home'],
          ['About', '#about'],
          ['Contact', '#contact'],
        ],
      },
      {
        title: 'CONTACT',
        links: [
          ['Call Center', null],
          ['🇺🇸 +1 448 877 0344', 'tel:+14488770344'],
          ['🇬🇧 +44 1244 727242', 'tel:+441244727242'],
          ['🇿🇼 +263 8677 211 645', 'tel:+2638677211645'],
          ['🇿🇦 +27 872 654 913', 'tel:+27872654913'],
        ],
      },
      {
        title: 'CONNECT',
        links: [
          ['Instagram', 'https://www.instagram.com/goodnewsworldofficial/'],
          ['YouTube', 'https://www.youtube.com/@UebertangelGNW'],
          ['Facebook', 'https://www.facebook.com/uebertangelextra'],
        ],
      },
    ],
  },
  ja: {
    intro:
      'これは歴史的な瞬間です。日本よ、あなたは召されています！GoodNewsと預言的な働きが到来します。今こそ準備をしてください。',
    columns: [
      {
        title: 'メニュー',
        links: [
          ['ホーム', '#home'],
          ['概要', '#about'],
          ['連絡先', '#contact'],
        ],
      },
      {
        title: '連絡先',
        links: [
          ['コールセンター', null],
          ['🇺🇸 +1 448 877 0344', 'tel:+14488770344'],
          ['🇬🇧 +44 1244 727242', 'tel:+441244727242'],
          ['🇿🇼 +263 8677 211 645', 'tel:+2638677211645'],
          ['🇿🇦 +27 872 654 913', 'tel:+27872654913'],
        ],
      },
      {
        title: 'つながる',
        links: [
          ['Instagram', 'https://www.instagram.com/goodnewsworldofficial/'],
          ['YouTube', 'https://www.youtube.com/@UebertangelGNW'],
          ['Facebook', 'https://www.facebook.com/uebertangelextra'],
        ],
      },
    ],
  },
};

const revealCopy = {
  en: `GOODNEWS HAS ARRIVED for the country of JAPAN 🇯🇵. The long awaited arrival of God’s mighty biological mouthpiece, Prophet Uebert Angel, is here! Japan your changing of season is upon you.`,
  ja: `吉報が日本に到着しました 🇯🇵。長く待ち望まれていた、神の力強い生ける代弁者、預言者ユーバート・エンジェル師が来られます！日本よ、あなたの季節の変わり目が来ています。`,
};

const dateVenueCopy = {
  en: {
    title: 'Date and Venue',
    date: 'August 14-16',
    venue: 'Venue: Tokorozawa Civic Cultural Centre MUSE, Marquee Hall',
    address: '1-9-1 Namiki, Tokorozawa, Saitama 359-0042',
  },
  ja: {
    title: '日程と会場',
    date: '8月14～16日',
    venue: '会場：所沢市民文化センター ミューズ マーキーホール',
    address: '〒359-0042 埼玉県所沢市並木1-9-1',
  },
};

const healingCopy = {
  en: {
    title: 'Your Healing Is Easy',
    first:
      'If you or your loved ones are battling sickness, pain, or infirmity, remember: Your Healing Is Easy. God’s power does not struggle. This August, the atmosphere will be fully charged for radical turnarounds, historic miracles, and total restoration.',
    more:
      "Don't miss this divine appointment. Spaces at the Marquee Hall are limited-secure your place in the room where your story changes forever!",
    readMore: 'Read More',
    readLess: 'Read Less',
    register: 'Register Now',
  },
  ja: {
    title: 'あなたの癒しは簡単です',
    first:
      'もしあなたやあなたの愛する人が、病、痛み、または弱さと戦っているなら、覚えていてください。あなたの癒しは簡単です。神の力は苦闘しません。この8月、会場の空気は劇的な転機、歴史的な奇跡、そして完全な回復のために満ち溢れます。',
    more:
      'この神聖な機会を逃さないでください。マーキーホールの席には限りがあります。あなたの物語が永遠に変わるその場所に、今すぐ席を確保してください！',
    readMore: '続きを読む',
    readLess: '閉じる',
    register: '今すぐ登録',
  },
};

const registerFormCopy = {
  en: {
    title: 'Register Now',
    close: 'Close registration form',
    name: 'Full name',
    email: 'Email address',
    phone: 'Phone number',
    message: 'Prayer request or note',
    submit: 'Submit Registration',
  },
  ja: {
    title: '今すぐ登録',
    close: '登録フォームを閉じる',
    name: 'お名前',
    email: 'メールアドレス',
    phone: '電話番号',
    message: '祈りのリクエストまたはメモ',
    submit: '登録を送信',
  },
};

const sponsorSectionCopy = {
  en: {
    eyebrow: 'Project Japan | August 2026',
    title: 'Sponsor A GoodNews Daily',
    body:
      'This August, the GoodNews Daily will be launching Project Japan, a powerful outreach taking the message of the hour across the nation of Japan. Our teams on the ground will be travelling through key cities and communities, sharing the Gospel, distributing the daily devotional and bringing hope to people from every walk of life. By sponsoring Project Japan today, you become a direct partner in this mission, helping us reach hearts across Japan with the Word of God at this critical time.',
    button: 'Become A Sponsor',
  },
  ja: {
    eyebrow: 'プロジェクト・ジャパン ｜ 2026年8月',
    title: 'GoodNews Dailyをスポンサーする',
    body:
      'この8月、GoodNews Dailyは「プロジェクト・ジャパン」を開始します。これは、日本全国に今この時のメッセージを届ける力強いアウトリーチです。現地のチームは主要都市や地域を巡り、福音を分かち合い、デイリーデボーショナルを配布し、あらゆる歩みの人々に希望を届けます。今日プロジェクト・ジャパンをスポンサーすることで、あなたはこの使命の直接的なパートナーとなり、この重要な時に神の御言葉をもって日本中の心に届く働きを助けることになります。',
    button: 'スポンサーになる',
  },
};

const legalCopy = {
  privacy: {
    eyebrow: 'Privacy Policy / プライバシーポリシー',
    title: 'Privacy Policy',
    titleJa: 'プライバシーポリシー',
    updated: 'Effective for GoodNews Japan 2026',
    sections: [
      {
        heading: 'Information we collect',
        body:
          'When you register, sponsor, contact us, or open an embedded form, we may collect details such as your name, email address, phone number, country, attendance preferences, donation information, and any message you choose to submit.',
        headingJa: '収集する情報',
        bodyJa:
          '登録、スポンサー、問い合わせ、または埋め込みフォームの利用時に、お名前、メールアドレス、電話番号、国、参加希望、寄付に関する情報、および任意で送信されるメッセージを収集する場合があります。',
      },
      {
        heading: 'How we use information',
        body:
          'We use this information to manage GoodNews Japan 2026 attendance, communicate event updates, support healing-line and sponsor workflows, respond to inquiries, and improve the event experience.',
        headingJa: '情報の利用目的',
        bodyJa:
          'GoodNews Japan 2026の参加管理、イベント更新の連絡、ヒーリングラインおよびスポンサー手続きのサポート、お問い合わせへの返信、イベント体験の改善のために利用します。',
      },
      {
        heading: 'Embedded services',
        body:
          'This site uses trusted third-party embeds, including Zoho Forms, Donorbox, Wistia, Google Maps, and media/CDN providers. These services may process information according to their own privacy policies.',
        headingJa: '外部サービス',
        bodyJa:
          '本サイトでは、Zoho Forms、Donorbox、Wistia、Google Maps、メディア/CDNプロバイダーなどの信頼できる外部埋め込みサービスを使用します。これらのサービスは各社のプライバシーポリシーに従って情報を処理する場合があります。',
      },
      {
        heading: 'Your choices',
        body:
          'You may contact the GoodNewsWorld team to request access, correction, or deletion of personal information submitted through this event site, subject to legal and operational requirements.',
        headingJa: 'お客様の選択',
        bodyJa:
          '本イベントサイトを通じて送信された個人情報について、法令および運営上必要な範囲を除き、開示、訂正、削除をGoodNewsWorldチームへ依頼できます。',
      },
    ],
  },
  terms: {
    eyebrow: 'Terms / 利用規約',
    title: 'Terms of Use',
    titleJa: '利用規約',
    updated: 'For GoodNews Japan 2026 visitors, registrants, and sponsors',
    sections: [
      {
        heading: 'Event information',
        body:
          'GoodNews Japan 2026 details, schedules, venue information, registration capacity, and sponsor opportunities may be updated as planning develops. Please check official communications for final instructions.',
        headingJa: 'イベント情報',
        bodyJa:
          'GoodNews Japan 2026の詳細、スケジュール、会場情報、登録枠、スポンサー機会は、準備の進行に伴い更新される場合があります。最終案内は公式連絡をご確認ください。',
      },
      {
        heading: 'Registration and attendance',
        body:
          'Submitting a registration form does not guarantee entry where capacity, verification, safety, or venue requirements apply. Attendees are responsible for travel, accommodation, and following event staff instructions.',
        headingJa: '登録と参加',
        bodyJa:
          '登録フォームの送信は、定員、確認、安全、会場要件が適用される場合の入場を保証するものではありません。参加者は交通・宿泊の手配およびイベントスタッフの案内に従う責任があります。',
      },
      {
        heading: 'Sponsorship and donations',
        body:
          'Sponsorships and donations are processed through Donorbox or other approved payment providers. Payment terms, confirmations, and refunds are handled according to the provider and GoodNewsWorld event policies.',
        headingJa: 'スポンサーシップと寄付',
        bodyJa:
          'スポンサーシップおよび寄付は、Donorboxまたは承認された決済プロバイダーを通じて処理されます。決済条件、確認、返金は、各プロバイダーおよびGoodNewsWorldのイベント方針に従って取り扱われます。',
      },
      {
        heading: 'Website use',
        body:
          'Please do not misuse this site, interfere with embedded forms or payment services, copy protected media without permission, or submit false or harmful information.',
        headingJa: 'ウェブサイトの利用',
        bodyJa:
          '本サイトの不正利用、埋め込みフォームや決済サービスへの妨害、許可のない保護されたメディアの複製、虚偽または有害な情報の送信は禁止されています。',
      },
    ],
  },
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameImagesRef = useRef<HTMLImageElement[]>([]);
  const loadedFramesRef = useRef<boolean[]>([]);
  const mobileFrameImagesRef = useRef<HTMLImageElement[]>([]);
  const mobileLoadedFramesRef = useRef<boolean[]>([]);
  const preloaderStartedAtRef = useRef(Date.now());
  const screen3Ref = useRef<HTMLDivElement | null>(null);
  const sponsorVideoRef = useRef<HTMLDivElement | null>(null);
  const [sponsorSectionRef, isSponsorSectionNear] = useNearViewport<HTMLElement>('900px');
  const aboutMenuRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [isPreloaderDismissing, setIsPreloaderDismissing] = useState(false);
  const [isHealingDetailsOpen, setIsHealingDetailsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isHealingFormOpen, setIsHealingFormOpen] = useState(false);
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [isSponsorEmbedReady, setIsSponsorEmbedReady] = useState(false);
  const [isSharedLanguageVisible, setIsSharedLanguageVisible] = useState(true);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const [isAboutLanguageVisible, setIsAboutLanguageVisible] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [revealLanguage, setRevealLanguage] = useState<'en' | 'ja'>('en');
  const [attendanceLanguage, setAttendanceLanguage] = useState<'en' | 'ja'>('en');
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 500, 800], [0, 0, -150]);
  const updateAboutLanguageVisibility = (latestScrollY = typeof window !== 'undefined' ? window.scrollY : 0) => {
    if (typeof window === 'undefined') return;

    const about = document.querySelector('#about');
    const rect = about?.getBoundingClientRect();
    if (!rect) {
      setIsAboutLanguageVisible(false);
      return;
    }

    const absoluteTop = latestScrollY + rect.top;
    const absoluteBottom = absoluteTop + rect.height;
    setIsAboutLanguageVisible(
      latestScrollY >= absoluteTop - window.innerHeight && latestScrollY <= absoluteBottom - 120,
    );
  };
  const shouldPreviewPreloader =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('preloader');
  const attendanceFormUrl =
    typeof window === 'undefined'
      ? ZOHO_ATTENDANCE_FORM_URL
      : `${ZOHO_ATTENDANCE_FORM_URL}?referrername=${encodeURIComponent(window.location.href.slice(0, 1800))}`;
  const healingFormUrl =
    typeof window === 'undefined'
      ? ZOHO_HEALING_FORM_URL
      : `${ZOHO_HEALING_FORM_URL}?referrername=${encodeURIComponent(window.location.href.slice(0, 1800))}`;

  const getFrameVariant = (): FrameVariant =>
    typeof window !== 'undefined' && window.matchMedia(`(max-width: ${MOBILE_FRAME_MAX_WIDTH}px)`).matches
      ? 'mobile'
      : 'desktop';

  const getFrameStore = (variant: FrameVariant) =>
    variant === 'mobile'
      ? { images: mobileFrameImagesRef.current, loaded: mobileLoadedFramesRef.current }
      : { images: frameImagesRef.current, loaded: loadedFramesRef.current };

  const loadFrame = (index: number, variant: FrameVariant, markInitialLoad = false) => {
    const { images, loaded } = getFrameStore(variant);
    const image = images[index] ?? new Image();
    image.decoding = 'async';
    image.onload = () => {
      loaded[index] = true;
      if (markInitialLoad && index === 0) {
        setIsLoaded(true);
      }
    };

    images[index] = image;
    if (!image.src) {
      image.src = getFrameSrc(index, variant);
    }
    if (image.complete && image.naturalWidth) {
      image.onload?.(new Event('load'));
    }

    return image;
  };

  useEffect(() => {
    if (!isLoaded || shouldPreviewPreloader) return;

    const elapsed = Date.now() - preloaderStartedAtRef.current;
    const remainingVisibleTime = Math.max(0, PRELOADER_MIN_VISIBLE_MS - elapsed);
    let hideTimer = 0;

    const dismissTimer = window.setTimeout(() => {
      setIsPreloaderDismissing(true);
      hideTimer = window.setTimeout(() => setIsPreloaderVisible(false), PRELOADER_DISSOLVE_MS);
    }, remainingVisibleTime);

    return () => {
      window.clearTimeout(dismissTimer);
      window.clearTimeout(hideTimer);
    };
  }, [isLoaded, shouldPreviewPreloader]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAttendanceLanguage((language) => (language === 'en' ? 'ja' : 'en'));
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isSponsorOpen) {
      setIsSponsorEmbedReady(false);
      return;
    }

    const embedTimer = window.setTimeout(() => setIsSponsorEmbedReady(true), 500);

    if (!document.querySelector('script[src="https://donorbox.org/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://donorbox.org/widget.js';
      script.setAttribute('paypalExpress', 'true');
      script.async = true;
      document.body.appendChild(script);
    }

    return () => window.clearTimeout(embedTimer);
  }, [isSponsorOpen]);

  useEffect(() => {
    if (!isAboutMenuOpen) return;

    const closeOnOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || aboutMenuRef.current?.contains(target)) return;
      setIsAboutMenuOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('touchstart', closeOnOutsideClick);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('touchstart', closeOnOutsideClick);
    };
  }, [isAboutMenuOpen]);

  useEffect(() => {
    const updateBackToTop = () => {
      setIsBackToTopVisible(window.scrollY > window.innerHeight * 0.92);
    };

    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('resize', updateBackToTop);

    return () => {
      window.removeEventListener('scroll', updateBackToTop);
      window.removeEventListener('resize', updateBackToTop);
    };
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    updateAboutLanguageVisibility(latest);
  });

  useEffect(() => {
    const handleResize = () => updateAboutLanguageVisibility();
    const handleScroll = () => updateAboutLanguageVisibility();
    updateAboutLanguageVisibility();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const target = sponsorVideoRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSharedLanguageVisible(!entry.isIntersecting);
      },
      { threshold: 0.04 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let preloadTimer = 0;
    const initialVariant = getFrameVariant();
    const initialFrameCount = getFrameCount(initialVariant);

    for (let index = 0; index < Math.min(INITIAL_PRELOAD_COUNT, initialFrameCount); index += 1) {
      loadFrame(index, initialVariant, !isCancelled);
    }

    let nextPreloadIndex = INITIAL_PRELOAD_COUNT;
    const preloadNextBatch = () => {
      if (isCancelled || nextPreloadIndex >= initialFrameCount) return;
      if (initialVariant === 'mobile') return;

      const batchEnd = Math.min(nextPreloadIndex + 10, initialFrameCount);
      for (let index = nextPreloadIndex; index < batchEnd; index += 1) {
        loadFrame(index, initialVariant);
      }
      nextPreloadIndex = batchEnd;
      preloadTimer = window.setTimeout(preloadNextBatch, 120);
    };

    preloadTimer = window.setTimeout(preloadNextBatch, 250);

    return () => {
      isCancelled = true;
      window.clearTimeout(preloadTimer);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    let animationFrame = 0;

    const drawFrame = (frameIndex: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return;

      const variant = getFrameVariant();
      const { images, loaded } = getFrameStore(variant);
      const targetImage = loaded[frameIndex] ? images[frameIndex] : loadFrame(frameIndex, variant);
      const fallbackImage = images.find((_, index) => loaded[index]);
      const image = loaded[frameIndex] ? targetImage : fallbackImage;
      if (!image?.naturalWidth || !image.naturalHeight) return;

      const dpr = Math.min(window.devicePixelRatio || 1, variant === 'mobile' ? 1.25 : 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const nextWidth = Math.round(width * dpr);
      const nextHeight = Math.round(height * dpr);

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      const canvasAspect = nextWidth / nextHeight;
      const imageAspect = image.naturalWidth / image.naturalHeight;
      let sourceWidth = image.naturalWidth;
      let sourceHeight = image.naturalHeight;
      let sourceX = 0;
      let sourceY = 0;

      if (imageAspect > canvasAspect) {
        sourceWidth = image.naturalHeight * canvasAspect;
        sourceX = (image.naturalWidth - sourceWidth) / 2;
      } else {
        sourceHeight = image.naturalWidth / canvasAspect;
        sourceY = (image.naturalHeight - sourceHeight) / 2;
      }

      context.clearRect(0, 0, nextWidth, nextHeight);
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, nextWidth, nextHeight);
    };

    const updateFrame = () => {
      if (!screen3Ref.current) return;
      const rect = screen3Ref.current.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const stopScroll = Math.max(1, absoluteTop - window.innerHeight * 0.2);
      const scrollFraction = Math.max(0, Math.min(1, window.scrollY / stopScroll));
      const variant = getFrameVariant();
      if (variant === 'mobile') {
        drawFrame(0);
        return;
      }
      const frameCount = getFrameCount(variant);
      const frameIndex = Math.min(frameCount - 1, Math.round(scrollFraction * (frameCount - 1)));
      drawFrame(frameIndex);
    };

    const scheduleFrame = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateFrame);
    };

    window.addEventListener('scroll', scheduleFrame, { passive: true });
    window.addEventListener('resize', scheduleFrame);
    scheduleFrame();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', scheduleFrame);
      window.removeEventListener('resize', scheduleFrame);
    };
  }, [isLoaded]);

  return (
    <div className="min-h-screen overflow-x-clip bg-black font-sans text-white selection:bg-white selection:text-black">
      {(isPreloaderVisible || shouldPreviewPreloader) && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#080806] ${
            isPreloaderDismissing && !shouldPreviewPreloader ? 'animate-preloader-dissolve pointer-events-none' : ''
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(215,180,90,0.18)_0%,rgba(22,20,16,0.72)_34%,rgba(0,0,0,0.98)_78%)]" />
          <div className="animate-preloader-pattern absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,transparent_0_18%,rgba(215,180,90,0.14)_18.4%,transparent_19%,transparent_48%,rgba(215,180,90,0.1)_48.4%,transparent_49%),radial-gradient(circle_at_18%_72%,transparent_0_9%,rgba(215,180,90,0.16)_9.4%,transparent_10%,transparent_14%,rgba(215,180,90,0.1)_14.4%,transparent_15%),radial-gradient(circle_at_86%_24%,transparent_0_8%,rgba(215,180,90,0.14)_8.4%,transparent_9%,transparent_13%,rgba(215,180,90,0.08)_13.4%,transparent_14%)]" />
          <div className="absolute inset-x-8 top-1/2 h-px bg-[#d7b45a]/14" />
          {[
            ['left-[12%] top-[-8%] h-3 w-2 [--petal-x:22vw]'],
            ['left-[27%] top-[-12%] h-4 w-2 [--petal-x:-16vw] [animation-delay:1.2s]'],
            ['left-[72%] top-[-10%] h-3 w-2 [--petal-x:-24vw] [animation-delay:0.7s]'],
            ['left-[88%] top-[-18%] h-4 w-2 [--petal-x:-34vw] [animation-delay:2.1s]'],
            ['left-[45%] top-[-16%] h-3 w-2 [--petal-x:18vw] [animation-delay:3.2s]'],
          ].map(([className], index) => (
            <span
              key={index}
              className={`preloader-petal absolute rounded-full bg-[#d7b45a]/75 blur-[0.2px] ${className}`}
            />
          ))}
          <div className="relative flex w-[90%] max-w-[720px] flex-col items-center text-center">
            <div className="animate-preloader-medallion relative flex h-32 w-32 items-center justify-center md:h-40 md:w-40">
              <div className="absolute inset-0 rounded-full bg-[#d7b45a]/10 blur-3xl" />
              <WisaLogo loading="eager" className="relative z-[1] h-24 w-24 drop-shadow-[0_0_36px_rgba(215,180,90,0.45)] md:h-32 md:w-32" />
            </div>
            <div className="animate-preloader-title-rise mt-8">
              <div className="text-[clamp(2rem,5vw,4.4rem)] font-semibold leading-none tracking-tight text-[#e9c76c] drop-shadow-[0_8px_24px_rgba(0,0,0,0.65)]">
                GoodNews Japan 2026
              </div>
              <div className="mt-4 text-sm font-medium leading-snug text-[#f0d794]/90 md:text-base">
                ラー（The Ra'ah）ウエバート・エンジェル預言者と共に
              </div>
              <div className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f0d794]/80 md:text-xs">
                With The Ra'ah - Prophet Uebert Angel
              </div>
            </div>
            <div className="mt-9 h-[2px] w-72 max-w-full overflow-hidden bg-[#d7b45a]/12">
              <div className="animate-preloader-sweep h-full w-1/3 bg-[#d7b45a]" />
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-0 bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.78)_100%)]" />
      </div>

      <motion.header
        style={{ y: headerY }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-1/2 top-3 z-20 w-auto max-w-[calc(100vw-24px)] -translate-x-1/2 pointer-events-auto sm:top-4"
      >
        <nav className="flex items-center rounded-full border border-white/15 bg-[#1A1A1A]/58 px-2 py-1.5 shadow-xl shadow-black/25 backdrop-blur-[80px] sm:px-2.5 sm:py-2 md:px-3">
          <a
            href="#home"
            aria-label="GoodNews Japan home"
            onClick={(event) => {
              event.preventDefault();
              smoothScrollToHash('#home');
              setIsAboutMenuOpen(false);
            }}
            className="flex h-7 w-8 shrink-0 items-center justify-center sm:h-8 sm:w-10 md:h-9 md:w-11"
          >
            <WisaLogo loading="eager" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
          </a>
          <div className="mx-1.5 h-6 w-px bg-white/18 sm:mx-2 sm:h-7" />
          <div className="flex min-w-0 items-center gap-2 text-center font-sans text-[11px] font-semibold tracking-[-0.01em] text-white/84 sm:gap-3 sm:text-xs md:text-[13px]">
            <div
              ref={aboutMenuRef}
              className="relative"
              onMouseEnter={() => setIsAboutMenuOpen(true)}
            >
              <button
                type="button"
                aria-expanded={isAboutMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsAboutMenuOpen(true)}
                onFocus={() => setIsAboutMenuOpen(true)}
                className="rounded-full px-2 py-1.5 transition-colors hover:bg-white/10 hover:text-white sm:px-2.5"
              >
                About / 概要
              </button>
              <motion.div
                initial={false}
                animate={
                  isAboutMenuOpen
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: -6, scale: 0.98 }
                }
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute left-1/2 top-[calc(100%+14px)] z-30 w-[min(300px,calc(100vw-32px))] -translate-x-1/2 border border-white/12 bg-[#151515]/88 p-2 text-left shadow-2xl shadow-black/35 backdrop-blur-[80px] ${
                  isAboutMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
                role="menu"
              >
                {[
                  ['Healing is Easy / 回復は簡単だ。', '#healing', HEALING_INSTITUTE_LOGO_URL],
                  ['GoodNewsDaily / グッドニュースデイリー', '#goodnews-daily', GOODNEWS_DAILY_LOGO_URL],
                ].map(([label, href, icon]) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsAboutMenuOpen(false);
                      smoothScrollToHash(href);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left text-[12px] font-semibold text-white/76 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <img src={icon} alt="" className="h-7 w-7 shrink-0 object-contain" loading="lazy" decoding="async" />
                    <span>{label}</span>
                  </button>
                ))}
              </motion.div>
            </div>

            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                smoothScrollToHash('#contact');
                setIsAboutMenuOpen(false);
              }}
              className="rounded-full px-2 py-1.5 transition-colors hover:bg-white/10 hover:text-white sm:px-2.5"
            >
              Contact / 連絡先
            </a>
          </div>
        </nav>
      </motion.header>

      <motion.button
        type="button"
        aria-label="Back to top"
        onClick={() => smoothScrollToHash('#home')}
        initial={false}
        animate={isBackToTopVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#1A1A1A]/70 text-white shadow-xl shadow-black/30 backdrop-blur-[80px] transition-colors hover:bg-white hover:text-black md:bottom-7 md:right-7 ${
          isBackToTopVisible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <ArrowUp className="h-5 w-5" strokeWidth={1.8} />
      </motion.button>

      {isRegisterOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[560px] border border-white/10 bg-[#1A1A1A]/85 p-6 text-white shadow-2xl backdrop-blur-[80px] md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7b45a]/80">
                  GoodNews Japan 2026
                </p>
                <h2 className="mt-2 text-3xl font-medium leading-tight tracking-tight">
                  プロジェクト・ジャパン ｜ 2026年8月
                  <br />
                  Project Japan | August 2026
                </h2>
              </div>
              <button
                type="button"
                aria-label={registerFormCopy[revealLanguage].close}
                onClick={() => setIsRegisterOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                setIsRegisterOpen(false);
              }}
            >
              <input
                required
                name="name"
                placeholder={registerFormCopy[revealLanguage].name}
                className="w-full border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/40"
              />
              <input
                required
                type="email"
                name="email"
                placeholder={registerFormCopy[revealLanguage].email}
                className="w-full border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/40"
              />
              <input
                name="phone"
                placeholder={registerFormCopy[revealLanguage].phone}
                className="w-full border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/40"
              />
              <textarea
                name="message"
                rows={4}
                placeholder={registerFormCopy[revealLanguage].message}
                className="w-full resize-none border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/40"
              />
              <button
                type="submit"
                className="mt-2 bg-white px-6 py-5 font-mono text-xs font-bold uppercase tracking-[-0.01em] text-black transition-colors hover:bg-gray-200"
              >
                {registerFormCopy[revealLanguage].submit}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {isAttendanceOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[720px] overflow-hidden border border-white/10 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-5 bg-[#101010] px-5 py-5 pr-20 text-white md:px-7">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7b45a]/80">
                  GoodNews Japan 2026
                </p>
                <h2 className="mt-2 text-[clamp(1.35rem,3vw,2rem)] font-medium leading-tight tracking-tight">
                  お越しになる際はお知らせください
                  <br />
                  Let Us Know You're Coming
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close attendance form"
                onClick={() => setIsAttendanceOpen(false)}
                className="absolute right-4 top-4 flex h-10 w-10 shrink-0 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <iframe
              id="ziframe_200345"
              aria-label="Let Us Know You're Coming"
              frameBorder="0"
              loading="lazy"
              style={{ height: 500, width: '99%', border: 'none' }}
              src={attendanceFormUrl}
              title="Let Us Know You're Coming"
            />
          </motion.div>
        </motion.div>
      )}

      {isHealingFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[720px] overflow-hidden border border-white/10 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-5 bg-[#101010] px-5 py-5 pr-20 text-white md:px-7">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7b45a]/80">
                  GoodNews Japan 2026
                </p>
                <h2 className="mt-2 text-[clamp(1.25rem,3vw,2rem)] font-medium leading-tight tracking-tight">
                  グッドニュース・ジャパン・ヒーリング・ライン
                  <br />
                  GoodNews Japan Healing line
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close healing line form"
                onClick={() => setIsHealingFormOpen(false)}
                className="absolute right-4 top-4 flex h-10 w-10 shrink-0 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <iframe
              id="ziframe_894249"
              aria-label="Your Healing Classroom - August Session with The Ra'ah - Prophet Uebert Angel (JAPAN)"
              frameBorder="0"
              allow="geolocation;"
              loading="lazy"
              style={{ height: 500, width: '99%', border: 'none' }}
              src={healingFormUrl}
              title="GoodNews Japan Healing line"
            />
          </motion.div>
        </motion.div>
      )}

      {isSponsorOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 overflow-y-auto bg-black/80 px-[5%] py-6 backdrop-blur-md md:px-[10%] md:py-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto min-h-[calc(100vh-48px)] w-full overflow-hidden border border-white/10 bg-[#0f0f0f]/92 text-white shadow-2xl backdrop-blur-[80px] md:min-h-[calc(100vh-80px)]"
          >
            <button
              type="button"
              aria-label="Close sponsor form"
              onClick={() => setIsSponsorOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center bg-black/70 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="min-h-[calc(100vh-48px)] bg-white md:min-h-[calc(100vh-80px)]">
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={isSponsorEmbedReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-h-[900px] items-start justify-center overflow-y-auto bg-white p-4 md:p-8"
              >
                <iframe
                  src="https://donorbox.org/embed/good-news-daily-sponsor-a-project?"
                  name="donorbox"
                  allowPaymentRequest
                  seamless
                  frameBorder="0"
                  loading="lazy"
                  scrolling="no"
                  height="900px"
                  width="100%"
                  style={{ maxWidth: 500, minWidth: 250, maxHeight: 'none' }}
                  allow="payment"
                  title="GoodNews Daily Sponsor A Project"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {legalModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[88vh] w-full max-w-[900px] flex-col overflow-hidden border border-white/10 bg-[#151515]/95 text-white shadow-2xl backdrop-blur-[80px]"
          >
            <div className="flex items-start justify-between gap-6 border-b border-white/10 px-5 py-5 pr-20 md:px-8 md:py-7">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7b45a]/80">
                  {legalCopy[legalModal].eyebrow}
                </p>
                <h2 className="mt-2 text-[clamp(1.6rem,3.4vw,2.8rem)] font-medium leading-tight tracking-tight">
                  {legalCopy[legalModal].title}
                  <br />
                  {legalCopy[legalModal].titleJa}
                </h2>
                <p className="mt-3 max-w-[620px] text-sm leading-relaxed text-white/45">
                  {legalCopy[legalModal].updated}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close legal popup"
                onClick={() => setLegalModal(null)}
                className="absolute right-4 top-4 flex h-10 w-10 shrink-0 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-6 md:px-8 md:py-8">
              <div className="grid gap-5 md:grid-cols-2 md:gap-7">
                {legalCopy[legalModal].sections.map((section) => (
                  <div key={section.heading} className="border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="text-xl font-semibold leading-tight text-white">{section.heading}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/68">{section.body}</p>
                    <div className="mt-5 border-t border-white/10 pt-5">
                      <h4 className="text-lg font-semibold leading-tight text-white">{section.headingJa}</h4>
                      <p className="mt-3 text-[15px] leading-relaxed text-white/68">{section.bodyJa}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <main className="relative z-10 overflow-x-clip pointer-events-none">
        <section
          id="home"
          className="mx-auto flex min-h-[100svh] w-[90%] flex-col pb-7 pt-24 md:h-screen md:pb-12 md:pt-28 lg:pb-16 lg:pt-32"
        >
          <div className="flex flex-1 w-full flex-col justify-end gap-y-4 pointer-events-auto md:grid md:grid-cols-12 md:grid-rows-[1fr_auto] md:gap-x-8 md:gap-y-0">
            <Reveal delay={0.2} className="flex items-end md:col-span-7 md:col-start-1 md:row-start-2 lg:col-span-8">
              <div>
                <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70 sm:text-xs md:mb-3">
                  8月14～16日/August 14-16
                </p>
                <h1 className="text-[clamp(2.15rem,10vw,5rem)] font-medium leading-[1.05] tracking-tight text-white md:whitespace-nowrap md:text-[clamp(2.5rem,6vw,5rem)]">
                  GoodNews
                  <br />
                  Japan
                </h1>
                <a
                  href={VENUE_MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block max-w-[620px] text-[12px] font-medium leading-[1.45] text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline sm:text-[13px] md:mt-4 md:max-w-[470px] lg:max-w-[560px]"
                >
                  <span className="md:hidden">Tokorozawa MUSE, Marquee Hall</span>
                  <span className="hidden md:inline">
                    会場：所沢市民文化センター ミューズ マーキーホール, 〒359-0042 埼玉県所沢市並木1-9-1
                    <br />
                    Venue: Tokorozawa Civic Cultural Centre MUSE, Marquee Hall, 1-9-1 Namiki, Tokorozawa, Saitama
                    359-0042
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal
              delay={0.3}
              className="flex flex-col items-start justify-center text-left md:col-span-5 md:col-start-8 md:row-start-1 md:items-end md:text-right"
            >
              <p className="relative max-w-[500px] text-[clamp(0.68rem,2.65vw,0.95rem)] font-semibold leading-[1.24] text-white sm:text-[clamp(0.86rem,3.1vw,1.15rem)] md:text-[clamp(1rem,1.35vw,1.25rem)] md:font-bold md:leading-[1.32]">
                <span className="md:hidden">
                  世界的預言の器 来日決定/
                  <br />
                  The Prophet to the Last Dispensation is coming to Japan!
                  <br />
                  癒しと奇跡のイベント！
                  <br />
                  スピーカー：ユーバート・エンジェル師
                </span>
                <span className="hidden md:inline">
                  世界的預言の器 来日決定/
                  <br />
                  The Prophet to the Last Dispensation is coming to Japan!
                  <br />
                  <span>癒しと奇跡のイベント！</span>
                  <br />
                  <span>スピーカー：ユーバート・エンジェル師</span>
                </span>
              </p>
            </Reveal>

            <Reveal
              delay={0.4}
              className="flex items-end justify-start md:col-span-5 md:col-start-8 md:row-start-2 md:justify-end lg:col-span-4 lg:col-start-9"
            >
              <SplitCta
                onClick={() => setIsAttendanceOpen(true)}
                className="w-full max-w-[340px] sm:w-auto sm:max-w-none"
                label={
                  <span className="block min-w-0 overflow-hidden text-left sm:min-w-[170px]">
                    <motion.span
                      key={attendanceLanguage}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="block"
                    >
                      {attendanceLanguage === 'en' ? (
                        <span className="block whitespace-nowrap text-[11px] leading-none tracking-[0.02em] sm:text-[14px]">
                          Let Us Know You're Coming
                        </span>
                      ) : (
                        <span className="block whitespace-nowrap text-[10px] leading-none tracking-[0.01em] sm:text-[13px]">
                          お越しになる際はお知らせください。
                        </span>
                      )}
                    </motion.span>
                  </span>
                }
              />
            </Reveal>
          </div>
        </section>

        <div className="h-[200px] w-full" />

        <div id="about" className="relative pointer-events-auto">
          <div
            className="pointer-events-none absolute inset-x-0 -top-[24vh] -bottom-[18vh]"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.34) 26%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0) 100%)',
            }}
          />
          <motion.div
            initial={false}
            animate={
              isAboutLanguageVisible && isSharedLanguageVisible
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 28 }
            }
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-6 left-1/2 z-30 -translate-x-1/2 md:bottom-8 ${
              isAboutLanguageVisible && isSharedLanguageVisible ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <LanguageToggle revealLanguage={revealLanguage} setRevealLanguage={setRevealLanguage} />
          </motion.div>

        <section className="relative mx-auto flex min-h-screen w-[90%] flex-col justify-center py-8 pointer-events-auto md:py-12 lg:py-16">
          <div className="w-full max-w-[1200px]">
            <ScrollReveal
              key={revealLanguage}
              baseOpacity={0.1}
              enableBlur={true}
              baseRotation={3}
              blurStrength={4}
              textClassName={`w-full font-medium leading-[1.1] tracking-tight text-white ${
                revealLanguage === 'ja'
                  ? 'break-anywhere text-[clamp(1.65rem,3.5vw,3.15rem)]'
                  : 'text-[clamp(2rem,4.5vw,4rem)]'
              }`}
            >
              {revealCopy[revealLanguage]}
            </ScrollReveal>

            <div className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
              <Reveal delay={0.1} className="md:col-span-6">
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={DATE_VENUE_LOGO_URL}
                    alt=""
                    className="h-9 w-9 shrink-0 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                  <h3 className="text-xl font-medium text-white">{dateVenueCopy[revealLanguage].title}</h3>
                </div>
                <p className="text-[15px] leading-relaxed text-white/80">
                  <span className="block font-semibold text-white">{dateVenueCopy[revealLanguage].date}</span>
                  <span className="mt-3 block">{dateVenueCopy[revealLanguage].venue}</span>
                  <span className="mt-3 block">{dateVenueCopy[revealLanguage].address}</span>
                </p>
              </Reveal>

              <Reveal delay={0.2} className="md:col-span-6">
                <div id="healing" className="mb-4 flex scroll-mt-28 items-center gap-3">
                  <img
                    src={HEALING_INSTITUTE_LOGO_URL}
                    alt=""
                    className="h-9 w-9 shrink-0 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                  <h3 className="text-xl font-medium text-white">{healingCopy[revealLanguage].title}</h3>
                </div>
                <p className="text-[14px] leading-relaxed text-white/80">{healingCopy[revealLanguage].first}</p>
                {isHealingDetailsOpen && (
                  <p className="mt-4 text-[14px] leading-relaxed text-white/80">{healingCopy[revealLanguage].more}</p>
                )}
                <button
                  type="button"
                  onClick={() => setIsHealingDetailsOpen((open) => !open)}
                  className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#d7b45a] transition-colors hover:text-white"
                >
                  {isHealingDetailsOpen ? healingCopy[revealLanguage].readLess : healingCopy[revealLanguage].readMore}
                </button>
                <button
                  type="button"
                  onClick={() => setIsHealingFormOpen(true)}
                  className="mt-5 block bg-white px-6 py-4 font-mono text-xs font-bold uppercase tracking-[-0.01em] text-black transition-colors hover:bg-gray-200"
                >
                  {healingCopy[revealLanguage].register}
                </button>
              </Reveal>
            </div>
          </div>
        </section>

        <div className="h-12 w-full md:h-16" />

        <section ref={sponsorSectionRef} id="goodnews-daily" className="mx-auto flex min-h-[90vh] w-[90%] scroll-mt-28 flex-col justify-center pb-16 pt-8 pointer-events-auto md:pt-10">
          <div className="grid w-full grid-cols-1 items-center gap-10 border-y border-white/10 py-12 md:grid-cols-12 md:gap-10 lg:py-14">
            <Reveal className="md:col-span-6">
              <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#f0d794] drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
                <img
                  src={GOODNEWS_DAILY_LOGO_URL}
                  alt="GoodNews Daily"
                  className="mb-4 h-10 w-auto object-contain sm:h-12"
                  loading="lazy"
                  decoding="async"
                />
                {sponsorSectionCopy[revealLanguage].eyebrow}
              </p>
              <h2 className="max-w-[620px] text-[clamp(2rem,4vw,3.85rem)] font-medium leading-[1.03] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.82)]">
                {sponsorSectionCopy[revealLanguage].title}
              </h2>
              <div
                ref={sponsorVideoRef}
                className="mt-8 max-w-[440px] overflow-hidden border border-white/10 bg-black/70 shadow-2xl shadow-black/30"
              >
                <div className="relative w-full" style={{ paddingTop: '125%' }}>
                  {isSponsorSectionNear && (
                    <video
                      src={SPONSOR_VIDEO_URL}
                      title="Project Japan sponsor video"
                      className="absolute left-0 top-0 h-full w-full object-cover"
                      autoPlay
                      muted
                      playsInline
                      preload="metadata"
                    />
                  )}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="md:col-span-6">
              <p className="max-w-[560px] text-[15px] leading-[1.65] text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] md:text-[16px]">
                {sponsorSectionCopy[revealLanguage].body}
              </p>
              <button
                type="button"
                onClick={() => setIsSponsorOpen(true)}
                className="mt-8 bg-white px-7 py-5 font-mono text-xs font-bold uppercase tracking-[-0.01em] text-black transition-colors hover:bg-gray-200"
              >
                {sponsorSectionCopy[revealLanguage].button}
              </button>
            </Reveal>
          </div>
        </section>
        </div>

        <div className="h-[120px] w-full" />

        <section id="contact" ref={screen3Ref} className="pointer-events-auto">
          <div style={{ width: '90%', margin: '0 auto', paddingBottom: 64 }}>
            <div
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(80px)',
                WebkitBackdropFilter: 'blur(80px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: 'clamp(32px, 4vw, 64px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: 40,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingBottom: 'clamp(48px, 4vw, 80px)',
                }}
              >
                <h2
                  style={{
                    fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.05,
                  }}
                >
	                  <motion.span
	                    key={`footer-title-${revealLanguage}`}
	                    initial={{ opacity: 0, y: 16 }}
	                    animate={{ opacity: 1, y: 0 }}
	                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
	                    className="block"
	                  >
	                    {revealLanguage === 'en' ? (
	                      <>
	                        Are you Coming?
	                      </>
	                    ) : (
	                      <>ご参加されますか？</>
	                    )}
	                  </motion.span>
                </h2>
                <SplitCta
                  light
                  onClick={() => setIsAttendanceOpen(true)}
                  label={
                    <span className="block min-w-0 overflow-hidden whitespace-nowrap text-left sm:min-w-[180px]">
	                      <motion.span
	                        key={`footer-cta-${revealLanguage}`}
	                        initial={{ opacity: 0, y: 12 }}
	                        animate={{ opacity: 1, y: 0 }}
	                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
	                        className="block"
	                      >
	                        {revealLanguage === 'en' ? (
	                          <span className="block whitespace-nowrap text-[13px] leading-none">Yes! I'm Participating!</span>
	                        ) : (
	                          <span className="block text-[13px] leading-[1.25]">はい、参加します！</span>
                        )}
                      </motion.span>
                    </span>
                  }
                />
	              </div>
	
	              <div
	                style={{
	                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 'clamp(32px, 3vw, 48px)',
                  paddingTop: 'clamp(48px, 4vw, 64px)',
                }}
              >
	                <div>
	                  <WisaLogo className="mb-6 h-[clamp(48px,5vw,72px)] w-[clamp(48px,5vw,72px)]" />
	                  <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.4)', maxWidth: 220 }}>
	                    {footerCopy[revealLanguage].intro}
	                  </p>
	                </div>
	
	                {footerCopy[revealLanguage].columns.map(({ title, links }) => (
	                  <div key={title}>
                    <h3
                      className="mb-5 font-mono"
                      style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.3)' }}
                    >
                      {title}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {links.map(([label, href]) =>
                        href ? (
                          <a
                            key={label}
                            href={href}
                            onClick={
                              href.startsWith('#')
                                ? (event) => {
                                    event.preventDefault();
                                    smoothScrollToHash(href);
                                  }
                                : undefined
                            }
                            target={href.startsWith('http') ? '_blank' : undefined}
                            rel={href.startsWith('http') ? 'noreferrer' : undefined}
                            style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)' }}
                          >
                            {label}
                          </a>
                        ) : (
                          <span key={label} style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)' }}>
                            {label}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 56,
                  paddingTop: 32,
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: 24,
                }}
              >
                <p className="font-mono" style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.25)', letterSpacing: '0.1em' }}>
                  2026 GoodNewsWorld All Rights Reserved.
                  <br />
                  2026 GoodNewsWorld 無断転載を禁じます。
                </p>
                <div className="flex gap-6 font-mono" style={{ fontSize: 11, letterSpacing: '0.1em' }}>
                  <button
                    type="button"
                    onClick={() => setLegalModal('privacy')}
                    className="transition-colors hover:text-white"
                    style={{ color: 'rgba(255, 255, 255, 0.25)' }}
                  >
                    PRIVACY
                  </button>
                  <button
                    type="button"
                    onClick={() => setLegalModal('terms')}
                    className="transition-colors hover:text-white"
                    style={{ color: 'rgba(255, 255, 255, 0.25)' }}
                  >
                    TERMS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
