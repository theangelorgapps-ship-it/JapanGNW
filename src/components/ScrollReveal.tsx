import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

type ScrollRevealProps = {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
};

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement | null>(null);

  const splitText = useMemo(() => {
    return children.split(/(\s+)/).map((word, index) => (
      <span className="word" key={`${word}-${index}`}>
        {word}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isNarrowScreen =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
    const words = gsap.utils.toArray<HTMLElement>(container.querySelectorAll('.word'));
    const scroller = scrollContainerRef?.current ?? undefined;
    const context = gsap.context(() => {
      gsap.fromTo(
        container,
        { rotate: isNarrowScreen ? 0 : baseRotation },
        {
          rotate: 0,
          transformOrigin: '0% 50%',
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            scroller,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        words,
        { opacity: baseOpacity },
        {
          opacity: 1,
          stagger: isNarrowScreen ? 0.025 : 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true,
          },
        },
      );

      if (enableBlur && !isNarrowScreen) {
        gsap.fromTo(
          words,
          { filter: `blur(${blurStrength}px)` },
          {
            filter: 'blur(0px)',
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true,
            },
          },
        );
      }
    }, container);

    return () => {
      context.revert();
    };
  }, [
    baseOpacity,
    baseRotation,
    blurStrength,
    enableBlur,
    rotationEnd,
    scrollContainerRef,
    wordAnimationEnd,
  ]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
}
