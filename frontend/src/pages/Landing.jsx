import React, { useEffect } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { landingHtml } from './landing-html';

export default function Landing() {
  useEffect(() => {
    // FAQ Toggle Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const header = item.querySelector('.faq-header');
      const content = item.querySelector('.faq-content');
      if (header && content) {
        // Remove old listeners to avoid duplicates on re-render
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
        
        newHeader.addEventListener('click', () => {
          const isOpen = content.classList.contains('h-0');
          if (isOpen) {
            content.classList.remove('h-0', 'opacity-0');
            content.classList.add('h-auto', 'opacity-100');
          } else {
            content.classList.add('h-0', 'opacity-0');
            content.classList.remove('h-auto', 'opacity-100');
          }
        });
      }
    });

    // Mobile Menu Toggle Logic
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileDropdown = document.getElementById('mobile-menu-dropdown');
    if (mobileBtn && mobileDropdown) {
      const toggleMenu = () => {
        mobileDropdown.classList.toggle('hidden');
      };
      mobileBtn.addEventListener('click', toggleMenu);
    }

    // Initialize GSAP
    const activeGsap = window.gsap || gsap;
    if (activeGsap) {
      const ScrollTrigger = window.ScrollTrigger;
      const ScrollSmoother = window.ScrollSmoother;
      const SplitText = window.SplitText;

      if (ScrollSmoother && ScrollTrigger) {
        try {
          ScrollSmoother.create({
            content: "#smooth-content",
            wrapper: "#smooth-wrapper",
            smooth: 1.5,
            effects: true,
            normalizeScroll: true,
          });
        } catch (e) {
          console.warn("ScrollSmoother failed to init", e);
        }
      }

      const heroTl = activeGsap.timeline({ defaults: { ease: "power4.out" } });
      
      // Typewriter Animation for "Your Finance" (Guaranteed Visible & Animated)
      let typeTimeout;
      const typeEl = document.getElementById("typewriter-text");
      if (typeEl) {
        const phrases = "Your Finance";
       
        let charIdx = 0
        //let isDeleting = false;

        typeEl.textContent = "";

        const runTypewriter = () => {
         
            charIdx++;
            typeEl.textContent = phrases.substring(0, charIdx);
          
            //typeEl.textContent = currentPhrase.substring(0, charIdx);
            if(charIdx <phrases.length)
            {
              setTimeout(runTypewriter,40);
            }
          };
          runTypewriter();

        //   let speed = isDeleting ? 40 : 85;

        //   if (!isDeleting && charIdx === currentPhrase.length) {
        //     speed = 2200; // Pause when word is completely typed
        //     isDeleting = true;
        //   } else if (isDeleting && charIdx === 0) {
        //     isDeleting = false;
        //     phraseIdx = (phraseIdx + 1) % phrases.length;
        //     speed = 0; // Pause before typing next word
        //   }

        //   typeTimeout = setTimeout(runTypewriter, speed);
        // };
        //     runTypewriter();
        // // Start cycling after initial reading pause
        // typeTimeout = setTimeout(() => {
        //   isDeleting = true;
        //   runTypewriter();
        // }, 2200);
      }

      if (SplitText) {
        const childSplit = new SplitText("h1 .gsap-split-text-wrapper", { type: "lines", linesClass: "overflow-hidden" });
        heroTl.from(childSplit.lines, { duration: 1.5, yPercent: 100, stagger: 0.1, ease: "power4.out" }, 0);
      } else {
        activeGsap.from("h1 .gsap-split-text-wrapper", { y: 50, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.2 });
      }

      heroTl.to(".gsap-hero-text", { y: 0, opacity: 1, duration: 1, stagger: 0.2 }, 0.5);
      heroTl.fromTo(".gsap-3d-card", { opacity: 0, rotationX: 20, rotationY: -20, z: -500, y: 100 }, { opacity: 1, rotationX: 5, rotationY: -5, z: 0, y: 0, duration: 1.5, ease: "back.out(1.2)" }, 0.2);

      const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        activeGsap.to(".gsap-3d-card", { rotationY: -5 + x, rotationX: 5 - y, duration: 0.5, ease: "power1.out" });
      };
      document.addEventListener("mousemove", handleMouseMove);

      activeGsap.to("#stats-ticker", { xPercent: -50, repeat: -1, duration: 12, ease: "linear" });

      if (ScrollTrigger) {
        const sections = activeGsap.utils.toArray(".horizontal-panel");
        if (sections.length > 0) {
          activeGsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
              trigger: ".horizontal-outer",
              pin: true,
              scrub: 1,
              snap: 1 / (sections.length - 1),
              end: () => "+=" + document.querySelector(".horizontal-outer").offsetWidth
            }
          });
        }

        activeGsap.utils.toArray(".gsap-bg-blob").forEach(blob => {
          const speed = blob.getAttribute("data-speed") || 1;
          activeGsap.to(blob, {
            y: () => (window.innerHeight * speed),
            ease: "none",
            scrollTrigger: {
              trigger: blob.parentElement,
              start: "top top",
              end: "bottom top",
              scrub: true
            }
          });
        });
      }

      // --- Testimonials Marquee Animations ---
      // First line: Move from left to right (->)
      const track1 = document.querySelector("#marquee-row-1");
      let tween1;
      if (track1) {
        if (!track1.dataset.original) {
          track1.dataset.original = track1.innerHTML;
        }
        track1.innerHTML =
          track1.dataset.original +
          track1.dataset.original +
          track1.dataset.original +
          track1.dataset.original;

        tween1 = activeGsap.fromTo(
          track1,
          { xPercent: -50 },
          {
            xPercent: 0,
            duration: 30,
            ease: "none",
            repeat: -1,
          }
        );

        track1.addEventListener("mouseenter", () => tween1.pause());
        track1.addEventListener("mouseleave", () => tween1.play());
      }

      // Second line: Move from right to left (<-)
      const track2 = document.querySelector("#marquee-row-2");
      let tween2;
      if (track2) {
        if (!track2.dataset.original) {
          track2.dataset.original = track2.innerHTML;
        }
        track2.innerHTML =
          track2.dataset.original +
          track2.dataset.original +
          track2.dataset.original +
          track2.dataset.original;

        tween2 = activeGsap.fromTo(
          track2,
          { xPercent: 0 },
          {
            xPercent: -50,
            duration: 30,
            ease: "none",
            repeat: -1,
          }
        );

        track2.addEventListener("mouseenter", () => tween2.pause());
        track2.addEventListener("mouseleave", () => tween2.play());
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        if (typeTimeout) clearTimeout(typeTimeout);
        if (tween1) tween1.kill();
        if (tween2) tween2.kill();
        if (ScrollTrigger) {
          ScrollTrigger.getAll().forEach(t => t.kill());
        }
      };
    }
  }, []);

  const options = {
    replace: ({ name, attribs, children }) => {
      // Replace anchor tags linking to internal routes with React Router Links
      if (name === 'a' && attribs && attribs.href) {
        if (attribs.href.startsWith('/accounts/login')) {
          return <Link to="/login" className={attribs.class}>{domToReact(children, options)}</Link>;
        }
        if (attribs.href.startsWith('/accounts/signup')) {
          return <Link to="/signup" className={attribs.class}>{domToReact(children, options)}</Link>;
        }
      }
      
      // Fix svg tags needing camelCase attributes
      if (name === 'svg' || name === 'path' || name === 'circle' || name === 'rect') {
        const newAttribs = { ...attribs };
        // rename stroke-width -> strokeWidth, etc
        if (newAttribs['stroke-width']) { newAttribs.strokeWidth = newAttribs['stroke-width']; delete newAttribs['stroke-width']; }
        if (newAttribs['stroke-linecap']) { newAttribs.strokeLinecap = newAttribs['stroke-linecap']; delete newAttribs['stroke-linecap']; }
        if (newAttribs['stroke-linejoin']) { newAttribs.strokeLinejoin = newAttribs['stroke-linejoin']; delete newAttribs['stroke-linejoin']; }
        if (newAttribs['fill-opacity']) { newAttribs.fillOpacity = newAttribs['fill-opacity']; delete newAttribs['fill-opacity']; }
        if (newAttribs['stroke-opacity']) { newAttribs.strokeOpacity = newAttribs['stroke-opacity']; delete newAttribs['stroke-opacity']; }
        // rename class -> className in svgs
        if (newAttribs.class) { newAttribs.className = newAttribs.class; delete newAttribs.class; }
        
        return React.createElement(name, newAttribs, domToReact(children, options));
      }
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans antialiased selection:bg-indigo-600/20 selection:text-indigo-600 overflow-x-hidden">
      {parse(landingHtml, options)}
    </div>
  );
}
