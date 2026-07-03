const scenes = [
    { text: "Ada sesuatu yang telah menunggu lama.", btnText: "Lewati" },
    { text: "Bukan aku tidak ingin mengatakannya.", btnText: "Lewati" },
    { text: "Aku hanya belum ketemu waktu yang tepat.", btnText: "Lewati" },
    { text: "Selama hampir satu tahun, semua ini hanya kusimpan sendiri.", btnText: "Lewati" },
    { text: "Aku pikir... mungkin perasaan ini akan hilang jika dibiarkan.", btnText: "Lewati" },
    { text: "Setiap hari yang berlalu justru membuatku semakin yakin.", btnText: "Lewati" },
    { text: "Hari ini, aku memilih untuk tidak menyimpannya sendirian.", btnText: "Lewati" },
    { text: "Karena ada yang seharusnya sudah kamu ketahui sejak lama.", btnText: "Lewati" },
    { text: "Aku memiliki perasaan kepadamu.", btnText: "Lewati" },
    { text: "Aku tidak tahu bagaimana jawabanmu nanti.", btnText: "Lewati" },
    { text: "Dan aku juga tidak ingin maksa kamu buat merasakan hal yang sama.", btnText: "Lewati" },
    { text: "Aku cuma pengen jujur.", btnText: "Lewati" },
    { text: "Setidaknya sekali.", btnText: "Lewati" },
    { text: "Terima kasih,", btnText: "Lewati" },
    { text: "kamu telah menjadi seseorang yang berarti dan menghibur dalam hidupku.", btnText: "Lewati" },
    { text: "Apa pun jawabanmu nanti...<br>Aku tetep bersyukur karena akhirnya aku sudah menyampaikan semua yang selama ini kupendam. (WKWK)", btnText: "Lewati" },
    { text: "Thank you woikk!! 🤍", btnText: "MEMORIES" }
];

let currentScene = 0;

const sceneElement = document.getElementById('scene');
const mainTextElement = document.getElementById('main-text');
const btnTextElement = document.getElementById('btn-text');
const actionBtn = document.getElementById('action-btn');
const background = document.querySelector('.background');

let autoNextTimeout;
const readingTime = 10000; // 10 seconds

function startAutoNext() {
    clearTimeout(autoNextTimeout);

    // Reset and start reading progress bar
    const readingProgress = document.getElementById('scene-progress');
    if (readingProgress) {
        readingProgress.style.transition = 'none';
        readingProgress.style.width = '0%';
        void readingProgress.offsetWidth; // trigger reflow
        readingProgress.style.transition = `width ${readingTime}ms linear`;
        readingProgress.style.width = '100%';
    }

    autoNextTimeout = setTimeout(() => {
        if (currentScene < scenes.length - 1) {
            nextScene();
        } else {
            dramaticExit();
        }
    }, readingTime);
}

// Initial Load Animation
document.addEventListener('DOMContentLoaded', () => {
    btnTextElement.textContent = scenes[currentScene].btnText; // Set initial btn text
    // The auto next will start after fullscreen is activated
});

actionBtn.addEventListener('click', () => {
    clearTimeout(autoNextTimeout);
    if (currentScene < scenes.length - 1) {
        nextScene();
    } else {
        dramaticExit();
    }
});

function nextScene() {
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

        // Start auto next after transition in
        setTimeout(startAutoNext, 800);
    }, 600); // 600ms exit delay
}

