import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import ScrollReveal from './components/ScrollReveal';

const FRAME_COUNT = 192;
const INITIAL_PRELOAD_COUNT = 18;
const LOGO_URL = 'https://assets.cdn.filesafe.space/pVxIE30GROfdQAaVsJgi/media/686f096a627f396723165ccf.png';
const DATE_VENUE_LOGO_URL = 'https://assets.cdn.filesafe.space/pVxIE30GROfdQAaVsJgi/media/6995a97ff02fa4d694442b64.webp';
const GOODNEWS_DAILY_LOGO_URL = 'https://assets.cdn.filesafe.space/pVxIE30GROfdQAaVsJgi/media/6a203c12b75a113972d5cc41.webp';
const WISTIA_PLAYER_URL = 'https://fast.wistia.net/player.js';
const SPONSOR_WISTIA_URL = 'https://fast.wistia.net/embed/iframe/l9da91olq5?web_component=true&seo=false';
const VENUE_MAP_URL =
  'https://www.google.com/maps/place//data=!4m2!3m1!1s0x6018dd914443816b:0x289a3ef1c6c5b4eb?entry=gemini&utm_source=gemini&utm_campaign=gem-default';

function getFrameSrc(index: number) {
  return `/frames/frame-${String(index + 1).padStart(4, '0')}.webp`;
}

