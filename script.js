document.addEventListener("DOMContentLoaded", () => {
    
    // Auto-Typing Effect for Hero Subtitle
    const textElement = document.querySelector(".hero-section .lead");
    if (textElement) {
        const roles = [
            "Mechatronics Technology Student",
            "Aspiring Robotics Scientist",
            "System Integration Enthusiast"
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

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 400;
            }

            setTimeout(typeEffect, typeSpeed);
        }
        
        textElement.textContent = "";
        typeEffect();
    }

    // Scroll Reveal Animation for Cards
    const animatedElements = document.querySelectorAll(".skill-card, .project-card, #roadmap .card");
    
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(40px)";
        el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animatedElements.forEach(el => observer.observe(el));

    // Navbar Navigation Active Link Highlighting on Scroll
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    window.addEventListener("scroll", () => {
        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
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
});