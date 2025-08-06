import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const animateLandingPage = () => {
  // Animate background stars with parallax effect
  gsap.to(".background-stars", {
    y: 80,
    ease: "none",
    scrollTrigger: {
      trigger: ".landing-page",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Rocket launch animation on scroll or button click
  const rocket = document.querySelector(".rocket");
  if (rocket) {
    gsap.fromTo(
      rocket,
      { y: 100, opacity: 0 },
      {
        y: -200,
        opacity: 1,
        duration: 2,
        scrollTrigger: {
          trigger: ".explore-button",
          start: "top center",
          onEnter: () => gsap.to(rocket, { y: -300, duration: 1 }),
        },
      }
    );
  }

  // Fade-in feature highlights as user scrolls
  const features = document.querySelectorAll(".feature");
  features.forEach((feature, index) => {
    gsap.from(feature, {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: index * 0.2,
      scrollTrigger: {
        trigger: feature,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // CTA button pulse animation
  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    gsap.to(ctaButton, {
      scale: 1.1,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: "power1.inOut",
    });
  }
};

export default animateLandingPage;