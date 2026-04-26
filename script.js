// [1] 카카오톡 SDK 초기화 및 공유 설정
if (!Kakao.isInitialized()) {
    // 본인의 JavaScript 키를 입력하세요
    Kakao.init('4189f2b4f758ae4fc6af6ad06c09c2d5'); 
}

// 모바일 호환성을 높인 계좌번호 복사 함수
function copyAccount(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            alert("계좌번호가 복사되었습니다.");
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

// 구형 브라우저 및 인앱 브라우저용 대체 복사 방식
function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        alert("계좌번호가 복사되었습니다.");
    } catch (err) {
        alert("복사에 실패했습니다. 직접 입력 부탁드립니다.");
    }
    document.body.removeChild(textArea);
}

// 카카오톡 메시지 템플릿 공유 함수
function shareKakao() {
    Kakao.Share.sendCustom({
        templateId: 131097 // 본인의 템플릿 ID
    });
}

// [2] 인트로 제어, BGM, 스크롤 애니메이션 통합
document.addEventListener("DOMContentLoaded", function() {
    const intro = document.getElementById('intro-layer');
    const bgm = document.getElementById('bgm');
    const musicContainer = document.getElementById('music-container');
    const musicText = document.querySelector('.music-text');

    // 음악 재생 함수
    function startMusic() {
        if (bgm && bgm.paused) {
            bgm.play().then(() => {
                if (musicContainer) musicContainer.classList.add('playing');
                if (musicText) musicText.innerText = "BGM OFF";
            }).catch(e => console.log("상호작용 후 재생 가능"));
        }
    }

    // 인트로 클릭 시 즉시 음악 재생 시도
    if (intro) {
        intro.addEventListener('click', startMusic);
        
        // 2.5초 후 자동 인트로 제거
        setTimeout(() => {
            intro.classList.add('fade-out');
            setTimeout(() => { 
                intro.style.display = 'none'; 
                startMusic(); // 제거된 후 다시 한번 재생 시도
            }, 1500);
        }, 2500);
    }

    // 섹션별 스크롤 애니메이션 (FADE IN 효과)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "all 0.8s ease-out";
        observer.observe(section);
    });
});

// [3] 벚꽃 내리는 효과 (Canvas)
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

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// [4] 카카오 지도 설정 (오륜교회)
window.addEventListener('load', function() {
    try {
        const container = document.getElementById('map');
        if (container) {
            const oryunChurch = new kakao.maps.LatLng(37.5240, 127.1332);
            const map = new kakao.maps.Map(container, {
                center: oryunChurch,
                level: 3
            });
            const marker = new kakao.maps.Marker({ position: oryunChurch });
            marker.setMap(map);
            
            // 모바일 화면 갱신 대응
            setTimeout(() => map.relayout(), 800);
        }
    } catch (e) {
        console.error("지도 로딩 실패:", e);
    }
});

// [5] Firebase 실시간 방명록 시스템
const firebaseConfig = {
    apiKey: "AIzaSyDIVYbKH19kXXOrJXEzmHAAxDOiIor5DYM",
    authDomain: "wedding-guestbook-bda35.firebaseapp.com",
    databaseURL: "https://wedding-guestbook-bda35-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "wedding-guestbook-bda35",
    storageBucket: "wedding-guestbook-bda35.firebasestorage.app",
    messagingSenderId: "410447321886",
    appId: "1::410447321886:web:d519b3f52d1e85b4e9c70f"
};

// Firebase 초기화
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// 실시간 메시지 리스트 불러오기
database.ref('messages').on('value', (snapshot) => {
    const data = snapshot.val();
    const listElement = document.getElementById('guestbook-list');
    if (!listElement) return;

    listElement.innerHTML = ''; 
    if (data) {
        // 최신글이 상단에 오도록 역순 출력
        Object.keys(data).reverse().forEach(id => {
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

// 메시지 저장 함수
function saveMessage() {
    const nameInput = document.getElementById('guest-name');
    const messageInput = document.getElementById('guest-message');

    if (nameInput.value.trim() && messageInput.value.trim()) {
        database.ref('messages').push({
            name: nameInput.value,
            message: messageInput.value,
            date: new Date().toLocaleString()
        }).then(() => {
            alert("축하 메시지가 소중하게 전달되었습니다.");
            nameInput.value = '';
            messageInput.value = '';
            toggleInput();
        });
    } else {
        alert("성함과 메시지를 모두 입력해 주세요.");
    }
}

// 방명록 입력창 토글
function toggleInput() {
    const inputDiv = document.getElementById('guestbook-input');
    if (inputDiv) {
        inputDiv.style.display = (inputDiv.style.display === 'none') ? 'block' : 'none';
    }
}