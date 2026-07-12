const scenes = [
    // Chapter 1
    { text: "Setelah semua keberanian yang pernah aku kumpulkan untuk mengungkapkan perasaan waktu itu, ternyata ada satu hal yang masih belum selesai aku sampaikan.<br><br>Situs ini bukan kubuat untuk mengulang cerita lama. Tapi untuk melanjutkan perjalanan yang pernah kita mulai.", btnText: "Lanjut" },
    // Chapter 2
    { text: "Kejujuran waktu itu rasanya bikin hati jauh lebih tenang. Sekarang udah ga ada lagi perasaan yang perlu aku pendam atau sembunyikan.<br><br>Yang tersisa cuma satu harapan sederhana: pengen tau apakah perjalanan ini bisa kita lanjutkan bersama.", btnText: "Lanjut" },
    // Chapter 3
    { text: "Kalo dipikir-pikir lagi, banyak momen sederhana yang kita lewatin yang bikin kamu kerasa begitu berarti. Hal-hal kecil yang mungkin jarang disadari, kayak nungguin pesan dari kamu, ketawa bareng, saling dengerin cerita, atau cuma ngerasa nyaman karena ada kehadiranmu.<br><br>Semua itu pelan-pelan bikin hari-hariku jadi lebih berwarna.", btnText: "Lanjut" },
    // Chapter 4
    { text: "Kalo ditanya kenapa milih kamu, jawabannya bukan karena kamu sempurna. Tapi karena saat sama kamu, rasanya nyaman, damai, dan aku selalu ngerasa pengen kenal kamu lebih jauh lagi setiap harinya.", btnText: "Lanjut" },
    // Chapter 5
    { text: "Jika suatu hari nanti kita dikasih kesempatan, ada banyak hal sederhana yang pengen aku lakuin bareng kamu.<br><br>Mulai dari sekadar bagi cerita sehabis hari yang panjang dan ngelelahin, jalan santai berdua, merayakan hal-hal kecil, sampai saling nemenin waktu lagi seneng maupun lagi susah.", btnText: "Lanjut" },
    // Chapter 6
    { text: "Semua yang kutulis di sini bukan buat maksa atau ngasih tekanan ke kamu. Apapun jawaban yang bakal kamu kasih nanti, pastinya bakal selalu aku hargai.<br><br>Tujuan asliku cuma satu, yaitu nyampein sebuah pertanyaan yang selama ini udah aku pikirin sungguh-sungguh.", btnText: "Pertanyaan" }
];

let currentScene = 0;

const sceneElement = document.getElementById('scene');
const mainTextElement = document.getElementById('main-text');
const btnTextElement = document.getElementById('btn-text');
const actionBtn = document.getElementById('action-btn');
const background = document.querySelector('.background');

let autoNextTimeout;

function startAutoNext() {
    // Disabled for manual reading pace
}

// Initial Load Animation
document.addEventListener('DOMContentLoaded', () => {
    btnTextElement.textContent = scenes[currentScene].btnText; // Set initial btn text
    // The auto next will start after fullscreen is activated
});

let isTransitioning = false;

actionBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    if (currentScene < scenes.length - 1) {
        nextScene();
    } else {
        dramaticExit();
    }
});

function nextScene() {
    if (isTransitioning) return;
    isTransitioning = true;

    // 1. Transition Out
    sceneElement.classList.add('scene-hidden');

    // Hide current scene images if any
    currentSceneImages.forEach(img => {
        img.style.opacity = '0';
    });

    // 2. Wait for exit animation (approx 600ms)
    setTimeout(() => {
        sceneElement.style.transition = 'none';

        // Update Content
        currentScene++;
        mainTextElement.innerHTML = scenes[currentScene].text;
        btnTextElement.textContent = scenes[currentScene].btnText;

        // Show new scene images
        showSceneImages();

        // Prepare for entrance from bottom
        sceneElement.classList.remove('scene-hidden');
        sceneElement.classList.add('scene-enter');

        // Force reflow
        void sceneElement.offsetWidth;

        // Re-enable transition
        sceneElement.style.transition = '';

        // 3. Transition In
        sceneElement.classList.remove('scene-enter');

        // Allow clicking again after entrance animation starts
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }, 600); // 600ms exit delay
}

