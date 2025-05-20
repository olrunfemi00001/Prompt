/**
 * NeuroPrompt - AI Prompt Engineering Platform
 * Main JavaScript File
 * Features:
 * - GSAP animations for smooth entrances and interactions
 * - Scroll-triggered animations
 * - Dynamic content loading
 * - Interactive prompt optimization
 * - Mobile navigation
 * - Performance optimizations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP and plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ======================
    // Global Variables
    // ======================
    const isMobile = window.innerWidth < 1024;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loaderDelay = prefersReducedMotion ? 0 : 1000;

    // ======================
    // Preloader Animation
    // ======================
    const preloader = document.getElementById('preloader');
    const neuroLoader = document.querySelector('.neuro-loader');
    
    // Animate loader circles
    if (!prefersReducedMotion) {
        gsap.to('.neuro-loader-circle', {
            rotation: 360,
            duration: 4,
            repeat: -1,
            ease: 'linear'
        });
    }

    // Hide preloader after delay
    setTimeout(() => {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                preloader.style.display = 'none';
                document.body.style.overflow = 'auto';
                initAnimations();
            }
        });
    }, loaderDelay);

    // ======================
    // Navigation
    // ======================
    const nav = document.querySelector('.neuro-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuBtn = document.querySelector('.mobile-menu-btn.close');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-menu a');

    // Navbar scroll effect
    gsap.to(nav, {
        scrollTrigger: {
            trigger: 'body',
            start: '50px top',
            toggleActions: 'play none none reverse',
            onEnter: () => nav.classList.add('scrolled'),
            onLeaveBack: () => nav.classList.remove('scrolled')
        }
    });

    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Animate menu in
        gsap.fromTo(mobileMenu, 
            { x: '100%' },
            { x: '0%', duration: 0.4, ease: 'power2.out' }
        );
    });

    closeMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        
        // Animate menu out
        gsap.to(mobileMenu, {
            x: '100%',
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    // Close mobile menu if open
                    if (mobileMenu.classList.contains('open')) {
                        mobileMenuBtn.classList.remove('active');
                        mobileMenu.classList.remove('open');
                        document.body.style.overflow = '';
                    }
                    
                    // Smooth scroll to target
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: target,
                            offsetY: 100
                        },
                        ease: 'power2.inOut'
                    });
                }
            }
        });
    });

    // ======================
    // Back to Top Button
    // ======================
    const backToTopBtn = document.getElementById('backToTop');
    
    ScrollTrigger.create({
        trigger: 'body',
        start: '200px top',
        onEnter: () => {
            gsap.to(backToTopBtn, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.3
            });
        },
        onLeaveBack: () => {
            gsap.to(backToTopBtn, {
                opacity: 0,
                visibility: 'hidden',
                duration: 0.3
            });
        }
    });

    backToTopBtn?.addEventListener('click', () => {
        gsap.to(window, {
            duration: 1,
            scrollTo: 0,
            ease: 'power2.inOut'
        });
    });

    // ======================
    // Prompt Optimizer
    // ======================
    const promptForm = document.getElementById('promptForm');
    const inputPrompt = document.getElementById('inputPrompt');
    const inputCounter = document.getElementById('inputCounter');
    const optimizeBtn = document.getElementById('optimizeBtn');
    const resultCard = document.getElementById('resultCard');
    const optimizedPrompt = document.getElementById('optimizedPrompt');
    const platformBadge = document.getElementById('platformBadge');
    const toneBadge = document.getElementById('toneBadge');
    const copyBtn = document.getElementById('copyBtn');
    const newPromptBtn = document.getElementById('newPromptBtn');

    // Character counter
    if (inputPrompt && inputCounter) {
        inputPrompt.addEventListener('input', function() {
            const count = this.value.length;
            inputCounter.textContent = `${count}/500`;
            
            if (count > 500) {
                inputCounter.classList.add('text-red-400');
            } else {
                inputCounter.classList.remove('text-red-400');
            }
        });
    }

    // Form submission
    if (promptForm) {
        promptForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            optimizeBtn.innerHTML = '<span class="loading-spinner mr-2"></span> Optimizing...';
            optimizeBtn.disabled = true;
            
            // Create loading animation
            const loadingTimeline = gsap.timeline();
            loadingTimeline.fromTo('.loading-spinner', 
                { rotation: 0 },
                { rotation: 360, duration: 1, repeat: -1, ease: 'linear' }
            );

            // Simulate API call with timeout
            setTimeout(function() {
                // Get form values
                const inputText = inputPrompt.value;
                const platform = document.getElementById('aiPlatform').value;
                const tone = document.getElementById('toneStyle').value;
                
                // Generate optimized prompt (simulated)
                const optimizedText = generateOptimizedPrompt(inputText, platform, tone);
                
                // Update UI with results
                optimizedPrompt.textContent = optimizedText;
                
                // Update badges
                platformBadge.innerHTML = `<i class="fas fa-robot mr-1"></i> ${getPlatformName(platform)}`;
                toneBadge.innerHTML = `<i class="fas fa-sliders-h mr-1"></i> ${getToneName(tone)}`;
                
                // Show result card with animation
                gsap.set(resultCard, { opacity: 0, y: 20 });
                resultCard.classList.remove('hidden');
                
                gsap.to(resultCard, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'back.out',
                    onComplete: () => {
                        // Scroll to results if not fully visible
                        if (!isElementInViewport(resultCard)) {
                            gsap.to(window, {
                                duration: 0.8,
                                scrollTo: {
                                    y: resultCard,
                                    offsetY: 100
                                },
                                ease: 'power2.inOut'
                            });
                        }
                    }
                });

                // Reset button
                loadingTimeline.kill();
                optimizeBtn.innerHTML = '<i class="fas fa-magic mr-2"></i> Optimize Prompt';
                optimizeBtn.disabled = false;
            }, 1500);
        });
    }

    // Copy to clipboard
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const textToCopy = optimizedPrompt.textContent;
            navigator.clipboard.writeText(textToCopy).then(function() {
                // Change button text temporarily
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
                
                // Add success animation
                gsap.fromTo(copyBtn, 
                    { scale: 1 },
                    { 
                        scale: 1.1, 
                        duration: 0.2, 
                        yoyo: true, 
                        repeat: 1,
                        onComplete: () => {
                            setTimeout(() => {
                                copyBtn.innerHTML = originalText;
                            }, 1000);
                        }
                    }
                );
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // Regenerate prompt
    if (newPromptBtn) {
        newPromptBtn.addEventListener('click', function() {
            // Trigger form submission again
            promptForm.dispatchEvent(new Event('submit'));
            
            // Add click animation
            gsap.fromTo(newPromptBtn, 
                { scale: 1 },
                { 
                    scale: 0.9, 
                    duration: 0.1, 
                    yoyo: true, 
                    repeat: 1 
                }
            );
        });
    }

    // ======================
    // Helper Functions
    // ======================
    function initAnimations() {
        // Hero section animations
        animateHeroSection();

        // Section entrance animations
        animateSections();

        // Feature cards hover animations
        animateFeatureCards();

        // Testimonial cards hover animations
        animateTestimonialCards();

        // Logo grid animations
        animateLogoGrid();
    }

    function animateHeroSection() {
        const heroContent = document.querySelector('.hero-section > .container > div:first-child');
        const heroCard = document.querySelector('.hero-section .glass-card');
        
        if (!prefersReducedMotion) {
            // Content animation
            gsap.from(heroContent.children, {
                opacity: 0,
                y: 30,
                duration: 1,
                stagger: 0.15,
                ease: 'power2.out',
                delay: 0.3
            });

            // Card animation
            gsap.from(heroCard, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'back.out(1.7)',
                delay: 0.6
            });
        }
    }

    function animateSections() {
        // Section headers
        gsap.utils.toArray('section').forEach(section => {
            const heading = section.querySelector('h2');
            const subheading = section.querySelector('span.inline-block');
            const content = section.querySelector('p');

            if (heading) {
                gsap.from(heading, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }

            if (subheading) {
                gsap.from(subheading, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 30,
                    duration: 0.6,
                    ease: 'power2.out',
                    delay: 0.2
                });
            }

            if (content) {
                gsap.from(content, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 30,
                    duration: 0.6,
                    ease: 'power2.out',
                    delay: 0.4
                });
            }
        });

        // Feature items
        gsap.utils.toArray('.feature-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                ease: 'power2.out',
                delay: i * 0.1
            });
        });

        // How it works steps
        gsap.utils.toArray('.how-it-works-step').forEach((step, i) => {
            gsap.from(step, {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: i * 0.15
            });
        });
    }

    function animateFeatureCards() {
        gsap.utils.toArray('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    rotateX: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    rotateX: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    function animateTestimonialCards() {
        gsap.utils.toArray('.testimonial-inner').forEach(testimonial => {
            testimonial.addEventListener('mouseenter', () => {
                gsap.to(testimonial, {
                    rotateY: 5,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
            
            testimonial.addEventListener('mouseleave', () => {
                gsap.to(testimonial, {
                    rotateY: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        });
    }

    function animateLogoGrid() {
        gsap.utils.toArray('.logo-item').forEach((logo, i) => {
            gsap.from(logo, {
                scrollTrigger: {
                    trigger: logo,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 30,
                scale: 0.8,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: i * 0.05
            });
        });
    }

    function generateOptimizedPrompt(input, platform, tone) {
        // This is a simulation - in a real app, this would call an API
        const platformSpecifics = {
            'chatgpt': 'Act as an expert in your field with 10+ years of experience. ',
            'midjourney': 'High-quality digital art, 8K resolution, ultra-detailed, trending on ArtStation, ',
            'dalle': 'A high-quality digital illustration, photorealistic, 4K resolution, detailed, ',
            'stable-diffusion': 'Masterpiece, best quality, highly detailed, ',
            'claude': 'As an experienced professional, provide a comprehensive response that covers all aspects of the topic. ',
            'bard': 'Provide a well-researched, up-to-date response that includes multiple perspectives on the topic. '
        };
        
        const toneSpecifics = {
            'professional': 'Use a professional tone with clear, concise language. ',
            'friendly': 'Use a friendly, approachable tone that builds rapport. ',
            'academic': 'Use an academic tone with precise terminology and citations. ',
            'persuasive': 'Use persuasive language with compelling arguments and evidence. ',
            'creative': 'Use creative, imaginative language with vivid descriptions. ',
            'humorous': 'Use lighthearted, humorous language where appropriate. '
        };
        
        return `${platformSpecifics[platform]}${toneSpecifics[tone]}${input}. Include specific examples, actionable advice, and address potential questions or objections.`;
    }

    function getPlatformName(platform) {
        const names = {
            'chatgpt': 'ChatGPT',
            'midjourney': 'Midjourney',
            'dalle': 'DALL·E',
            'stable-diffusion': 'Stable Diffusion',
            'claude': 'Claude',
            'bard': 'Google Bard'
        };
        return names[platform] || 'AI Platform';
    }

    function getToneName(tone) {
        const names = {
            'professional': 'Professional',
            'friendly': 'Friendly',
            'academic': 'Academic',
            'persuasive': 'Persuasive',
            'creative': 'Creative',
            'humorous': 'Humorous'
        };
        return names[tone] || 'Standard';
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
});