function dramaticExit() {
    clearTimeout(autoNextTimeout);
    const readingProgressContainer = document.querySelector('.scene-progress-container');
    if (readingProgressContainer) readingProgressContainer.style.opacity = '0';
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

        // Force reflow
        void finalScene.offsetWidth;

        finalScene.classList.remove('scene-hidden');

        // Show cards slightly after
        setTimeout(() => {
            const cardsContainer = document.getElementById('cards-container');
            if (cardsContainer) {
                cardsContainer.style.opacity = '1';
                cardsContainer.style.transform = 'translateY(0)';
            }
        }, 600);
    }, 1500); // 1.5s dramatic exit delay
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
        img.style.left = `calc(${posX}vw - ${size/2}px)`;
        img.style.top = `calc(${posY}vh - ${size/2}px)`;
        
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
    const cardTime = document.getElementById('card-time');
    const cardReply = document.getElementById('card-reply');
    const cardsContainer = document.getElementById('cards-container');
    const finalParagraph = document.getElementById('final-paragraph');
    const replyContainer = document.getElementById('reply-container');
    const confirmTimeContainer = document.getElementById('confirm-time-container');
    const finishBtn = document.getElementById('finish-btn');
    const sendReplyBtn = document.getElementById('send-reply-btn');
    const sendReplyText = document.getElementById('send-reply-text');

    if (cardTime) {
        cardTime.addEventListener('click', () => {
            sendToDiscord('🤍 Memilih opsi "Aku butuh waktu"');
            
            cardsContainer.style.opacity = '0';
            cardsContainer.style.filter = 'blur(8px)';
            cardsContainer.style.transform = 'translateY(20px)';
            finalParagraph.style.opacity = '0';

            setTimeout(() => {
                cardsContainer.style.display = 'none';
                cardsContainer.style.filter = 'none';

                finalParagraph.textContent = "Tidak apa-apa. Terima kasih sudah meluangkan waktu untuk membaca semuanya. Aku akan menghargai apa pun keputusanmu nanti.";
                finalParagraph.style.opacity = '1';

                confirmTimeContainer.style.display = 'flex';
                void confirmTimeContainer.offsetWidth;
                confirmTimeContainer.style.opacity = '1';
            }, 800);
        });
    }

    if (cardReply) {
        cardReply.addEventListener('click', () => {
            sendToDiscord('💌 Memilih opsi "Aku ingin menjawab"');
            
            cardsContainer.style.opacity = '0';
            cardsContainer.style.filter = 'blur(10px)';
            cardsContainer.style.transform = 'translateY(20px)';

            setTimeout(() => {
                cardsContainer.style.display = 'none';
                cardsContainer.style.filter = 'none';

                replyContainer.style.display = 'block';
                void replyContainer.offsetWidth;
                replyContainer.style.opacity = '1';
            }, 800);
        });
    }

    if (sendReplyBtn) {
        sendReplyBtn.addEventListener('click', () => {
            const textarea = document.getElementById('reply-textarea');
            const replyText = textarea.value.trim() || "(Tidak ada pesan tertulis)";
            
            sendToDiscord('📝 Mengirim balasan', replyText);
            
            const sendReplyText = document.getElementById('send-reply-text');
            sendReplyText.innerHTML = '<span class="loading-spinner"></span>';
            sendReplyBtn.style.pointerEvents = 'none';
            textarea.disabled = true;

            setTimeout(() => {
                const finalBadgeText = document.getElementById('final-badge-text');
                const finalTitle = document.getElementById('final-title');
                const finalMemoriesBtn = document.getElementById('final-memories-btn');

                replyContainer.style.opacity = '0';
                finalParagraph.style.opacity = '0';

                setTimeout(() => {
                    replyContainer.style.display = 'none';

                    finalBadgeText.textContent = "Pesan Terkirim";
                    finalTitle.textContent = "Terima kasih.";
                    finalParagraph.textContent = "Apa pun isi jawabanmu, terima kasih karena sudah meluangkan waktu untuk membacanya dan memberikan balasan. Itu sudah sangat berarti bagiku.";

                    finalParagraph.style.opacity = '1';

                    const glow1 = document.querySelector('.glow-1');
                    const glow2 = document.querySelector('.glow-2');
                    if (glow1) glow1.classList.add('glow-bright');
                    if (glow2) glow2.classList.add('glow-bright');

                    createSoftParticles();

                    if (finalMemoriesBtn) {
                        finalMemoriesBtn.style.display = 'flex';
                        void finalMemoriesBtn.offsetWidth;
                        finalMemoriesBtn.style.opacity = '1';
                    }
                }, 800);
            }, 1000);
        });
    }

    const finalMemoriesBtn = document.getElementById('final-memories-btn');
    if (finalMemoriesBtn) {
        finalMemoriesBtn.addEventListener('click', () => {
            const finalScene = document.getElementById('final-scene');
            finalScene.classList.add('scene-hidden');

            setTimeout(() => {
                finalScene.style.display = 'none';

                const closingScene = document.getElementById('closing-scene');
                if (closingScene) {
                    closingScene.style.display = 'flex';
                    void closingScene.offsetWidth;
                    closingScene.style.opacity = '1';
                    spawnChatImages();
                }
            }, 1000);
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
                    spawnChatImages();
                }
            }, 1000);
        });
    }
});

document.getElementById('back-to-start-btn').addEventListener('click', () => {
    // Memberikan sedikit transisi fade out sebelum reload (opsional)
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    setTimeout(() => {
        location.reload();
    }, 800);
});