function dramaticExit() {
    actionBtn.style.opacity = '0';
    actionBtn.style.pointerEvents = 'none';

    // Fade out dramatically
    sceneElement.classList.add('scene-dramatic-exit');
    background.classList.add('dimmed');

    // After dramatic exit, transition into the final choice scene
    setTimeout(() => {
        sceneElement.style.display = 'none';

        const finalScene = document.getElementById('final-scene');
        finalScene.style.display = 'flex';
        void finalScene.offsetWidth;

        finalScene.classList.remove('scene-hidden');

        const finalTitle = document.getElementById('final-title');
        const finalBadge = document.getElementById('final-badge');
        const cardsContainer = document.getElementById('cards-container');

        // Show the question first
        if (finalBadge) finalBadge.style.opacity = '1';
        if (finalTitle) finalTitle.style.opacity = '1';

        // Show cards slightly after (delay configured in CSS transition via HTML style attribute)
        setTimeout(() => {
            if (cardsContainer) {
                cardsContainer.style.opacity = '1';
                cardsContainer.style.transform = 'translateY(0)';
            }
        }, 5000); // 5 seconds delay to let the question sink in
    }, 2000); // 2s dramatic exit delay
}

// Visual Effects: Fireflies and Butterfly Trails
function initEffects() {
    createFireflies();
    initButterflyTrails();
    preloadChatImages();
}

function createFireflies() {
    const fireflyContainer = document.createElement('div');
    fireflyContainer.className = 'fireflies-container';
    document.querySelector('.background').appendChild(fireflyContainer);

    // Create 40 fireflies
    for (let i = 0; i < 40; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';

        // Randomize starting position
        firefly.style.left = Math.random() * 100 + 'vw';
        firefly.style.top = Math.random() * 100 + 'vh';

        // Randomize animation duration and delay for organic movement
        firefly.style.animationDuration = (Math.random() * 8 + 8) + 's';
        firefly.style.animationDelay = (Math.random() * 10) + 's';

        fireflyContainer.appendChild(firefly);
    }
}

function initButterflyTrails() {
    const butterflies = document.querySelectorAll('.butterfly-container');
    const container = document.createElement('div');
    container.className = 'trails-container';
    document.querySelector('.background').appendChild(container);

    setInterval(() => {
        butterflies.forEach(b => {
            // Random chance to emit particle to make it look organic
            if (Math.random() > 0.4) {
                const inner = b.querySelector('.butterfly');
                const rect = inner.getBoundingClientRect();

                // If the butterfly is completely off screen, don't emit
                if (rect.width === 0 || rect.top < -100 || rect.top > window.innerHeight + 100) return;

                const particle = document.createElement('div');
                particle.className = 'trail-particle';

                // Randomize position slightly around the butterfly body
                const offsetX = (Math.random() - 0.5) * 25;
                const offsetY = (Math.random() - 0.5) * 25;

                particle.style.left = (rect.left + rect.width / 2 + offsetX) + 'px';
                particle.style.top = (rect.top + rect.height / 2 + offsetY) + 'px';

                // Randomize particle size (2px to 5px)
                const size = Math.random() * 3 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';

                container.appendChild(particle);

                // Remove particle after its animation completes
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 1200);
            }
        });
    }, 120); // Emit particles every 120ms
}

// Chat Images Preloading and Spawning
const validChatImages = [];
function preloadChatImages() {
    // Try to load up to 50 images in assets/chats
    for (let i = 1; i <= 50; i++) {
        const img = new Image();
        img.onload = () => validChatImages.push(img.src);
        img.onerror = () => { /* ignore, file doesn't exist */ };
        img.src = `assets/chats/${i}.jpg`;
    }
}

