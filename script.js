document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. Auto-Typing Effect for Robotics Roles
    // ==========================================================================
    const textElement = document.getElementById("typing-text");
    if (textElement) {
        const roles = [
            "Aspiring Robotics Scientist",
            "ROS 2 & AI Developer",
            "System Integration Specialist"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                textElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 30 : 60;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 300;
            }

            setTimeout(typeEffect, typeSpeed);
        }
        
        textElement.textContent = "";
        typeEffect();
    }

    // ==========================================================================
    // 2. Scroll Reveal Effects Engine
    // ==========================================================================
    const animatedElements = document.querySelectorAll(".skill-card, .project-card, #roadmap .card");
    
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(40px)";
    });

    const observerOptions = { threshold: 0.15 };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => sectionObserver.observe(el));

    // ==========================================================================
    // 3. Navbar Active Link Highlighting on Scroll
    // ==========================================================================
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    window.addEventListener("scroll", () => {
        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active", "text-warning");
            if (link.getAttribute("href").includes(currentSection)) {
                link.classList.add("active", "text-warning");
            }
        });
    });

    // ==========================================================================
    // 4. Dark / Light Theme Toggle Engine
    // ==========================================================================
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = themeToggleBtn.querySelector("i");

    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        
        if (document.body.classList.contains("light-theme")) {
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
        } else {
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
        }
    });

    // ==========================================================================
    // 5. JavaScript Portfolio Project Laboratory Filtering System
    // ==========================================================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectItems = document.querySelectorAll(".project-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            projectItems.forEach(item => {
                if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
                    item.classList.remove("hide");
                } else {
                    item.classList.add("hide");
                }
            });
        });
    });

    // ==========================================================================
    // 6. Asynchronous Formspree Submission Engine
    // ==========================================================================
    const contactForm = document.getElementById("portfolio-contact-form");
    const formAlert = document.getElementById("form-alert");
    const submitBtn = document.getElementById("form-submit-btn");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing Connection...";
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formAlert.classList.remove("d-none", "alert-danger");
                    formAlert.classList.add("alert-success");
                    formAlert.textContent = "Secure Node Connection Established Successfully! Message Forwarded.";
                    contactForm.reset();
                } else {
                    throw new Error("Server transmission error.");
                }
            } catch (error) {
                formAlert.classList.remove("d-none", "alert-success");
                formAlert.classList.add("alert-danger");
                formAlert.textContent = "Transmission failed. Verify architecture logic and retry.";
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "Initialize Contact";
            }
        });
    }

    // ==========================================================================
    // 7. Real-Time System Clock Engine
    // ==========================================================================
    function updateSystemTime() {
        const timeElement = document.getElementById("live-time");
        const dateElement = document.getElementById("live-date");
        
        if (timeElement && dateElement) {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const formattedHours = String(hours).padStart(2, '0');
            
            timeElement.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
            
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            dateElement.textContent = `${day}-${month}-${year}`;
        }
    }
    updateSystemTime();
    setInterval(updateSystemTime, 1000);

    // ==========================================================================
    // 8. R&D Systems Lab Simulation Engine
    // ==========================================================================
    const terminal = document.getElementById("terminal-output");
    const logs = [
        "[ROS 2] Node /spider_kinematics active loop: 50Hz",
        "[BMS Node] Cell balance optimized. Pack: 12.38V",
        "[INFO] Joint telemetry mapping synchronized",
        "[WARN] High control loop latency detected",
        "> Node mapping sequence executed successfully..."
    ];

    function addLog() {
        if(terminal) {
            const log = document.createElement("div");
            log.textContent = "> " + logs[Math.floor(Math.random() * logs.length)];
            terminal.appendChild(log);
            terminal.scrollTop = terminal.scrollHeight;
        }
    }
    setInterval(addLog, 3000);

    function updateTelemetry() {
        const servoBar = document.getElementById("servo-bar");
        const powerBar = document.getElementById("power-bar");
        if(servoBar && powerBar) {
            servoBar.style.width = (Math.random() * 30 + 50) + "%";
            powerBar.style.width = (Math.random() * 15 + 80) + "%";
        }
    }
    setInterval(updateTelemetry, 2000);

    // ==========================================================================
    // 9. Multi-Language Translation Engine (English & Deutsch Node)
    // ==========================================================================
    const langToggleBtn = document.getElementById("lang-toggle");
    let currentLang = "EN";

    const dictionary = {
        "EN": {
            "nav-home": "Home", "nav-about": "About", "nav-skills": "Skills Tracker", "nav-roadmap": "Roadmap", "nav-projects": "Project Lab", "nav-systems": "Systems Lab", "nav-contact": "Contact",
            "hero-sub": "Mechatronics Technology Student", "hero-desc": "Documenting the iterative progress of building core engineering competencies across mechanical hardware, embedded electronics, and computing architectures.",
            "btn-track": "Track My Progress", "btn-connect": "Connect", "about-title": "Professional Profile",
            "about-desc": "I am a Mechatronics Technology student focused on systematic learning and iterative development. I approach engineering from first principles, building baseline skills in electronics, computer science, and CAD design.",
            "skills-title": "Technical Competency Matrix", "skills-sub": "A transparent status log of my engineering pipeline and competency development.",
            "roadmap-title": "Future Milestones & Target Pipeline", "roadmap-sub": "Paving a systematic path towards competitive robotics platforms and open-source contributions.",
            "roadmap-c1": "Preparing for global open-source programs like GSOC by mastering ROS 2 modules and actively parsing GitHub robotics codebases.",
            "roadmap-c2": "Targeting technical challenges such as national robot olympiads and university-level tech festivals to benchmark kinematics control systems.",
            "projects-title": "Project Lab & R&D Log", "projects-sub": "Iterative system construction and engineering testbeds.",
            "proj1-desc": "Designing a multi-degree-of-freedom biomimetic system to evaluate multi-servo synchronization, locomotion stability loops, and embedded power distribution schemes.",
            "proj2-desc": "Analysing custom lithium-ion battery pack assembly guidelines, reliable Buck regulation circuits, and high-discharge BMS configurations.",
            "systems-title": "Advanced R&D Systems Lab", "contact-title": "Secure Connection Node"
        },
        "DE": {
            "nav-home": "Startseite", "nav-about": "Über mich", "nav-skills": "Kompetenzen", "nav-roadmap": "Fahrplan", "nav-projects": "Projektlabor", "nav-systems": "Systemlabor", "nav-contact": "Kontakt",
            "hero-sub": "Student der Mechatronik-Technologie", "hero-desc": "Dokumentation des iterativen Fortschritts beim Aufbau von Kernkompetenzen in mechanischer Hardware, eingebetteter Elektronik und Computerarchitekturen.",
            "btn-track": "Meinen Fortschritt verfolgen", "btn-connect": "Verbinden", "about-title": "Professionelles Profil",
            "about-desc": "Ich bin ein Mechatronik-Student, der sich auf systematisches Lernen und iterative Entwicklung konzentriert. Ich nähere mich dem Ingenieurwesen von Grund auf.",
            "skills-title": "Technische Kompetenzmatrix", "skills-sub": "Ein transparentes Statusprotokoll meiner Engineering-Pipeline und Kompetenzentwicklung.",
            "roadmap-title": "Zukünftige Meilensteine & Ziel-Pipeline", "roadmap-sub": "Ebnen eines systematischen Weges zu wettbewerbsfähigen Robotikplattformen.",
            "roadmap-c1": "Vorbereitung auf globale Open-Source-Programme wie GSOC durch Beherrschung von ROS 2-Modulen und Parsen von GitHub-Codebasen.",
            "roadmap-c2": "Ausrichtung auf technische Herausforderungen wie nationale Roboter-Olympiaden, um Kinematik-Kontrollsysteme zu testen.",
            "projects-title": "Projektlabor & F&E-Protokoll", "projects-sub": "Iterativer Systembau und technische Testfelder.",
            "proj1-desc": "Entwicklung eines biomimetischen Systems mit mehreren Freiheitsgraden zur Evaluierung der Multi-Servo-Synchronisation und eingebetteter Stromversorgung.",
            "proj2-desc": "Analyse von Richtlinien für die Montage von Lithium-Ionen-Akkus, zuverlässigen Buck-Reglerschaltungen und Hochentladungs-BMS.",
            "systems-title": "Erweitertes F&E Systemlabor", "contact-title": "Sicherer Verbindungsknoten"
        }
    };

    if (langToggleBtn) {
        langToggleBtn.addEventListener("click", () => {
            currentLang = currentLang === "EN" ? "DE" : "EN";
            langToggleBtn.textContent = currentLang;

            document.querySelectorAll("[data-i18n]").forEach(el => {
                const key = el.getAttribute("data-i18n");
                if (dictionary[currentLang][key]) {
                    el.textContent = dictionary[currentLang][key];
                }
            });
        });
    }

});