// ===== DOM Elements =====
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-list a');
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const langButtons = document.querySelectorAll('.lang-btn');

// ===== Language Toggle =====
let currentLang = 'en'; // Default language is English

// Check for saved language preference
const savedLang = localStorage.getItem('altawos-lang');
if (savedLang) {
    currentLang = savedLang;
}

// Apply the language on page load (default: English)
applyLanguage(currentLang);

function applyLanguage(lang) {
    const html = document.documentElement;
    
    if (lang === 'en') {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        document.body.classList.add('lang-en');
        document.body.classList.remove('lang-ar');
    } else {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        document.body.classList.add('lang-ar');
        document.body.classList.remove('lang-en');
    }
    
    // Update language buttons
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update all text elements with data-ar and data-en attributes
    const elementsWithLang = document.querySelectorAll('[data-ar][data-en]');
    elementsWithLang.forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    
    // Update HTML direction-specific elements
    const textElements = document.querySelectorAll('[data-ar], [data-en]');
    textElements.forEach(el => {
        const arText = el.getAttribute('data-ar');
        const enText = el.getAttribute('data-en');
        if (arText && enText) {
            el.textContent = lang === 'ar' ? arText : enText;
        }
    });
    
    // Update placeholders
    const nameLabel = document.querySelector('label[for="name"]');
    const emailLabel = document.querySelector('label[for="email"]');
    const subjectLabel = document.querySelector('label[for="subject"]');
    const messageLabel = document.querySelector('label[for="message"]');
    
    if (nameLabel) nameLabel.textContent = lang === 'ar' ? 'الاسم' : 'Name';
    if (emailLabel) emailLabel.textContent = lang === 'ar' ? 'البريد الإلكتروني' : 'Email';
    if (subjectLabel) subjectLabel.textContent = lang === 'ar' ? 'الموضوع' : 'Subject';
    if (messageLabel) messageLabel.textContent = lang === 'ar' ? 'الرسالة' : 'Message';
    
    // Update form placeholders
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    if (nameInput) nameInput.placeholder = lang === 'ar' ? 'أدخل اسمك' : 'Enter your name';
    if (emailInput) emailInput.placeholder = lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email';
    if (subjectInput) subjectInput.placeholder = lang === 'ar' ? 'أدخل الموضوع' : 'Enter subject';
    if (messageInput) messageInput.placeholder = lang === 'ar' ? 'أدخل رسالتك' : 'Enter your message';
    
    // Update page title
    document.title = lang === 'ar' ? 'ALTAWOS LTD | شركة الطاووس' : 'ALTAWOS LTD | Peacock Company';
    
    // Save preference
    localStorage.setItem('altawos-lang', lang);
    currentLang = lang;
}

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        applyLanguage(lang);
    });
});

// ===== Mobile Menu Toggle =====
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
    }
});

// ===== Header Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===== Smooth Scroll for Navigation Links =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// ===== Active Navigation on Scroll =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    const headerHeight = header.offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Contact Form Submission =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate form data
    if (!data.name || !data.email || !data.subject || !data.message) {
        showToast(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showToast(currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = `<span>${currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</span>`;
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Show success message
        showToast(
            currentLang === 'ar' 
                ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً' 
                : 'Your message has been sent successfully! We will contact you soon.',
            'success'
        );
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toastMessage = toast.querySelector('.toast-message');
    const toastContent = toast.querySelector('.toast-content');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Update icon based on type
    if (type === 'error') {
        toastContent.style.background = '#ef4444';
        toastIcon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
    } else {
        toastContent.style.background = '#10b981';
        toastIcon.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .policy-box, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .service-card.animate,
    .policy-box.animate,
    .stat-item.animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== Parallax Effect on Hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// ===== Back to Top Button =====
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="19" x2="12" y2="5"/>
        <polyline points="5 12 12 5 19 12"/>
    </svg>
`;
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    ${currentLang === 'ar' ? 'right' : 'left'}: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 5px 20px rgba(233, 69, 96, 0.4);
`;

backToTopBtn.querySelector('svg').style.cssText = `
    width: 24px;
    height: 24px;
    stroke: #fff;
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'translateY(-5px)';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'translateY(0)';
});

// Update back to top button position when language changes
function updateBackToTopPosition() {
    backToTopBtn.style.right = currentLang === 'ar' ? '30px' : 'auto';
    backToTopBtn.style.left = currentLang === 'ar' ? 'auto' : '30px';
}

// ===== Add mobile language toggle to nav =====
const mobileLangToggle = document.createElement('div');
mobileLangToggle.className = 'mobile-lang-toggle';
mobileLangToggle.innerHTML = `
    <button class="mobile-lang-btn ${currentLang === 'ar' ? 'active' : ''}" data-lang="ar">عربي</button>
    <button class="mobile-lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">English</button>
`;

navList.appendChild(mobileLangToggle);

// Mobile language buttons
const mobileLangBtns = document.querySelectorAll('.mobile-lang-btn');
mobileLangBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        applyLanguage(lang);
        mobileLangBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateBackToTopPosition();
    });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial check for active nav
    updateActiveNav();
    
    // Add loaded class for animations
    document.body.classList.add('loaded');
    
    // Apply initial language
    applyLanguage(currentLang);
});

// Listen for language changes
langButtons.forEach(btn => {
    btn.addEventListener('click', updateBackToTopPosition);
});
