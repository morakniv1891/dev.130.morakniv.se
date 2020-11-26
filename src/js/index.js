import $ from "jquery";
import LocomotiveScroll from "locomotive-scroll";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

//Main code
$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger);

  const scroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
    smoothMobile: true,
  });

  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  scroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform ? "transform" : "fixed",
  });

  scroll.stop();

  /*
  /*
  /*
  /*
  /*
  /**/

  ScrollTrigger.matchMedia({
    "(max-width: 1023px)": function () {},
    "(min-width: 1024px)": function () {},
    all: function () {
      //Background "scrolling" away upwards
      gsap.to(".page-1", {
        backgroundPositionY: "-150vh",
        duration: 4,
        delay: 1.5,
        ease: "power2.inOut",
      });

      //Anniversary logo coming in from below and shrinking into position
      gsap.from(".anniversary-logo", {
        scale: 2,
        y: "75vh",
        duration: 3.5,
        delay: 1.5,
        ease: "power1.inOut",
      });

      //Top line moving in from below
      gsap.from(".left", {
        y: "100vh",
        duration: 3,
        delay: 1.5,
      });

      //"Scroll to explore" text coming in from the bottom
      gsap.from(".scroll-to-explore", {
        y: 200,
        duration: 1.5,
        delay: 4,
        onComplete: () => {
          scroll.start();
        },
      });
    },
  });

  /*
  /*
  /*
  /*
  /*
  /**/

  $(window).on("beforeunload", function () {
    $("main").remove();
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => scroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
});