// --- Music Player & Sync Lyrics ---
const lyricsData = [
    { time: 0, text: "..." },
    { time: 223, text: "'Cause I don't wanna lose you now" },
    { time: 225, text: "I'm lookin' right at the other half of me" },
    { time: 228, text: "The vacancy that sat in my heart" },
    { time: 231, text: "Is a space that now you hold" },
    { time: 235, text: "Show me how to fight for now (please show me, baby)" },
    { time: 238, text: "I'll tell you, baby, it was easy" },
    { time: 240, text: "Comin' back here to you once I figured it out" },
    { time: 244, text: "You were right here all along" },
    { time: 248, text: "It's like you're my mirror" },
    { time: 251, text: "My mirror staring back at me" },
    { time: 254, text: "I couldn't get any bigger" },
    { time: 257, text: "With anyone else beside of me" },
    { time: 261, text: "And now it's clear as this promise" },
    { time: 263, text: "That we're making two reflections into one" },
    { time: 267, text: "'Cause it's like you're my mirror" },
    { time: 270, text: "My mirror staring back at me, staring back at me" },
    { time: 274, text: "♪" },
    { time: 324, text: "You are, you are the love of my life" },
    { time: 328, text: "You are, you are the love of my life" },
    { time: 330, text: "You are, you are the love of my life" },
    { time: 334, text: "You are, you are the love of my life" },
    { time: 336, text: "You are, you are the love of my life" },
    { time: 339, text: "You are, you are the love of my life" },
    { time: 342, text: "You are, you are the love of my life" },
    { time: 346, text: "You are, you are the love of my life" },
    { time: 349, text: "You are, you are the love of my life" },
    { time: 352, text: "You are, you are the love of my life" },
    { time: 355, text: "Now you're the inspiration of this precious song" },
    { time: 361, text: "And I just wanna see your face light up since you put me on" },
    { time: 367, text: "So now I say goodbye to the old me, it's already gone" },
    { time: 373, text: "And I can't wait wait wait wait wait to get you home" },
    { time: 378, text: "Just to let you know, you are" },
    { time: 380, text: "You are, you are the love of my life" },
    { time: 383, text: "You are, you are the love of my life" },
    { time: 386, text: "You are, you are the love of my life" },
    { time: 389, text: "You are, you are the love of my life" },
    { time: 392, text: "You are, you are the love of my life" },
    { time: 395, text: "You are, you are the love of my life" },
    { time: 398, text: "You are, you are the love of my life" },
    { time: 401, text: "You are, you are the love of my life" },
    { time: 404, text: "Girl you're my reflection, all I see is you" },
    { time: 410, text: "My reflection, in everything I do" },
    { time: 416, text: "You're my reflection and all I see is you" },
    { time: 423, text: "My reflection, in everything I do" },
    { time: 430, text: "You are, you are the love of my life" },
    { time: 433, text: "You are, you are the love of my life" },
    { time: 436, text: "You are, you are the love of my life" },
    { time: 439, text: "You are, you are the love of my life" },
    { time: 442, text: "You are, you are the love of my life" },
    { time: 445, text: "You are, you are the love of my life" },
    { time: 448, text: "You are, you are the love of my life" },
    { time: 451, text: "You are, you are the love of my life" },
    { time: 455, text: "You are, you are the love of my life" },
    { time: 458, text: "You are, you are the love of my life" },
    { time: 461, text: "You are, you are the love of my life" },
    { time: 464, text: "You are, you are the love of my life" },
    { time: 467, text: "You are, you are the love of my life" },
    { time: 470, text: "You are, you are the love of my life" },
    { time: 473, text: "You are, you are the love of my life" },
    { time: 476, text: "You are, you are the love of my life" }
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
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().then(() => {
                    fullscreenOverlay.classList.add('hidden');

                    // Attempt to play music and start reading 2 seconds after entering fullscreen
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
                            audio.currentTime = 223; // Start at 03:43
                            playBtn.click(); // Trigger play toggle
                        }
                    }, 2000);
                }).catch(err => {
                    console.log(`Error attempting to enable fullscreen: ${err.message}`);
                    fullscreenOverlay.classList.add('hidden'); // fallback hide
                });
            } else {
                fullscreenOverlay.classList.add('hidden'); // fallback hide
            }
        });
    }

    document.addEventListener('fullscreenchange', checkFullscreen);
});
