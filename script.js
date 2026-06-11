const visual = document.querySelector(".hero-visual");
const terminal = document.querySelector(".identity-card");
const rotatingRole = document.getElementById("rotating-role");
const introLoader = document.querySelector(".intro-loader");
const skillTabs = document.querySelectorAll(".skill-tab");
const skillDisplay = document.querySelector(".skill-display");
const skillLabel = document.getElementById("skill-label");
const skillTitle = document.getElementById("skill-title");
const skillDescription = document.getElementById("skill-description");
const skillItems = document.getElementById("skill-items");
const proofDialog = document.getElementById("proof-dialog");
const proofDialogImage = document.getElementById("proof-dialog-image");
const proofDialogTitle = document.getElementById("proof-dialog-title");
const proofButtons = document.querySelectorAll("[data-proof]");
const proofClose = document.querySelector(".proof-close");
const projectCases = document.querySelectorAll(".project-case");
const quickFacts = document.querySelectorAll(".quick-facts > div");
const codingCards = document.querySelectorAll(".stat-card");
const certFilters = document.querySelectorAll("[data-cert-filter]");
const certificationCards = document.querySelectorAll("[data-cert-category]");
const certPanelTitle = document.getElementById("cert-panel-title");
const certPanelDescription = document.getElementById("cert-panel-description");
const certificationsSection = document.getElementById("certifications");
const certificationDisplay = document.querySelector(".cert-display");
const credentialsToggle = document.querySelector(".credentials-toggle");
const portfolioSections = document.querySelectorAll("main, .section[id]");
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const previewMode = new URLSearchParams(window.location.search).has("preview");

document.documentElement.classList.toggle("preview-mode", previewMode);

document.body.classList.add("is-loading");

const introDuration = reducedMotion || previewMode ? 0 : 2700;

window.setTimeout(() => {
  document.body.classList.remove("is-loading");
  introLoader?.classList.add("is-finished");
}, introDuration);

if (previewMode && window.location.hash) {
  window.requestAnimationFrame(() => {
    document.querySelector(window.location.hash)?.scrollIntoView();
  });
}

const roles = [
  "Reliable Software",
  "Applied AI Systems",
  "Scalable Web Products",
  "Practical Solutions"
];

if (rotatingRole && !reducedMotion) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  const typeRole = () => {
    const role = roles[roleIndex];

    if (deleting) {
      charIndex -= 1;
      rotatingRole.textContent = role.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        window.setTimeout(typeRole, 350);
        return;
      }
      window.setTimeout(typeRole, 42);
      return;
    }

    const nextRole = roles[roleIndex];
    charIndex += 1;
    rotatingRole.textContent = nextRole.slice(0, charIndex);

    if (charIndex === nextRole.length) {
      deleting = true;
      window.setTimeout(typeRole, 1700);
      return;
    }

    window.setTimeout(typeRole, 78);
  };

  window.setTimeout(typeRole, 3400);
}

const revealSelectors = [
  ".section-heading",
  ".about-copy",
  ".quick-facts > div",
  ".skill-menu",
  ".skill-display",
  ".coding-overview",
  ".stat-card",
  ".project-case",
  ".experience-entry",
  ".cert-heading",
  ".cert-filters",
  ".cert-display",
  ".closing-topline",
  ".closing-message",
  ".closing-details"
];

const revealItems = [...document.querySelectorAll(revealSelectors.join(","))];

revealItems.forEach((item, index) => {
  item.classList.add("reveal-item");
  item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
});

document.querySelectorAll(".about-copy, .skill-menu, .coding-overview, .cert-filters, .closing-message")
  .forEach((item) => item.classList.add("reveal-from-left"));

document.querySelectorAll(".quick-facts, .skill-display, .cert-display, .closing-details")
  .forEach((item) => item.classList.add("reveal-from-right"));