function spawnChatImages() {
    const container = document.getElementById('journey-container');
    if (!container || validChatImages.length === 0) return;

    // Sort images numerically if they are named 1.jpg, 2.jpg, etc.
    const sortedImages = [...validChatImages].sort((a, b) => {
        const numA = parseInt(a.split('/').pop().split('.')[0]) || 0;
        const numB = parseInt(b.split('/').pop().split('.')[0]) || 0;
        return numA - numB;
    });

    container.innerHTML = ''; // Clear just in case

    sortedImages.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'journey-item';

        const img = document.createElement('img');
        img.src = src;
        img.className = 'journey-photo';

        item.appendChild(img);
        container.appendChild(item);

        // Use IntersectionObserver to fade them in as they scroll into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(item);
    });

    // Spawn Pink Fireflies
    const fireflyContainer = document.getElementById('closing-fireflies');
    if (fireflyContainer) {
        fireflyContainer.innerHTML = '';
        for (let i = 0; i < 40; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'pink-firefly';

            const size = Math.random() * 3 + 1;
            firefly.style.width = size + 'px';
            firefly.style.height = size + 'px';

            firefly.style.left = Math.random() * 100 + 'vw';
            firefly.style.top = Math.random() * 100 + 'vh';

            firefly.style.setProperty('--dx', (Math.random() * 100 - 50) + 'px');
            firefly.style.setProperty('--dy', (Math.random() * 100 - 50) + 'px');

            firefly.style.animationDuration = (Math.random() * 10 + 5) + 's';
            firefly.style.animationDelay = (Math.random() * 5) + 's';

            fireflyContainer.appendChild(firefly);
        }
    }
}

let currentSceneImages = [];

