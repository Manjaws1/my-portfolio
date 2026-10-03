document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const backToTop = document.getElementById("backToTop");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const pageLoader = document.getElementById("pageLoader");
  const currentYear = document.getElementById("currentYear");

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const reveals = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll(".counter");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  const mobileLinks = mobileNav
    ? mobileNav.querySelectorAll("a")
    : [];

  // Page loader
  window.addEventListener("load", () => {
    if (!pageLoader) return;

    setTimeout(() => {
      pageLoader.classList.add("hidden");
    }, 250);
  });

  // Current year
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  const closeMobileMenu = () => {
    if (!menuToggle || !mobileNav) return;

    menuToggle.classList.remove("open");
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("no-scroll");
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.classList.toggle("open");

      mobileNav.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("no-scroll", isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  // Header scroll state and back-to-top button
  const handleScrollState = () => {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle("scrolled", scrollY > 30);
    }

    if (backToTop) {
      backToTop.classList.toggle("show", scrollY > 500);
    }
  };

  window.addEventListener("scroll", handleScrollState, {
    passive: true
  });

  handleScrollState();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Active navigation section
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Reveal elements on scroll
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    reveals.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    reveals.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // Animated counters
  const statsSection = document.querySelector(".stats-grid");

  const animateCounter = (element) => {
    const target = Number(element.dataset.target) || 0;
    const suffix = element.dataset.suffix || "";
    const duration = 1400;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const value = Math.round(
        target * easedProgress
      );

      element.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if (
    statsSection &&
    counters.length &&
    "IntersectionObserver" in window
  ) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        const entry = entries[0];

        if (!entry.isIntersecting) return;

        counters.forEach((counter) => {
          animateCounter(counter);
        });

        observer.unobserve(statsSection);
      },
      {
        threshold: 0.4
      }
    );

    counterObserver.observe(statsSection);
  }

  // Project filtering
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      projectCards.forEach((card) => {
        const categories =
          card.dataset.category?.split(" ") || [];

        const shouldShow =
          filter === "all" ||
          categories.includes(filter);

        card.classList.toggle(
          "hidden",
          !shouldShow
        );
      });
    });
  });

  // Contact form validation
  if (contactForm) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const subjectError = document.getElementById("subjectError");
    const messageError = document.getElementById("messageError");

    const portfolioEmail ="gbenlekamolideen@gmail.com";

    const showError = (
      input,
      errorElement,
      message
    ) => {
      if (!input || !errorElement) return;

      errorElement.textContent = message;

      input.classList.add("input-error");
      input.classList.remove("input-success");
    };

    const showSuccess = (
      input,
      errorElement
    ) => {
      if (!input || !errorElement) return;

      errorElement.textContent = "";

      input.classList.remove("input-error");
      input.classList.add("input-success");
    };

    const clearFieldState = (
      input,
      errorElement
    ) => {
      if (!input || !errorElement) return;

      errorElement.textContent = "";

      input.classList.remove(
        "input-error",
        "input-success"
      );
    };

    const validateName = () => {
      if (!nameInput) return false;

      const value = nameInput.value.trim();

      if (!value) {
        showError(
          nameInput,
          nameError,
          "Please enter your name."
        );

        return false;
      }

      if (value.length < 2) {
        showError(
          nameInput,
          nameError,
          "Name must contain at least 2 characters."
        );

        return false;
      }

      showSuccess(
        nameInput,
        nameError
      );

      return true;
    };

    const validateEmail = () => {
      if (!emailInput) return false;

      const value = emailInput.value.trim();

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value) {
        showError(
          emailInput,
          emailError,
          "Please enter your email address."
        );

        return false;
      }

      if (!emailPattern.test(value)) {
        showError(
          emailInput,
          emailError,
          "Please enter a valid email address."
        );

        return false;
      }

      showSuccess(
        emailInput,
        emailError
      );

      return true;
    };

    const validateSubject = () => {
      if (!subjectInput) return false;

      const value =
        subjectInput.value.trim();

      if (!value) {
        showError(
          subjectInput,
          subjectError,
          "Please enter a subject."
        );

        return false;
      }

      if (value.length < 3) {
        showError(
          subjectInput,
          subjectError,
          "Subject must contain at least 3 characters."
        );

        return false;
      }

      showSuccess(
        subjectInput,
        subjectError
      );

      return true;
    };

    const validateMessage = () => {
      if (!messageInput) return false;

      const value =
        messageInput.value.trim();

      if (!value) {
        showError(
          messageInput,
          messageError,
          "Please enter your message."
        );

        return false;
      }

      if (value.length < 10) {
        showError(
          messageInput,
          messageError,
          "Message must contain at least 10 characters."
        );

        return false;
      }

      showSuccess(
        messageInput,
        messageError
      );

      return true;
    };

    // Live validation after user starts typing
    if (nameInput) {
      nameInput.addEventListener(
        "input",
        validateName
      );
    }

    if (emailInput) {
      emailInput.addEventListener(
        "input",
        validateEmail
      );
    }

    if (subjectInput) {
      subjectInput.addEventListener(
        "input",
        validateSubject
      );
    }

    if (messageInput) {
      messageInput.addEventListener(
        "input",
        validateMessage
      );
    }

    // Remove green state when user focuses on field again
    [
      [nameInput, nameError],
      [emailInput, emailError],
      [subjectInput, subjectError],
      [messageInput, messageError]
    ].forEach(([input, errorElement]) => {
      if (!input) return;

      input.addEventListener("focus", () => {
        if (
          input.classList.contains(
            "input-success"
          )
        ) {
          clearFieldState(
            input,
            errorElement
          );
        }
      });
    });

    // Form submit
    contactForm.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const isNameValid =
          validateName();

        const isEmailValid =
          validateEmail();

        const isSubjectValid =
          validateSubject();

        const isMessageValid =
          validateMessage();

        const formIsValid =
          isNameValid &&
          isEmailValid &&
          isSubjectValid &&
          isMessageValid;

        if (!formIsValid) {
          if (formStatus) {
            formStatus.textContent =
              "Please correct the highlighted fields.";

            formStatus.classList.add(
              "error"
            );

            formStatus.classList.remove(
              "success"
            );
          }

          const firstInvalidField =
            contactForm.querySelector(
              ".input-error"
            );

          if (firstInvalidField) {
            firstInvalidField.focus();
          }

          return;
        }

        const name =
          nameInput.value.trim();

        const email =
          emailInput.value.trim();

        const subject =
          subjectInput.value.trim();

        const message =
          messageInput.value.trim();

        const emailSubject =
          encodeURIComponent(
            `${subject} - Portfolio message from ${name}`
          );

        const emailBody =
          encodeURIComponent(
`Hello Manjaws,

You received a new message from your portfolio website.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Regards,
${name}`
          );

        if (formStatus) {
          formStatus.textContent =
            "Your message is ready. Opening your email application...";

          formStatus.classList.remove(
            "error"
          );

          formStatus.classList.add(
            "success"
          );
        }

        setTimeout(() => {
          window.location.href =
            `mailto:${portfolioEmail}` +
            `?subject=${emailSubject}` +
            `&body=${emailBody}`;
        }, 500);
      }
    );
  }

  // Close mobile menu when switching to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      closeMobileMenu();
    }
  });
});