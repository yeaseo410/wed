// 1. 인트로 레이어 제거 (최우선 실행)
document.addEventListener("DOMContentLoaded", function() {
    const intro = document.getElementById('intro-layer');
    setTimeout(function() {
        if (intro) {
            intro.classList.add('fade-out');
            setTimeout(() => {
                intro.style.display = 'none';
            }, 1500);
        }
    }, 2500);
});

// 2. 스크롤 애니메이션 (Intersection Observer)
const observerOptions = { threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "all 0.8s ease-out";
    observer.observe(section);
});

// 3. 벚꽃 효과 (Sakura Canvas)
const canvas = document.getElementById('sakura');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const petals = [];

    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * -1;
            this.size = Math.random() * 8 + 5;
            this.speed = Math.random() * 1 + 1;
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 0.2 - 0.1;
        }
        draw() {
            ctx.beginPath();
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.fillStyle = '#ffb7c5';
            ctx.arc(0, 0, this.size, 0, Math.PI / 2);
            ctx.fill();
            ctx.restore();
        }
        update() {
            this.y += this.speed;
            this.x += Math.sin(this.y / 50);
            this.angle += this.spin;
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(petal => { petal.update(); petal.draw(); });
        requestAnimationFrame(animate);
    }

    for (let i = 0; i < 50; i++) { petals.push(new Petal()); }
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 4. 지도 설정 (에러 방지를 위해 try-catch 사용)
try {
    var container = document.getElementById('map');
    var mapOptions = { 
        center: new kakao.maps.LatLng(37.5240, 127.1332), 
        level: 3 
    };
    var map = new kakao.maps.Map(container, mapOptions);
    var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(37.5240, 127.1332)
    });
    marker.setMap(map);
} catch (e) {
    console.log("지도 로드 대기 중...");
}

// 5. 유틸리티 함수 (복사, 음악, 방명록)
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => alert("계좌번호가 복사되었습니다."));
}

function toggleMusic() {
    const bgm = document.getElementById('bgm');
    const musicContainer = document.getElementById('music-container');
    if (bgm.paused) {
        bgm.play();
        musicContainer.classList.add('playing');
        document.querySelector('.music-text').innerText = "BGM OFF";
    } else {
        bgm.pause();
        musicContainer.classList.remove('playing');
        document.querySelector('.music-text').innerText = "BGM ON";
    }
}

// 6. Firebase (YOUR_부분을 실제 값으로 채워주세요!)
const firebaseConfig = {
    apiKey: "AIza...",
    databaseURL: "https://...",
    projectId: "...",
};
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    
    database.ref('messages').on('value', (snapshot) => {
        const data = snapshot.val();
        const listElement = document.getElementById('guestbook-list');
        if(listElement) {
            listElement.innerHTML = '';
            for (let id in data) {
                const msg = data[id];
                const card = `<div class="guestbook-card">...</div>`; // 생략
                listElement.insertAdjacentHTML('afterbegin', card);
            }
        }
    });
}