(function () {
    const navToggle = document.querySelector("[data-nav-toggle]");
    const navMenu = document.querySelector("[data-nav-menu]");

    if (navToggle && navMenu) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");

        const toggleMenu = () => {
            const expanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!expanded));
            navMenu.classList.toggle("is-open", !expanded);
        };

        navToggle.addEventListener("click", toggleMenu);

        navMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("keyup", (event) => {
            if (event.key === "Escape") {
                navMenu.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    const body = document.body;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        body.classList.add("enable-animations");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        animatedElements.forEach((el) => observer.observe(el));
    } else {
        animatedElements.forEach((el) => el.classList.add("is-visible"));
    }

    const themeToggle = document.querySelector("[data-theme-toggle]");
    const themeIcon = themeToggle ? themeToggle.querySelector(".theme-toggle-icon") : null;

    const applyTheme = (mode) => {
        body.setAttribute("data-theme", mode);
        if (themeToggle) {
            themeToggle.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
        }
        if (themeIcon) {
            themeIcon.textContent = mode === "dark" ? "☀" : "☾";
        }
        try {
            localStorage.setItem("are-theme", mode);
        } catch (err) {
            // ignore storage errors
        }
    };

    const storedTheme = (() => {
        try {
            return localStorage.getItem("are-theme");
        } catch {
            return null;
        }
    })();

    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
        });
    }

    const skeletons = document.querySelectorAll("[data-loading='true']");
    const clearSkeletons = () => {
        skeletons.forEach((el) => el.removeAttribute("data-loading"));
    };

    window.addEventListener("load", () => {
        if (prefersReducedMotion) {
            clearSkeletons();
        } else {
            window.setTimeout(clearSkeletons, 800);
        }
    });

    const contactForm = document.getElementById("contact-form");
    const successMessage = document.getElementById("form-success");

    if (contactForm && successMessage) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            const formData = new FormData(contactForm);
            const name = formData.get("name") || "";
            const email = formData.get("email") || "";
            const phone = formData.get("phone") || "";
            const message = formData.get("message") || "";

            const mailtoLink = `mailto:info@accessrealestate.com?subject=${encodeURIComponent(
                "Consultation Request"
            )}&body=${encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nNeeds: ${message}`
            )}`;

            successMessage.hidden = false;
            successMessage.setAttribute("tabindex", "-1");
            successMessage.focus();

            window.location.href = mailtoLink;
            contactForm.reset();
        });
    }
})();