function showSceneImages() {
    const container = document.getElementById('scene-images-container');
    if (!container || validChatImages.length === 0) return;

    // Fade out and remove old images
    currentSceneImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = img.dataset.endTransform; // Continue movement
        setTimeout(() => img.remove(), 1500);
    });
    currentSceneImages = [];

    // Pick 1 to 3 random images
    const numImages = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numImages; i++) {
        const img = document.createElement('img');
        img.src = validChatImages[Math.floor(Math.random() * validChatImages.length)];
        img.className = 'scene-image';

        const size = Math.random() * 250 + 200; // 200px to 450px
        const posX = Math.random() * 80 + 10; // 10% to 90%
        const posY = Math.random() * 80 + 10;

        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.left = `calc(${posX}vw - ${size / 2}px)`;
        img.style.top = `calc(${posY}vh - ${size / 2}px)`;

        const startRot = Math.random() * 60 - 30;
        const endRot = startRot + (Math.random() * 40 - 20);
        const endPosX = (Math.random() * 80 - 40);
        const endPosY = (Math.random() * 80 - 40);

        img.style.transform = `rotate(${startRot}deg) scale(0.9)`;
        img.dataset.endTransform = `translate(${endPosX}px, ${endPosY}px) rotate(${endRot}deg) scale(1.1)`;

        container.appendChild(img);
        currentSceneImages.push(img);

        // Slight delay to allow DOM to register the initial transform before transitioning
        setTimeout(() => {
            img.style.opacity = (Math.random() * 0.15 + 0.1).toString(); // Opacity 0.1 to 0.25 for readability
            img.style.transform = img.dataset.endTransform;
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', initEffects);

function createSoftParticles() {
    const container = document.createElement('div');
    container.className = 'soft-particles';
    document.querySelector('.background').appendChild(container);

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'soft-particle';

        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        particle.style.left = Math.random() * 100 + 'vw';

        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        particle.style.animationDelay = (Math.random() * 2) + 's';

        container.appendChild(particle);
    }
}

// Final Scene Logic
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1522443063325102110/TH-IYWhZaQf83GMGVZwZcoTi36FIclXSp2wApyVTwbAQOD-ZvqlydgizmI9_Nel9JJmH';

function sendToDiscord(action, message = null) {
    const embed = {
        title: "✨ Pembaruan dari Project Asya",
        description: "Seseorang baru saja berinteraksi dengan halaman penutup.",
        color: 16747136, // Salmon / Pink color matching the theme
        fields: [
            {
                name: "Aksi yang dilakukan",
                value: action,
                inline: false
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: "Project Asya Notifier"
        }
    };

    if (message) {
        embed.fields.push({
            name: "Isi Balasan",
            value: `> ${message.replace(/\n/g, '\n> ')}`,
            inline: false
        });
    }

    const payload = {
        username: "Asya's Letter",
        embeds: [embed]
    };

    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(err => console.error("Gagal mengirim webhook:", err));
}

document.addEventListener('DOMContentLoaded', () => {
    const cardYes = document.getElementById('card-yes');
    const cardThink = document.getElementById('card-think');
    const cardsContainer = document.getElementById('cards-container');
    const finalParagraph = document.getElementById('final-paragraph');
    const confirmTimeContainer = document.getElementById('confirm-time-container');
    const finishBtn = document.getElementById('finish-btn');
    const finalTitle = document.getElementById('final-title');
    const finalBadgeText = document.getElementById('final-badge-text');

    if (cardYes) {
        cardYes.addEventListener('click', () => {
            sendToDiscord('🤍 Memilih opsi "Iya, aku mau"');

            cardsContainer.style.opacity = '0';
            cardsContainer.style.filter = 'blur(8px)';
            cardsContainer.style.transform = 'translateY(20px)';
            cardsContainer.style.pointerEvents = 'none';

            // Warm animation
            const glow1 = document.querySelector('.glow-1');
            const glow2 = document.querySelector('.glow-2');
            if (glow1) {
                glow1.classList.add('glow-bright');
                glow1.style.background = 'radial-gradient(circle at 30% 30%, rgba(255, 182, 193, 0.4) 0%, transparent 60%)';
            }
            if (glow2) {
                glow2.classList.add('glow-bright');
                glow2.style.background = 'radial-gradient(circle at 70% 70%, rgba(255, 138, 128, 0.3) 0%, transparent 60%)';
            }
            background.classList.remove('dimmed'); // Make it brighter
            createSoftParticles(); // Add more particles

            setTimeout(() => {
                cardsContainer.style.display = 'none';
                cardsContainer.style.filter = 'none';

                finalTitle.style.opacity = '0';
                finalBadgeText.style.opacity = '0';

                setTimeout(() => {
                    finalBadgeText.textContent = "Terima Kasih";
                    finalTitle.textContent = "kita mulai halaman baru bersama yaa.";
                    finalParagraph.textContent = "Terima kasih sudah memilih untuk memulai perjalanan ini denganku. Aku janji bakal terus berusaha jadi orang yang pantas buat kamu setiap hari.";

                    finalBadgeText.style.opacity = '1';
                    finalTitle.style.opacity = '1';

                    confirmTimeContainer.style.display = 'flex';
                    void confirmTimeContainer.offsetWidth;
                    confirmTimeContainer.style.opacity = '1';
                }, 1000);
            }, 800);
        });
    }

    if (cardThink) {
        cardThink.addEventListener('click', () => {
            sendToDiscord('🌷 Memilih opsi "Boleh aku memikirkannya dulu?');

            cardsContainer.style.opacity = '0';
            cardsContainer.style.filter = 'blur(10px)';
            cardsContainer.style.transform = 'translateY(20px)';
            cardsContainer.style.pointerEvents = 'none';

            setTimeout(() => {
                cardsContainer.style.display = 'none';
                cardsContainer.style.filter = 'none';

                finalTitle.style.opacity = '0';
                finalBadgeText.style.opacity = '0';

                setTimeout(() => {
                    finalBadgeText.textContent = "Tidak Apa-Apa";
                    finalTitle.textContent = "Luangkan waktumu.";
                    finalParagraph.textContent = "Keputusan yang baik memang layak buat dipikirkan. Aku ga buru-buru kok, dan ga ada tekanan sama sekali. Kapanpun kamu ngerasa udah siap kasih jawaban, aku selalu di sini buat dengerin.";

                    finalBadgeText.style.opacity = '1';
                    finalTitle.style.opacity = '1';

                    confirmTimeContainer.style.display = 'flex';
                    void confirmTimeContainer.offsetWidth;
                    confirmTimeContainer.style.opacity = '1';
                }, 1000);
            }, 800);
        });
    }

    if (finishBtn) {
        finishBtn.addEventListener('click', () => {
            const finalScene = document.getElementById('final-scene');
            finalScene.classList.add('scene-hidden');

            setTimeout(() => {
                finalScene.style.display = 'none';

                const closingScene = document.getElementById('closing-scene');
                if (closingScene) {
                    closingScene.style.display = 'flex';
                    void closingScene.offsetWidth;
                    closingScene.style.opacity = '1';
                }
            }, 1000);
        });
    }
});



// --- Konfigurasi Teks Bab Baru (Closing Scene) ---
// Tambahkan teks tambahan di dalam array ini (pisahkan dengan koma).
// Setiap baris teks akan otomatis dijadikan paragraf dan dapat discroll.
const closingTextConfig = [
    "Dan sebelum perjalanan ini benar-benar berakhir, izinkan aku mengajukan satu pertanyaan yang selama ini menjadi alasan mengapa seluruh website ini dibuat...",
    "Kalau suatu hari nanti kamu bertanya mengapa aku memilihmu, mungkin aku tidak akan langsung menemukan jawaban yang paling sempurna.",
    "Bukan karena aku tidak tahu alasannya.",
    "Justru karena alasannya terlalu banyak untuk diringkas menjadi satu kalimat.",
    "Aku memilihmu bukan karena kamu selalu berhasil membuat segalanya menjadi sempurna.",
    "Aku memilihmu karena di dekatmu, aku tidak pernah merasa harus menjadi orang lain.",
    "Aku bisa tertawa tanpa berpura-pura.",
    "Aku bisa bercerita tanpa takut dihakimi.",
    "Aku bisa diam tanpa merasa suasana menjadi canggung.",
    "Dan tanpa aku sadari, semua kenyamanan itu perlahan berubah menjadi rumah.",
    "Aku tidak pernah berharap kita akan memiliki hubungan yang sempurna.",
    "Aku hanya berharap, jika suatu hari nanti kita benar-benar berjalan bersama, kita bisa menjadi tempat pulang satu sama lain setelah hari yang melelahkan.",
    "Aku ingin menjadi orang pertama yang ikut bahagia ketika kamu mendapatkan kabar baik.",
    "Dan aku juga ingin menjadi orang yang tetap berada di sampingmu ketika hidup sedang terasa berat.",
    "Aku ingin merayakan hal-hal kecil bersamamu.",
    "Merayakan pencapaian sederhana.",
    "Merayakan tawa yang mungkin tidak dimengerti orang lain.",
    "Merayakan hari-hari biasa yang menjadi luar biasa hanya karena kita menjalaninya bersama.",
    "Mungkin terdengar sederhana.",
    "Namun bagiku, kebahagiaan memang selalu dimulai dari hal-hal sederhana.",
    "Aku tidak tahu bagaimana masa depan akan memperlakukan kita.",
    "Mungkin akan ada hari ketika kita tertawa sampai lupa waktu.",
    "Mungkin akan ada hari ketika kita saling diam karena sama-sama lelah.",
    "Mungkin akan ada hari ketika kita harus belajar memahami satu sama lain lebih dari sebelumnya.",
    "Dan jika hari-hari itu benar-benar datang...",
    "Aku berharap kita tidak memilih untuk saling menjauh.",
    "Aku berharap kita memilih untuk saling mendekat.",
    "Karena menurutku, hubungan yang indah bukanlah hubungan yang tidak pernah memiliki masalah.",
    "Melainkan hubungan yang membuat dua orang tetap memilih satu sama lain, bahkan ketika keadaan sedang tidak mudah.",
    "Hari ini aku tidak datang membawa janji bahwa semuanya akan selalu bahagia.",
    "Aku hanya datang membawa satu niat yang sederhana.",
    "Jika kamu bersedia...",
    "Aku ingin belajar mencintaimu dengan cara yang membuatmu merasa dihargai, didengarkan, dan dipilih setiap hari.",
    "Bukan hanya hari ini.",
    "Tetapi selama kita sama-sama masih ingin melangkah ke arah yang sama."
];

function initClosingText() {
    const container = document.getElementById('closing-text-container');
    if (!container) return;
    container.innerHTML = '';

    closingTextConfig.forEach(text => {
        const p = document.createElement('p');
        p.className = 'closing-paragraph';
        p.innerHTML = text;
        container.appendChild(p);
    });

    // Add finish button at the end of the text
    const finishBtn = document.createElement('button');
    finishBtn.className = 'action-btn premium-btn';
    finishBtn.style.marginTop = '3rem';
    finishBtn.style.marginBottom = '5rem'; // Padding bottom for scrolling
    finishBtn.innerHTML = `Selesai <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`;

    finishBtn.addEventListener('click', () => {
        showHeartScene();
    });

    container.appendChild(finishBtn);
}

function showHeartScene() {
    const closingScene = document.getElementById('closing-scene');
    const heartScene = document.getElementById('heart-scene');
    if (!closingScene || !heartScene) return;

    // Fade out closing scene
    closingScene.style.opacity = '0';

    setTimeout(() => {
        closingScene.style.display = 'none';

        // Show heart scene
        heartScene.style.display = 'flex';
        // Force reflow
        void heartScene.offsetWidth;
        heartScene.style.opacity = '1';

        // Trigger animations inside heart scene
        const heartMask = heartScene.querySelector('.heart-text-mask');
        const ilyText = heartScene.querySelector('.ily-text');

        if (heartMask) heartMask.style.animation = 'fadeInUp 2s ease forwards 0.5s';
        if (ilyText) ilyText.style.animation = 'fadeIn 3s ease forwards 2.5s';

    }, 1000);
}

// --- Music Player & Sync Lyrics ---
const lyricsData = [
    { time: 14.09, text: "Tak sekadar kutemukan" },
    { time: 18.35, text: "Temukan wanita rupawan yang sadarkan" },
    { time: 23.94, text: "Dia seorang, tiada lain tiada bukan" },
    { time: 29.26, text: "Hanya dia" },

    { time: 38.54, text: "Dia buatku nyaman" },
    { time: 44.40, text: "Dalam hangat pelukan" },
    { time: 48.36, text: "Dia perasa yang mengerti yang kurasa" },
    { time: 53.70, text: "Hanya dia" },

    { time: 60.85, text: "'Kan kuarungi tujuh laut samudra" },
    { time: 66.96, text: "'Kan kudaki Pegunungan Himalaya" },
    { time: 73.09, text: "Apa pun 'kan kulakukan 'tuk dirimu, Sayang" },
    { time: 78.14, text: "Oh, penjaga hatiku" },

    { time: 93.54, text: "Kau dan aku sempurna" },
    { time: 98.34, text: "Semoga ada cara 'tuk terus bersama" },
    { time: 102.84, text: "Selalu kutunggu, tak mau berlalu" },
    { time: 108.95, text: "Kau dan aku" },

    { time: 116.12, text: "'Kan kuarungi tujuh laut samudra" },
    { time: 122.23, text: "'Kan kudaki Pegunungan Himalaya" },
    { time: 128.34, text: "Apa pun 'kan kulakukan 'tuk dirimu, Sayang" },
    { time: 133.66, text: "Oh, penjaga hatiku, hu-oh-oh" },

    { time: 165.56, text: "'Kan kuarungi tujuh laut samudra" },
    { time: 171.66, text: "'Kan kudaki Pegunungan Himalaya" },
    { time: 177.77, text: "Apa pun 'kan kulakukan 'tuk dirimu, Sayang" },
    { time: 182.81, text: "Oh, penjaga hatiku, hu-oh-oh" },

    { time: 190.00, text: "Karena bersamamu semua terasa indah (terasa indah)" },
    { time: 196.36, text: "Gundah gulana hatiku telah hancur sirna (gulana hatiku telah sirna)" },
    { time: 202.47, text: "Janjiku takkan kulepas, wahai kau, bidadariku dari surga" },
    { time: 210.69, text: "'Tuk selamanya" },
    { time: 216.81, text: "'Tuk selamanya" },
    { time: 223.19, text: "'Tuk selamanya" }
];

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

function initMusicPlayer() {
    const audio = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-pause-btn');
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    const recordDisk = document.getElementById('record-disk');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const lyricsContainer = document.getElementById('lyrics-container');
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    const toggleLeftBtn = document.getElementById('toggle-left-btn');
    const toggleRightBtn = document.getElementById('toggle-right-btn');

    if (!audio || !playBtn) return; // Guard in case elements don't exist

    let isPlaying = false;
    let currentLyricIndex = -1;

    // Panel Toggles
    if (toggleLeftBtn) {
        toggleLeftBtn.addEventListener('click', () => {
            leftPanel.classList.toggle('hidden');
            toggleLeftBtn.innerHTML = leftPanel.classList.contains('hidden') ? '&gt;' : '&lt;';
        });
    }

    if (toggleRightBtn) {
        toggleRightBtn.addEventListener('click', () => {
            rightPanel.classList.toggle('hidden');
            toggleRightBtn.innerHTML = rightPanel.classList.contains('hidden') ? '&lt;' : '&gt;';
        });
    }

    // Render Lyrics
    lyricsData.forEach((lyric, index) => {
        const line = document.createElement('div');
        line.className = 'lyric-line';
        line.innerHTML = lyric.text.replace(/\n/g, '<br>');
        line.dataset.index = index;
        line.addEventListener('click', () => {
            audio.currentTime = lyric.time;
            if (!isPlaying) togglePlay();
        });
        lyricsContainer.appendChild(line);
    });

    const lyricElements = document.querySelectorAll('.lyric-line');

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            recordDisk.classList.remove('playing');
        } else {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            recordDisk.classList.add('playing');
        }
        isPlaying = !isPlaying;
    }

    playBtn.addEventListener('click', togglePlay);

    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        // Update Progress
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);

        // Sync Lyrics
        let activeIndex = -1;
        for (let i = 0; i < lyricsData.length; i++) {
            if (audio.currentTime >= lyricsData[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }

        if (activeIndex !== currentLyricIndex && activeIndex !== -1) {
            // Remove previous active
            if (currentLyricIndex !== -1 && lyricElements[currentLyricIndex]) {
                lyricElements[currentLyricIndex].classList.remove('active');
            }
            // Add new active
            currentLyricIndex = activeIndex;
            const activeLine = lyricElements[currentLyricIndex];
            activeLine.classList.add('active');

            // Scroll to center
            // Since .lyrics-container has top: 50%, we just need to shift it up 
            // by the active line's center position relative to the container.
            const offset = activeLine.offsetTop + (activeLine.offsetHeight / 2);
            lyricsContainer.style.transform = `translateY(-${offset}px)`;
        }
    });

    // Seek functionality
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pos * audio.duration;
    });

    // If audio ends, reset UI
    audio.addEventListener('ended', () => {
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        recordDisk.classList.remove('playing');
        progressBar.style.width = '0%';
        audio.currentTime = 0;
        lyricsContainer.style.transform = `translateY(0px)`;
        if (currentLyricIndex !== -1 && lyricElements[currentLyricIndex]) {
            lyricElements[currentLyricIndex].classList.remove('active');
        }
        currentLyricIndex = -1;
    });
}

