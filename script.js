// [1] 초기 설정 및 유틸리티
if (!Kakao.isInitialized()) {
    Kakao.init('4189f2b4f758ae4fc6af6ad06c09c2d5'); 
}

function copyAccount(text) { // 함수명을 HTML과 맞추세요
    navigator.clipboard.writeText(text).then(() => alert("계좌번호가 복사되었습니다."));
}

function shareKakao() {
    Kakao.Share.sendCustom({ templateId: 131097 });
}

// [2] 인트로 제어 및 BGM (중복 제거 통합)
document.addEventListener("DOMContentLoaded", function() {
    const intro = document.getElementById('intro-layer');
    const bgm = document.getElementById('bgm');
    const musicContainer = document.getElementById('music-container');
    const musicText = document.querySelector('.music-text');

    function startMusic() {
        if (bgm && bgm.paused) {
            bgm.play().then(() => {
                if (musicContainer) musicContainer.classList.add('playing');
                if (musicText) musicText.innerText = "BGM OFF";
            }).catch(e => console.log("자동 재생 방지 정책"));
        }
    }

    // 인트로 클릭 시 음악 재생
    if (intro) {
        intro.addEventListener('click', startMusic);
        
        // 2.5초 후 자동 페이드 아웃
        setTimeout(() => {
            intro.classList.add('fade-out');
            setTimeout(() => { 
                intro.style.display = 'none'; 
                startMusic(); // 사라진 후 다시 한번 시도
            }, 1500);
        }, 2500);
    }

    // 스크롤 애니메이션 초기화
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "all 0.8s ease-out";
        observer.observe(section);
    });
});

// [3] 벚꽃 효과 (기존 코드 유지)
const canvas = document.getElementById('sakura');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const petals = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
}

// [4] 지도 설정 (오륜교회)
window.addEventListener('load', function() {
    try {
        const container = document.getElementById('map');
        if (container) {
            const loc = new kakao.maps.LatLng(37.5240, 127.1332);
            const map = new kakao.maps.Map(container, { center: loc, level: 3 });
            new kakao.maps.Marker({ position: loc }).setMap(map);
            
            // 모바일 렌더링 지연 대응
            setTimeout(() => map.relayout(), 500);
        }
    } catch (e) { console.error("지도 에러:", e); }
});

// [5] Firebase & 방명록 (본인 설정값 유지)
const firebaseConfig = {
    apiKey: "AIzaSyDIVYbKH19kXXOrJXEzmHAAxDOiIor5DYM",
    authDomain: "wedding-guestbook-bda35.firebaseapp.com",
    databaseURL: "https://wedding-guestbook-bda35-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "wedding-guestbook-bda35",
    storageBucket: "wedding-guestbook-bda35.firebasestorage.app",
    messagingSenderId: "410447321886",
    appId: "1::410447321886:web:d519b3f52d1e85b4e9c70f"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

database.ref('messages').on('value', (snapshot) => {
    const data = snapshot.val();
    const listElement = document.getElementById('guestbook-list');
    if (!listElement) return;
    listElement.innerHTML = ''; 
    if (data) {
        Object.keys(data).reverse().forEach(id => { // 최신순 정렬
            const msg = data[id];
            const card = `
                <div class="guestbook-card">
                    <div class="name">From. ${msg.name}</div>
                    <div class="content">${msg.message}</div>
                </div>`;
            listElement.insertAdjacentHTML('beforeend', card);
        });
    }
});

function saveMessage() {
    const name = document.getElementById('guest-name').value;
    const message = document.getElementById('guest-message').value;

    if (name.trim() && message.trim()) {
        database.ref('messages').push({
            name, message, date: new Date().toLocaleString()
        }).then(() => {
            alert("축하 메시지가 전달되었습니다.");
            document.getElementById('guest-name').value = '';
            document.getElementById('guest-message').value = '';
            toggleInput();
        });
    } else {
        alert("성함과 메시지를 입력해 주세요.");
    }
}

function toggleInput() {
    const inputDiv = document.getElementById('guestbook-input');
    if (inputDiv) inputDiv.style.display = (inputDiv.style.display === 'none') ? 'block' : 'none';
}