if (!reducedMotion && !previewMode && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      window.setTimeout(() => entry.target.classList.add("reveal-complete"), 850);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px"
  });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;
    const sectionId = visibleSection.target.id;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${sectionId}`);
    });
  }, {
    threshold: [0.25, 0.5, 0.7]
  });

  portfolioSections.forEach((section) => {
    if (section.id) sectionObserver.observe(section);
  });
}

const showSkill = (tab) => {
  skillTabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.setAttribute("tabindex", selected ? "0" : "-1");
  });

  skillLabel.textContent = tab.dataset.label;
  skillTitle.textContent = tab.dataset.title;
  skillDescription.textContent = tab.dataset.description;
  skillItems.replaceChildren(
    ...tab.dataset.items.split("|").map((item) => {
      const chip = document.createElement("span");
      chip.textContent = item;
      return chip;
    })
  );

  skillDisplay.classList.remove("is-changing");
  void skillDisplay.offsetWidth;
  skillDisplay.classList.add("is-changing");
};

skillTabs.forEach((tab) => {
  tab.addEventListener("click", () => showSkill(tab));
  tab.addEventListener("mouseenter", () => showSkill(tab));
  tab.addEventListener("focus", () => showSkill(tab));
});

const enableTabKeyboardNavigation = (tabs, activate) => {
  const tabList = Array.from(tabs);

  tabList.forEach((tab) => {
    tab.setAttribute("tabindex", tab.getAttribute("aria-selected") === "true" ? "0" : "-1");

    tab.addEventListener("keydown", (event) => {
      const availableTabs = tabList.filter((item) => getComputedStyle(item).display !== "none");
      const index = availableTabs.indexOf(tab);
      let nextIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % availableTabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + availableTabs.length) % availableTabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = availableTabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      const nextTab = availableTabs[nextIndex];
      activate(nextTab);
      nextTab.focus();
    });
  });
};

proofButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.remove("is-launching");
    void button.offsetWidth;
    button.classList.add("is-launching");

    window.setTimeout(() => {
      proofDialogImage.src = button.dataset.proof;
      proofDialogImage.alt = button.dataset.proofTitle;
      proofDialogTitle.textContent = button.dataset.proofTitle;
      proofDialog.showModal();
      button.classList.remove("is-launching");
    }, reducedMotion ? 0 : 140);
  });
});

proofClose?.addEventListener("click", () => proofDialog.close());

proofDialog?.addEventListener("click", (event) => {
  if (event.target === proofDialog) {
    proofDialog.close();
  }
});

if (window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
  quickFacts.forEach((fact) => {
    fact.addEventListener("mousemove", (event) => {
      const bounds = fact.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      fact.style.setProperty("--fact-tilt-x", `${y * -3.5}deg`);
      fact.style.setProperty("--fact-tilt-y", `${x * 4.5}deg`);
    });

    fact.addEventListener("mouseleave", () => {
      fact.style.setProperty("--fact-tilt-x", "0deg");
      fact.style.setProperty("--fact-tilt-y", "0deg");
    });
  });

  codingCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      card.style.setProperty("--stat-tilt-x", `${y * -2.8}deg`);
      card.style.setProperty("--stat-tilt-y", `${x * 3.4}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--stat-tilt-x", "0deg");
      card.style.setProperty("--stat-tilt-y", "0deg");
    });
  });

  projectCases.forEach((project) => {
    project.addEventListener("mousemove", (event) => {
      const bounds = project.getBoundingClientRect();
      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;
      const tiltY = ((pointerX / bounds.width) - 0.5) * 3.6;
      const tiltX = ((pointerY / bounds.height) - 0.5) * -3.2;

      project.style.setProperty("--spot-x", `${pointerX}px`);
      project.style.setProperty("--spot-y", `${pointerY}px`);
      project.style.setProperty("--tilt-x", `${tiltX}deg`);
      project.style.setProperty("--tilt-y", `${tiltY}deg`);
    });

    project.addEventListener("mouseleave", () => {
      project.style.setProperty("--tilt-x", "0deg");
      project.style.setProperty("--tilt-y", "0deg");
    });
  });
}

let activeCertificationFilter = "";

const animateCertificationDisplay = () => {
  if (reducedMotion || !certificationDisplay) return;

  certificationDisplay
    .querySelectorAll(".cert-display-head, .cert-grid")
    .forEach((element) => {
      element.getAnimations().forEach((animation) => animation.cancel());
      element.animate(
        [
          { opacity: 0.2, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        {
          duration: 280,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both"
        }
      );
    });
};

const showCertifications = (filter) => {
  const category = filter.dataset.certFilter;
  if (category === activeCertificationFilter) return;
  activeCertificationFilter = category;
  let visibleOrder = 0;

  certFilters.forEach((item) => {
    const selected = item === filter;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.setAttribute("tabindex", selected ? "0" : "-1");
  });
  certificationCards.forEach((card) => {
    const visible = category === "featured"
      ? card.dataset.certFeatured === "true"
      : card.dataset.certCategory === category;
    card.classList.toggle("is-hidden", !visible);
    if (visible) {
      card.style.setProperty("--cert-order", visibleOrder);
      visibleOrder += 1;
    }
  });

  certPanelTitle.textContent = filter.dataset.certTitle;
  certPanelDescription.textContent = filter.dataset.certDescription;

  animateCertificationDisplay();
};

certFilters.forEach((filter) => {
  filter.addEventListener("click", () => showCertifications(filter));
  filter.addEventListener("mouseenter", () => showCertifications(filter));
  filter.addEventListener("focus", () => showCertifications(filter));
});

if (certFilters.length) {
  showCertifications(certFilters[0]);
  certificationsSection?.classList.add("is-ready");
}

credentialsToggle?.addEventListener("click", () => {
  const showingAll = certificationsSection?.classList.toggle("show-all-credentials") ?? false;
  credentialsToggle.setAttribute("aria-expanded", String(showingAll));
  credentialsToggle.querySelector("span").textContent = showingAll
    ? "Show selected credentials"
    : "View all credentials";
  credentialsToggle.querySelector("b").textContent = showingAll ? "−" : "+";

  if (!showingAll && certFilters[0]) {
    activeCertificationFilter = "";
    showCertifications(certFilters[0]);
  }
});

enableTabKeyboardNavigation(skillTabs, showSkill);
enableTabKeyboardNavigation(certFilters, showCertifications);