// Call initMusicPlayer after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initClosingText();
    initMusicPlayer();

    // --- Fullscreen Logic ---
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const enterFullscreenBtn = document.getElementById('enter-fullscreen-btn');

    function checkFullscreen() {
        if (!document.fullscreenElement) {
            fullscreenOverlay.classList.remove('hidden');
        } else {
            fullscreenOverlay.classList.add('hidden');
        }
    }

    if (enterFullscreenBtn) {
        enterFullscreenBtn.addEventListener('click', () => {
            // Hide the overlay immediately so user can proceed even if fullscreen fails
            fullscreenOverlay.classList.add('hidden');

            const startExperience = () => {
                // Attempt to play music and start reading 2 seconds after entering
                const audio = document.getElementById('bg-music');
                const playBtn = document.getElementById('play-pause-btn');

                setTimeout(() => {
                    // Start text reading
                    sceneElement.classList.remove('scene-enter');
                    startAutoNext();

                    // Show first batch of abstract images
                    showSceneImages();

                    // Start music
                    if (audio && audio.paused) {
                        audio.currentTime = 0; // Start at 00:00
                        playBtn.click(); // Trigger play toggle
                    }
                }, 2000);
            };

            try {
                if (document.documentElement.requestFullscreen) {
                    const promise = document.documentElement.requestFullscreen();
                    if (promise && promise.then) {
                        promise.then(startExperience).catch(err => {
                            console.log(`Error attempting to enable fullscreen: ${err.message}`);
                            startExperience(); // Fallback start
                        });
                    } else {
                        startExperience();
                    }
                } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
                    document.documentElement.webkitRequestFullscreen();
                    startExperience();
                } else {
                    startExperience();
                }
            } catch (err) {
                console.log(`Sync error attempting to enable fullscreen: ${err.message}`);
                startExperience();
            }
        });
    }

    document.addEventListener('fullscreenchange', checkFullscreen);
});
