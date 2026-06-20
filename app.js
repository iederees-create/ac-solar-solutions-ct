// app.js - Main interactive logic for Photon Flux Energy

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Progress Bar & Nav styling
    const progressBar = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        // Progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';

        // Nav background
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu?.classList.toggle('hidden');
        mobileMenu?.classList.toggle('flex');
        document.body.style.overflow = mobileMenu?.classList.contains('hidden') ? '' : 'hidden';
    }

    mobileMenuBtn?.addEventListener('click', toggleMenu);
    closeMenuBtn?.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Number Counter Animation (for Stats)
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const start = 0;
                let startTime = null;

                const isFloat = target % 1 !== 0;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    // Easing out function
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    
                    const currentVal = easeProgress * target;
                    
                    entry.target.innerText = isFloat ? currentVal.toFixed(1) : Math.floor(currentVal);

                    if (progress < 1) {
                        requestAnimationFrame(animation);
                    } else {
                        entry.target.innerText = target;
                    }
                }
                
                requestAnimationFrame(animation);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // 5. 3D Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    // Respect user motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                card.style.transition = 'none';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                card.style.transition = 'transform 0.5s ease';
            });
        });
    }

    // 6. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const btn = item.querySelector('button');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');

        btn.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-content').classList.remove('active');
                    otherItem.querySelector('.faq-icon').classList.remove('active');
                }
            });

            const isActive = content.classList.contains('active');
            if (isActive) {
                content.classList.remove('active');
                icon.classList.remove('active');
            } else {
                content.classList.add('active');
                icon.classList.add('active');
            }
        });
    });

    // 7. Interactive Solar Calculator Logic
    const billSlider = document.getElementById('bill-slider');
    const hoursSlider = document.getElementById('hours-slider');
    
    if (billSlider && hoursSlider) {
        const billDisplay = document.getElementById('bill-display');
        const hoursDisplay = document.getElementById('hours-display');
        const invSize = document.getElementById('inv-size');
        const panelCount = document.getElementById('panel-count');
        const battSize = document.getElementById('batt-size');
        const savingsDisplay = document.getElementById('savings-display');
        const calcPlatform = document.getElementById('calc-platform');
        
        function updateCalculator() {
            const bill = parseInt(billSlider.value);
            const hours = parseInt(hoursSlider.value);
            
            // Format Bill Display
            billDisplay.innerText = `R ${bill.toLocaleString()}`;
            
            // Format Hours Display
            const stageText = hours === 1 ? "Stage 1-2 (2 hrs)" : 
                              hours === 2 ? "Stage 3-4 (4 hrs)" : 
                              hours === 3 ? "Stage 5-6 (6 hrs)" : "Off-Grid (8+ hrs)";
            hoursDisplay.innerText = stageText;

            // Algorithm for specs
            let inverter = 5; // Base 5kW
            let panels = 6;   // Base 6 panels
            let battery = 5;  // Base 5kWh

            if (bill > 2000) { panels = 8; }
            if (bill > 4000) { inverter = 8; panels = 12; battery = 10; }
            if (bill > 7000) { inverter = 12; panels = 18; battery = 15; }

            // Adjust for loadshedding needs
            if (hours >= 3 && battery < 10) battery = 10;
            if (hours === 4 && battery < 15) { battery = 15; inverter = Math.max(inverter, 8); }

            // Math for savings
            const estSavings = Math.floor(bill * 0.7);

            // Update UI Text
            invSize.innerText = `${inverter}kW`;
            panelCount.innerText = panels;
            battSize.innerText = `${battery}kWh`;
            savingsDisplay.innerText = `R ${estSavings.toLocaleString()}`;

            // Update 3D Platform Transform
            // Make the 3D platform tilt slightly based on the sliders to feel responsive
            const rotX = 15 + (hours * 2); 
            const rotY = -20 + (bill / 500);
            calcPlatform.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }

        billSlider.addEventListener('input', updateCalculator);
        hoursSlider.addEventListener('input', updateCalculator);
        
        // Initial setup
        updateCalculator();
    }

    // 8. Nova AI Chat Assistant Logic
    const chatContainer = document.getElementById('nova-chat-container');
    const chatTrigger = document.getElementById('nova-chat-trigger');
    const chatPanel = document.getElementById('nova-chat-panel');
    const chatClose = document.getElementById('nova-chat-close');
    const messagesArea = document.getElementById('nova-chat-messages');
    const inputArea = document.getElementById('nova-input-area');
    const typingIndicator = document.getElementById('nova-typing');
    const progressBar = document.getElementById('nova-progress');

    if (chatTrigger) {
        let isOpen = false;
        let currentStep = 0;
        let answers = {};
        
        const FLOW = [
            {
                id: 'intro',
                bot: ["Hi there! I'm Nova, Photon Flux's AI Assistant. \uD83D\uDC4B", "I can help generate a custom solar quote for you right now.", "To start, what's your name?"],
                type: 'text',
                placeholder: 'Type your name...'
            },
            {
                id: 'suburb',
                bot: ["Nice to meet you, {name}! \uD83C\uDF1F", "Which Cape Town suburb are you located in? (e.g., Parow, Durbanville, CBD)"],
                type: 'text',
                placeholder: 'Enter your suburb...'
            },
            {
                id: 'propertyType',
                bot: ["Great.", "Is this for a residential home or a commercial business?"],
                type: 'options',
                options: ['Residential Home', 'Commercial Business']
            },
            {
                id: 'bill',
                bot: ["Got it.", "Roughly, what is your average monthly electricity bill?"],
                type: 'options',
                options: ['Under R1,500', 'R1,500 - R3,000', 'R3,000 - R5,000', 'Over R5,000']
            },
            {
                id: 'goal',
                bot: ["Thanks! What is your main goal for going solar?"],
                type: 'options',
                options: ['Beat Loadshedding', 'Save on Electricity Bill', 'Both!']
            },
            {
                id: 'roof',
                bot: ["Awesome.", "Do you know what type of roof you have?"],
                type: 'options',
                options: ['Tile Roof', 'Corrugated Iron / Tin', 'Flat Roof', 'Not sure']
            },
            {
                id: 'phase',
                bot: ["Almost done! \u26A1", "Is your electricity supply Single-Phase or Three-Phase? (Most homes are single, large houses/businesses are three)."],
                type: 'options',
                options: ['Single-Phase', 'Three-Phase', 'Not sure']
            },
            {
                id: 'timeline',
                bot: ["When are you looking to have the system installed?"],
                type: 'options',
                options: ['As soon as possible', 'Within 1-3 months', 'Just researching for now']
            },
            {
                id: 'email',
                bot: ["Perfect. Could I get your email address so we can send the formal quote breakdown?"],
                type: 'text',
                placeholder: 'Enter your email...'
            },
            {
                id: 'whatsapp',
                bot: ["And finally, what's the best WhatsApp number to reach you on?"],
                type: 'text',
                placeholder: 'Enter your phone number...'
            }
        ];

        function toggleChat() {
            isOpen = !isOpen;
            if (isOpen) {
                chatPanel.classList.remove('scale-0', 'opacity-0');
                chatPanel.classList.add('scale-100', 'opacity-100');
                chatTrigger.classList.add('scale-0', 'opacity-0');
                if (currentStep === 0 && messagesArea.innerHTML.trim() === '') {
                    startFlow();
                }
            } else {
                chatPanel.classList.add('scale-0', 'opacity-0');
                chatPanel.classList.remove('scale-100', 'opacity-100');
                chatTrigger.classList.remove('scale-0', 'opacity-0');
            }
        }

        chatTrigger.addEventListener('click', toggleChat);
        chatClose.addEventListener('click', toggleChat);

        function scrollToBottom() {
            setTimeout(() => {
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }, 50);
        }

        function renderUserMessage(text) {
            const div = document.createElement('div');
            div.className = 'flex justify-end';
            div.innerHTML = `<div class="chat-bubble chat-bubble-user">${text}</div>`;
            messagesArea.appendChild(div);
            scrollToBottom();
        }

        function renderBotMessage(text) {
            const div = document.createElement('div');
            div.className = 'flex justify-start';
            // Replace variables
            let processedText = text;
            if (answers['intro']) {
                processedText = processedText.replace('{name}', answers['intro']);
            }
            div.innerHTML = `<div class="chat-bubble chat-bubble-bot">${processedText}</div>`;
            messagesArea.appendChild(div);
            scrollToBottom();
        }

        async function playBotMessages(messages) {
            inputArea.innerHTML = ''; // Clear input while typing
            typingIndicator.classList.remove('hidden');
            scrollToBottom();

            for (let i = 0; i < messages.length; i++) {
                // Fake typing delay based on message length
                const delay = Math.max(800, messages[i].length * 30);
                await new Promise(r => setTimeout(r, delay));
                
                if (i === messages.length - 1) {
                    typingIndicator.classList.add('hidden');
                }
                
                renderBotMessage(messages[i]);
            }
        }

        async function processStep() {
            const step = FLOW[currentStep];
            
            // Update Progress Bar
            const progressPct = ((currentStep) / FLOW.length) * 100;
            progressBar.style.width = `${progressPct}%`;

            await playBotMessages(step.bot);

            // Render Input
            if (step.type === 'text') {
                inputArea.innerHTML = `
                    <form id="nova-form" class="flex gap-2">
                        <input type="text" id="nova-input" class="chat-input" placeholder="${step.placeholder}" required autocomplete="off">
                        <button type="submit" class="bg-accent text-black p-2 rounded-lg hover:bg-accent-light transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </form>
                `;
                document.getElementById('nova-input').focus();
                
                document.getElementById('nova-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const val = document.getElementById('nova-input').value.trim();
                    if (val) handleAnswer(step.id, val);
                });
            } else if (step.type === 'options') {
                const optsHTML = step.options.map(opt => 
                    `<button class="chat-option-btn" data-val="${opt}">${opt}</button>`
                ).join('');
                
                inputArea.innerHTML = `<div>${optsHTML}</div>`;
                
                const btns = inputArea.querySelectorAll('.chat-option-btn');
                btns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        handleAnswer(step.id, btn.getAttribute('data-val'));
                    });
                });
            }
            scrollToBottom();
        }

        function handleAnswer(stepId, value) {
            answers[stepId] = value;
            renderUserMessage(value);
            
            currentStep++;
            if (currentStep < FLOW.length) {
                processStep();
            } else {
                finishFlow();
            }
        }

        async function finishFlow() {
            progressBar.style.width = '100%';
            inputArea.innerHTML = '';
            typingIndicator.classList.remove('hidden');
            scrollToBottom();
            
            await new Promise(r => setTimeout(r, 1500));
            typingIndicator.classList.add('hidden');
            
            renderBotMessage("All done! \uD83C\uDF89 I'm sending your brief to our lead engineer right now.");
            renderBotMessage("Click the button below to connect with us on WhatsApp and receive your quote.");

            // Build WhatsApp Message
            const waPhone = "27629494708";
            const text = `*New Solar Quote Request (Node-59)*\n\n` +
                `*Name:* ${answers.intro}\n` +
                `*Location:* ${answers.suburb}\n` +
                `*Type:* ${answers.propertyType}\n` +
                `*Bill:* ${answers.bill}\n` +
                `*Goal:* ${answers.goal}\n` +
                `*Roof:* ${answers.roof}\n` +
                `*Phase:* ${answers.phase}\n` +
                `*Timeline:* ${answers.timeline}\n` +
                `*Email:* ${answers.email}\n` +
                `*Phone:* ${answers.whatsapp}\n\n` +
                `_Generated via Nova AI Assistant_`;

            const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;

            inputArea.innerHTML = `
                <a href="${waLink}" target="_blank" class="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.104 1.517 5.829L.057 23.571a.5.5 0 0 0 .637.612l5.9-1.545A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.371l-.36-.214-3.732.978.996-3.647-.235-.374A9.861 9.861 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1c5.466 0 9.9 4.433 9.9 9.9 0 5.467-4.434 9.9-9.9 9.9z"/></svg>
                    Send to WhatsApp
                </a>
            `;
            scrollToBottom();
        }

        function startFlow() {
            currentStep = 0;
            answers = {};
            messagesArea.innerHTML = '';
            processStep();
        }
    }

});
