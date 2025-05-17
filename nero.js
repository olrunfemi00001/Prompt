// Combined JavaScript for NeuroPrompt with Navigation Enhancements
document.addEventListener('DOMContentLoaded', () => {
    // ====================== NAVIGATION FUNCTIONALITY ======================
    // Cache DOM elements
    const navbar = document.querySelector('.neuro-navbar');
    const navbarCollapse = document.getElementById('navbarCollapse');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    // Close mobile menu when clicking a link (for single-page applications)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                // Close the mobile menu
                navbarToggler.setAttribute('aria-expanded', 'false');
                navbarCollapse.classList.remove('show');
                
                // For Bootstrap 5, you might need to trigger the collapse manually
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });

    // Add smooth scrolling to all links with hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's a dropdown toggle or doesn't have a valid target
            if (this.classList.contains('dropdown-toggle') || this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate the scroll position accounting for fixed navbar
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        let scrollPosition = window.scrollY + navbar.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }
    
    // Initial active link setup
    updateActiveLink();
    
    // Throttle scroll event for performance
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            updateActiveLink();
            
            // Add/remove navbar shadow on scroll
            if (window.scrollY > 10) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }, 100);
    });

    // Mobile menu improvements
    navbarToggler.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        
        // Toggle body overflow when menu is open
        if (!expanded) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
            navbarToggler.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    });

    // Keyboard navigation for menu
    navbar.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
            navbarToggler.setAttribute('aria-expanded', 'false');
            navbarToggler.focus();
            document.body.classList.remove('menu-open');
        }
    });

    // ====================== EXISTING NEUROPROMPT FUNCTIONALITY ======================
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Character counter for input
    const inputPrompt = document.getElementById('inputPrompt');
    const inputCounter = document.getElementById('inputCounter');
    
    if (inputPrompt && inputCounter) {
        inputPrompt.addEventListener('input', function() {
            inputCounter.textContent = `${this.value.length}/500`;
        });
    }

    // Form submission handler
    const promptForm = document.getElementById('promptForm');
    if (promptForm) {
        promptForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputText = inputPrompt.value.trim();
            const aiPlatform = document.getElementById('aiPlatform').value;
            const toneStyle = document.getElementById('toneStyle').value;
            
            if (!inputText) {
                animateInputError();
                return;
            }
            
            optimizePrompt(inputText, aiPlatform, toneStyle);
        });
    }

    // Regenerate button handler
    const newPromptBtn = document.getElementById('newPromptBtn');
    if (newPromptBtn) {
        newPromptBtn.addEventListener('click', function() {
            const inputText = inputPrompt.value.trim();
            const aiPlatform = document.getElementById('aiPlatform').value;
            const toneStyle = document.getElementById('toneStyle').value;
            
            if (inputText) {
                optimizePrompt(inputText, aiPlatform, toneStyle);
            }
        });
    }

    // Copy button handler
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const promptText = document.getElementById('optimizedPrompt').textContent;
            navigator.clipboard.writeText(promptText).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check me-1"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                }, 2000);
            });
        });
    }

    // Improved Intersection Observer for section animations
    const animateOnScroll = () => {
        const sections = document.querySelectorAll('section');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class
                    entry.target.classList.add('section-visible');
                    
                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            // Set initial state
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            // Start observing
            observer.observe(section);
        });
    };

    // CSS for the animations (will be added dynamically)
    const style = document.createElement('style');
    style.textContent = `
        .section-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Hero section specific animation */
        .hero-content > * {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .hero-content.animate-in > * {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Stagger animations for hero content */
        .hero-content.animate-in > :nth-child(1) { transition-delay: 0.1s; }
        .hero-content.animate-in > :nth-child(2) { transition-delay: 0.2s; }
        .hero-content.animate-in > :nth-child(3) { transition-delay: 0.3s; }
        .hero-content.animate-in > :nth-child(4) { transition-delay: 0.4s; }
        
        /* Navbar scroll effect */
        .navbar-scrolled {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Prevent scrolling when mobile menu is open */
        body.menu-open {
            overflow: hidden;
            position: fixed;
            width: 100%;
        }
    `;
    document.head.appendChild(style);

    // Animate hero section immediately
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('animate-in');
        }, 100);
    }

    // Animate hero card with slight delay
    const heroCard = document.querySelector('.hero-card');
    if (heroCard) {
        heroCard.style.opacity = '0';
        heroCard.style.transform = 'translateY(30px)';
        heroCard.style.transition = 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s';
        
        setTimeout(() => {
            heroCard.style.opacity = '1';
            heroCard.style.transform = 'translateY(0)';
        }, 400);
    }

    // Start section animations
    animateOnScroll();

    // Function to animate input error
    function animateInputError() {
        if (!inputPrompt) return;
        inputPrompt.style.borderColor = '#ef4444';
        setTimeout(() => {
            inputPrompt.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }, 1000);
    }

    // Function to optimize prompt
    function optimizePrompt(inputText, platform, tone) {
        const resultCard = document.getElementById('resultCard');
        const optimizedPrompt = document.getElementById('optimizedPrompt');
        const platformBadge = document.getElementById('platformBadge');
        const toneBadge = document.getElementById('toneBadge');
        const charCount = document.getElementById('charCount');
        const optimizeBtn = document.getElementById('optimizeBtn');

        // Show loading state
        if (optimizeBtn) {
            optimizeBtn.innerHTML = '<span class="loading-spinner me-2"></span> Optimizing...';
            optimizeBtn.disabled = true;
        }

        // Hide previous result if showing
        if (resultCard) {
            resultCard.style.opacity = '0';
        }

        // Simulate API call
        setTimeout(() => {
            // Generate optimized prompt
            const prompt = generateOptimizedPrompt(inputText, platform, tone);
            
            // Update the UI
            if (optimizedPrompt) optimizedPrompt.textContent = prompt;
            updateBadges(platform, tone);
            if (charCount) charCount.textContent = `${prompt.length} characters`;
            
            // Show result card with animation
            if (resultCard) {
                resultCard.style.display = 'block';
                setTimeout(() => {
                    resultCard.style.opacity = '1';
                    resultCard.style.transform = 'translateY(0)';
                }, 50);
            }

            // Reset button
            if (optimizeBtn) {
                optimizeBtn.innerHTML = '<i class="fas fa-magic me-2"></i> Optimize Prompt';
                optimizeBtn.disabled = false;
            }
        }, 1500);
    }

    // Function to generate optimized prompt
    function generateOptimizedPrompt(input, platform, tone) {
        const platformTemplates = {
            chatgpt: {
                intro: "Act as a professional with 10 years of experience in this field.",
                instructions: "Provide a comprehensive response that includes specific examples, actionable advice, and addresses potential follow-up questions.",
                structure: "Structure your response with clear headings and bullet points when appropriate."
            },
            midjourney: {
                intro: "A highly detailed digital artwork in a cinematic style,",
                instructions: "4K resolution, dramatic lighting, intricate details, trending on artstation,",
                structure: "unreal engine 5 render, --ar 16:9 --v 5"
            },
            dalle: {
                intro: "A digital art painting in a modern style,",
                instructions: "hyper-detailed, vibrant colors, 8K resolution, trending on artstation,",
                structure: "digital illustration"
            }
        };

        const toneModifiers = {
            professional: "The tone should be professional, authoritative, and polished.",
            friendly: "The tone should be friendly, approachable, and conversational.",
            academic: "The tone should be academic, precise, and well-researched."
        };

        const template = platformTemplates[platform] || platformTemplates.chatgpt;
        const toneModifier = toneModifiers[tone] || toneModifiers.professional;

        if (platform === 'midjourney' || platform === 'dalle') {
            return `${template.intro} "${input}", ${template.instructions} ${tone.toLowerCase()} style, ${template.structure}`;
        } else {
            return `${template.intro} ${input}. ${toneModifier} ${template.instructions} ${template.structure}`;
        }
    }

    // Function to update badges
    function updateBadges(platform, tone) {
        const platformNames = {
            chatgpt: 'ChatGPT',
            midjourney: 'Midjourney',
            dalle: 'DALL·E'
        };
        
        const toneNames = {
            professional: 'Professional',
            friendly: 'Friendly',
            academic: 'Academic'
        };

        const platformBadge = document.getElementById('platformBadge');
        const toneBadge = document.getElementById('toneBadge');
        
        if (platformBadge) {
            platformBadge.innerHTML = `<i class="fas fa-robot me-1"></i> ${platformNames[platform] || platform}`;
        }
        if (toneBadge) {
            toneBadge.innerHTML = `<i class="fas fa-sliders-h me-1"></i> ${toneNames[tone] || tone}`;
        }
    }
});