function WisaLogo({ className = '' }: { className?: string }) {
  return (
    <img
      className={className}
      src={LOGO_URL}
      alt="WISA"
      width="157"
      height="25"
      loading="eager"
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
      className={`group flex max-w-full cursor-pointer items-stretch gap-1 border-0 bg-transparent p-0 ${className}`}
    >
      <span
        className={`flex min-w-0 items-center px-4 py-3 font-mono text-[10px] font-bold tracking-[-0.01em] transition-colors sm:px-6 sm:py-4 sm:text-[11px] ${
          light
            ? 'bg-white text-black hover:bg-gray-200'
            : 'bg-white/8 text-white/90 backdrop-blur-[80px] group-hover:bg-white group-hover:text-black'
        }`}
      >
        {label}
      </span>
      <span
        className={`flex items-center justify-center px-4 transition-colors sm:px-5 ${
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

const footerColumns = [
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
      ['Instagram @Goodnewsworldofficial', 'https://www.instagram.com/goodnewsworldofficial/'],
      ['YouTube @UebertangelGNW', 'https://www.youtube.com/@UebertangelGNW'],
      ['Facebook @uebertangelextra', 'https://www.facebook.com/uebertangelextra'],
    ],
  },
];

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

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameImagesRef = useRef<HTMLImageElement[]>([]);
  const loadedFramesRef = useRef<boolean[]>([]);
  const screen3Ref = useRef<HTMLDivElement | null>(null);
  const sponsorVideoRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHealingDetailsOpen, setIsHealingDetailsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);
  const [isSponsorEmbedReady, setIsSponsorEmbedReady] = useState(false);
  const [isSharedLanguageVisible, setIsSharedLanguageVisible] = useState(true);
  const [revealLanguage, setRevealLanguage] = useState<'en' | 'ja'>('en');
  const [attendanceLanguage, setAttendanceLanguage] = useState<'en' | 'ja'>('en');
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 500, 800], [0, 0, -150]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAttendanceLanguage((language) => (language === 'en' ? 'ja' : 'en'));
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (document.querySelector(`script[src="${WISTIA_PLAYER_URL}"]`)) return;

    const script = document.createElement('script');
    script.src = WISTIA_PLAYER_URL;
    script.async = true;
    document.body.appendChild(script);
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

    const loadFrame = (index: number) => {
      const image = frameImagesRef.current[index] ?? new Image();
      image.decoding = 'async';
      image.onload = () => {
        loadedFramesRef.current[index] = true;
        if (!isCancelled && index === 0) {
          setIsLoaded(true);
        }
      };

      frameImagesRef.current[index] = image;
      if (!image.src) {
        image.src = getFrameSrc(index);
      }
      if (image.complete && image.naturalWidth) {
        image.onload?.(new Event('load'));
      }

      return image;
    };

    for (let index = 0; index < INITIAL_PRELOAD_COUNT; index += 1) {
      loadFrame(index);
    }

    let nextPreloadIndex = INITIAL_PRELOAD_COUNT;
    const preloadNextBatch = () => {
      if (isCancelled || nextPreloadIndex >= FRAME_COUNT) return;

      const batchEnd = Math.min(nextPreloadIndex + 8, FRAME_COUNT);
      for (let index = nextPreloadIndex; index < batchEnd; index += 1) {
        loadFrame(index);
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

      const targetImage = frameImagesRef.current[frameIndex];
      const fallbackImage = frameImagesRef.current.find((_, index) => loadedFramesRef.current[index]);
      const image = loadedFramesRef.current[frameIndex] ? targetImage : fallbackImage;
      if (!image?.naturalWidth || !image.naturalHeight) return;

      const dpr = window.devicePixelRatio || 1;
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
      const frameIndex = Math.min(FRAME_COUNT - 1, Math.round(scrollFraction * (FRAME_COUNT - 1)));
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
    <div className="min-h-screen bg-black font-sans text-white selection:bg-white selection:text-black">
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(185,145,48,0.2)_0%,rgba(26,26,26,0.38)_32%,rgba(0,0,0,1)_76%)]" />
          <div className="absolute inset-x-8 top-1/2 h-px bg-white/10" />
          <div className="relative flex flex-col items-center">
            <div className="relative flex h-28 w-28 items-center justify-center md:h-32 md:w-32">
              <div className="animate-preloader-pulse absolute inset-0 rounded-full border border-[#b99130]/50" />
              <div className="absolute inset-3 rounded-full border border-white/10" />
              <WisaLogo className="h-20 w-20 md:h-24 md:w-24" />
            </div>
            <div className="mt-8 text-center">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#d7b45a]/80">
                GoodNews Japan
              </div>
              <div className="mt-3 text-[clamp(2rem,5vw,4rem)] font-medium leading-none tracking-tight text-white">
                2026
              </div>
            </div>
            <div className="mt-9 h-[2px] w-72 overflow-hidden bg-white/10">
              <div className="animate-preloader-sweep h-full w-1/3 bg-[#d7b45a]" />
            </div>
            <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              Preparing the arrival
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
        className="fixed left-1/2 top-4 z-20 w-[88%] max-w-[560px] -translate-x-1/2 pointer-events-auto md:top-5"
      >
        <nav className="flex items-center rounded-full border border-white/20 bg-[#1A1A1A]/62 px-2.5 py-1.5 shadow-2xl shadow-black/30 backdrop-blur-[80px] sm:px-4 sm:py-2 md:px-5">
          <a
            href="#home"
            aria-label="GoodNews Japan home"
            className="flex h-8 w-10 shrink-0 items-center justify-center sm:h-10 sm:w-12 md:w-14"
          >
            <WisaLogo className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10" />
          </a>
          <div className="mx-2 h-7 w-px bg-white/20 sm:mx-3 sm:h-8" />
          <div className="grid min-w-0 flex-1 grid-cols-3 items-center gap-1 text-center font-sans text-[12px] font-semibold tracking-[-0.01em] text-white/84 sm:gap-2 sm:text-sm md:gap-4 md:text-base">
            {[
              ['Home', '#home'],
              ['About', '#about'],
              ['Contact', '#contact'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-full px-1.5 py-1.5 transition-colors hover:bg-white/10 hover:text-white sm:px-2 md:px-3"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      </motion.header>

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
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="min-h-[calc(100vh-48px)] bg-white md:min-h-[calc(100vh-80px)]">
              <div className="border-b border-black/10 bg-[#0f0f0f] px-6 py-8 pr-20 md:px-10">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d7b45a]/85">
                  {sponsorSectionCopy[revealLanguage].eyebrow}
                </p>
                <h2 className="mt-3 max-w-[760px] text-[clamp(2rem,4vw,3.75rem)] font-medium leading-[1.04] tracking-tight text-white">
                  {sponsorSectionCopy[revealLanguage].title}
                </h2>
              </div>
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

      <main className="relative z-10 pointer-events-none">
        <section
          id="home"
          className="mx-auto flex min-h-[100svh] w-[90%] flex-col pb-8 pt-28 md:h-screen md:pb-12 md:pt-28 lg:pb-16 lg:pt-32"
        >
          <div className="flex flex-1 w-full flex-col justify-end gap-y-5 pointer-events-auto md:grid md:grid-cols-12 md:grid-rows-[1fr_auto] md:gap-x-8 md:gap-y-0">
            <Reveal delay={0.2} className="flex items-end md:col-span-7 md:col-start-1 md:row-start-2 lg:col-span-8">
              <div>
                <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70 sm:text-xs">
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
                  className="mt-4 block max-w-[620px] text-[12px] font-medium leading-[1.45] text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline sm:text-[13px] md:max-w-[470px] lg:max-w-[560px]"
                >
                  会場：所沢市民文化センター ミューズ マーキーホール, 〒359-0042 埼玉県所沢市並木1-9-1
                  <br />
                  Venue: Tokorozawa Civic Cultural Centre MUSE, Marquee Hall, 1-9-1 Namiki, Tokorozawa, Saitama
                  359-0042
                </a>
              </div>
            </Reveal>

            <Reveal
              delay={0.3}
              className="flex flex-col items-start justify-center text-left md:col-span-5 md:col-start-8 md:row-start-1 md:items-end md:text-right"
            >
              <p className="relative max-w-[500px] text-[clamp(0.95rem,3.8vw,1.375rem)] font-bold leading-[1.28] text-white md:text-[clamp(1rem,1.35vw,1.25rem)] md:leading-[1.32]">
                世界的預言の器 来日決定/The Prophet to the Last Dispensation is coming to Japan!
                <br />
                <span>癒しと奇跡のイベント！</span>
                <br />
                <span>スピーカー：ユーバート・エンジェル師</span>
              </p>
            </Reveal>

            <Reveal
              delay={0.4}
              className="flex items-end justify-start md:col-span-5 md:col-start-8 md:row-start-2 md:justify-end lg:col-span-4 lg:col-start-9"
            >
              <SplitCta
                onClick={() => setIsRegisterOpen(true)}
                label={
                  <span className="block min-w-[140px] overflow-hidden text-left sm:min-w-[170px]">
                    <motion.span
                      key={attendanceLanguage}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="block"
                    >
                      {attendanceLanguage === 'en' ? (
                        <>
                          <span className="block text-[9px] uppercase tracking-[0.14em] opacity-70">
                            Let Us Know
                          </span>
                          <span className="mt-1 block text-[13px] leading-none tracking-[0.02em] sm:text-[15px]">
                            You're Coming
                          </span>
                        </>
                      ) : (
                        <span className="block text-[11px] leading-[1.25] tracking-[0.02em] sm:text-[13px]">
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
          <LanguageToggle
            revealLanguage={revealLanguage}
            setRevealLanguage={setRevealLanguage}
            className={`sticky top-24 z-10 mb-8 ml-[5%] transition-opacity duration-500 md:top-28 lg:top-32 ${
              isSharedLanguageVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          />

        <section className="mx-auto flex min-h-screen w-[90%] flex-col justify-center py-8 pointer-events-auto md:py-12 lg:py-16">
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
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src="https://assets.cdn.filesafe.space/pVxIE30GROfdQAaVsJgi/media/697cfce550158bec52c80442.png"
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
                  onClick={() => setIsRegisterOpen(true)}
                  className="mt-5 block bg-white px-6 py-4 font-mono text-xs font-bold uppercase tracking-[-0.01em] text-black transition-colors hover:bg-gray-200"
                >
                  {healingCopy[revealLanguage].register}
                </button>
              </Reveal>
            </div>
          </div>
        </section>

        <div className="h-12 w-full md:h-16" />

        <section className="mx-auto flex min-h-[90vh] w-[90%] flex-col justify-center pb-16 pt-8 pointer-events-auto md:pt-10">
          <div className="grid w-full grid-cols-1 items-center gap-10 border-y border-white/10 py-12 md:grid-cols-12 md:gap-10 lg:py-14">
            <Reveal className="md:col-span-6">
              <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#d7b45a]/80">
                <img
                  src={GOODNEWS_DAILY_LOGO_URL}
                  alt="GoodNews Daily"
                  className="mb-4 h-10 w-auto object-contain sm:h-12"
                  loading="lazy"
                  decoding="async"
                />
                {sponsorSectionCopy[revealLanguage].eyebrow}
              </p>
              <h2 className="max-w-[620px] text-[clamp(2rem,4vw,3.85rem)] font-medium leading-[1.03] tracking-tight text-white">
                {sponsorSectionCopy[revealLanguage].title}
              </h2>
              <div
                ref={sponsorVideoRef}
                className="mt-8 max-w-[440px] overflow-hidden border border-white/10 bg-black/70 shadow-2xl shadow-black/30"
              >
                <div className="relative w-full" style={{ paddingTop: '125%' }}>
                  <iframe
                    src={SPONSOR_WISTIA_URL}
                    title="Project Japan sponsor video"
                    allow="autoplay; fullscreen"
                    allowTransparency
                    frameBorder="0"
                    scrolling="no"
                    className="wistia_embed absolute left-0 top-0 h-full w-full"
                    name="wistia_embed"
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="md:col-span-6">
              <p className="max-w-[560px] text-[15px] leading-[1.65] text-white/75 md:text-[16px]">
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
                  Ready To Score
                  <br />
                  Your Winning Season?
                </h2>
                <SplitCta label="START YOUR SEASONS" light />
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
                  <WisaLogo className="mb-6 h-[clamp(12px,0.7vw,16px)] w-[clamp(75px,4.5vw,100px)]" />
                  <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.4)', maxWidth: 220 }}>
                    Premium football programming, matchday systems, and elite preparation for the world's next
                    champions.
                  </p>
                </div>

                {footerColumns.map(({ title, links }) => (
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
                  2026 WISA. ALL RIGHTS RESERVED.
                </p>
                <div className="flex gap-6 font-mono" style={{ fontSize: 11, letterSpacing: '0.1em' }}>
                  <a href="#" style={{ color: 'rgba(255, 255, 255, 0.25)' }}>
                    PRIVACY
                  </a>
                  <a href="#" style={{ color: 'rgba(255, 255, 255, 0.25)' }}>
                    TERMS
                  </a>
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
