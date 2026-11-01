/* =========================================================
   ORDINARY FEAR
   INTERACTIVE EXPERIENCE
========================================================= */

"use strict";


/* =========================================================
   01. SELECT ELEMENTS
========================================================= */

const readingProgress = document.getElementById("readingProgress");
const backToTop = document.getElementById("backToTop");

const menuToggle = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector(".main-navigation");

const reflectionForm = document.querySelector(".reflection-form");
const reflectionResult = document.querySelector(".reflection-result");


/* =========================================================
   02. READING PROGRESS
========================================================= */

function updateReadingProgress() {

    if (!readingProgress) return;

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    if (documentHeight <= 0) {
        readingProgress.style.width = "0%";
        return;
    }

    const progress = Math.min(
        100,
        Math.max(0, (scrollTop / documentHeight) * 100)
    );

    readingProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateReadingProgress, {
    passive: true
});

window.addEventListener("resize", updateReadingProgress);

updateReadingProgress();


/* =========================================================
   03. BACK TO TOP
========================================================= */

function updateBackToTop() {

    if (!backToTop) return;

    if (window.scrollY > 500) {
        backToTop.classList.add("is-visible");
    } else {
        backToTop.classList.remove("is-visible");
    }
}

window.addEventListener("scroll", updateBackToTop, {
    passive: true
});

if (backToTop) {

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   04. MOBILE NAVIGATION
========================================================= */

function closeMobileMenu() {

    if (!menuToggle || !mainNavigation) return;

    mainNavigation.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "فتح القائمة");

}

if (menuToggle && mainNavigation) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            mainNavigation.classList.toggle("is-open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "إغلاق القائمة" : "فتح القائمة"
        );

    });


    mainNavigation.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", closeMobileMenu);

    });


    document.addEventListener("click", event => {

        const clickedInsideMenu =
            mainNavigation.contains(event.target);

        const clickedToggle =
            menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMobileMenu();
        }

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    });


    window.addEventListener("resize", () => {

        if (window.innerWidth > 850) {
            closeMobileMenu();
        }

    });

}


/* =========================================================
   05. SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll("[data-reveal]");

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {

    revealElements.forEach(element => {
        element.classList.add("is-revealed");
    });

} else if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-revealed");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("is-revealed");
    });

}


/* =========================================================
   06. TABLE OF CONTENTS ACTIVE STATE
========================================================= */

const articleSections =
    document.querySelectorAll(".article-chapter[id]");

const tocLinks =
    document.querySelectorAll(".article-toc a[href^='#']");

if (
    articleSections.length > 0 &&
    tocLinks.length > 0 &&
    "IntersectionObserver" in window
) {

    const sectionObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                tocLinks.forEach(link => {

                    const isCurrent =
                        link.getAttribute("href") === `#${currentId}`;

                    link.classList.toggle("is-active", isCurrent);

                });

            });

        },
        {
            rootMargin: "-20% 0px -65% 0px"
        }
    );

    articleSections.forEach(section => {
        sectionObserver.observe(section);
    });

}


/* =========================================================
   07. SMOOTH INTERNAL NAVIGATION
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   08. REFLECTION EXPERIENCE
========================================================= */

const reflectionMessages = {

    low:
        "قد تكون المقارنة حاضرة في بعض اختياراتك، لكنها لا تعني أن طموحك غير حقيقي. جرّب أن تسأل نفسك: هل أريد هذا الهدف فعلًا، أم أريد الصورة التي يمنحني إياها؟",

    medium:
        "يبدو أنك تجمع بين رغبتك في تحقيق أهدافك وتأثرك أحيانًا بتوقعات الآخرين. التوازن هنا لا يعني التخلي عن الطموح، بل معرفة الأسباب التي تحركه.",

    high:
        "قد تحتل نظرة الآخرين ومقارنة نفسك بهم مساحة كبيرة من تفكيرك. من المفيد أن تراجع معايير النجاح التي اخترتها، وتسأل نفسك إن كانت تعبّر عنك فعلًا."

};


if (reflectionForm && reflectionResult) {

    reflectionForm.addEventListener("submit", event => {

        event.preventDefault();

        const questions =
            reflectionForm.querySelectorAll(
                '.reflection-question input[type="radio"]'
            );

        const questionGroups = new Set();

        questions.forEach(input => {
            questionGroups.add(input.name);
        });

        const totalQuestions = questionGroups.size;

        let answeredQuestions = 0;
        let score = 0;

        questionGroups.forEach(groupName => {

            const selected =
                reflectionForm.querySelector(
                    `input[name="${groupName}"]:checked`
                );

            if (!selected) return;

            answeredQuestions++;

            score += Number(selected.value) || 0;

        });


        if (answeredQuestions !== totalQuestions) {

            reflectionResult.textContent =
                `أجب عن الأسئلة كلها أولًا. أجبت عن ${answeredQuestions} من ${totalQuestions}.`;

            reflectionResult.classList.add("is-visible");

            reflectionResult.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

            return;

        }


        const averageScore =
            totalQuestions > 0 ? score / totalQuestions : 0;

        let message;

        if (averageScore <= 1) {

            message = reflectionMessages.low;

        } else if (averageScore <= 2) {

            message = reflectionMessages.medium;

        } else {

            message = reflectionMessages.high;

        }


        reflectionResult.textContent = message;

        reflectionResult.classList.add("is-visible");

        reflectionResult.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });

}


/* =========================================================
   09. CLOSE MENU WHEN CLICKING OUTSIDE
========================================================= */

window.addEventListener("pageshow", () => {

    updateReadingProgress();
    updateBackToTop();

});


/* =========================================================
   10. INITIALIZE
========================================================= */

document.documentElement.classList.add("js-enabled");

console.log("Ordinary Fear — Interactive experience loaded.");
