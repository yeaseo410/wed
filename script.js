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
// 페이지 로드가 완료된 후 실행되도록 감싸줍니다.
window.onload = function() {
    try {
        var container = document.getElementById('map'); // 지도를 담을 영역
        
        // 지도가 들어갈 div가 있는지 먼저 확인
        if (container) {
            var options = { 
                center: new kakao.maps.LatLng(37.5240, 127.1332), // 오륜교회 좌표
                level: 3 // 확대 레벨
            };

            var map = new kakao.maps.Map(container, options); // 지도 생성

            // 마커 설정
            var markerPosition = new kakao.maps.LatLng(37.5240, 127.1332); 
            var marker = new kakao.maps.Marker({
                position: markerPosition
            });

            marker.setMap(map); // 마커 표시
            
            // 모바일에서 지도가 깨지는 경우를 대비해 크기 재조정
            map.relayout();
        }
    } catch (e) {
        console.error("지도 로딩 중 에러 발생:", e);
    }
};

// [1] 유틸리티 함수 (복사 기능만 유지)
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => alert("계좌번호가 복사되었습니다."));
}

// [2] 페이지 로드 시 인트로 제거 및 자동 재생 로직
document.addEventListener("DOMContentLoaded", function() {
    const intro = document.getElementById('intro-layer');
    const bgm = document.getElementById('bgm');
    const musicContainer = document.getElementById('music-container');
    const musicText = document.querySelector('.music-text');

    // 재생 상태를 업데이트하는 내부 공통 함수
    function startMusic() {
        if (bgm && bgm.paused) {
            bgm.play()
                .then(() => {
                    if (musicContainer) musicContainer.classList.add('playing');
                    if (musicText) musicText.innerText = "BGM OFF";
                })
                .catch(e => console.log("자동 재생 방지 정책으로 인해 클릭이 필요합니다."));
        }
    }

    // 1. 사용자가 인트로 화면 아무 곳이나 클릭하면 음악 재생 시작 및 즉시 인트로 제거 준비
    if (intro) {
        intro.addEventListener('click', function() {
            startMusic(); // 음악 재생 시도
            
            // 클릭 즉시 페이드 아웃 시작 (선택 사항: 클릭 시 바로 사라지게 하려면 아래 코드 활성화)
            /*
            intro.classList.add('fade-out');
            setTimeout(() => { intro.style.display = 'none'; }, 1500);
            */
        });
    }

    // 2. 기존 로직: 2.5초 후 자동으로 인트로 페이드 아웃 시작
    setTimeout(function() {
        if (intro) {
            intro.classList.add('fade-out');
            setTimeout(() => {
                intro.style.display = 'none';
                
                // 인트로가 완전히 사라지는 시점에 한 번 더 재생 시도
                // (사용자가 이전에 인트로를 클릭했다면 이미 재생 중일 것입니다)
                startMusic();
            }, 1500);
        }
    }, 2500);
});

// 6. Firebase (YOUR_부분을 실제 값으로 채워주세요!)
// 1. Firebase 설정 (복사한 본인의 키값으로 교체하세요!)
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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. 메시지 실시간 불러오기
database.ref('messages').on('value', (snapshot) => {
    const data = snapshot.val();
    const listElement = document.getElementById('guestbook-list');
    listElement.innerHTML = ''; 

    if (data) {
        for (let id in data) {
            const msg = data[id];
            const card = `
                <div class="guestbook-card">
                    <div class="name">From. ${msg.name}</div>
                    <div class="content">${msg.message}</div>
                </div>`;
            listElement.insertAdjacentHTML('afterbegin', card); // 최신글이 위로 오게 함
        }
    }
});

// 3. 메시지 저장 함수 (주차 안내 팝업 제외)
function saveMessage() {
    const nameInput = document.getElementById('guest-name');
    const messageInput = document.getElementById('guest-message');
    const name = nameInput.value;
    const message = messageInput.value;

    if (name.trim() && message.trim()) {
        database.ref('messages').push({
            name: name,
            message: message,
            date: new Date().toLocaleString()
        }).then(() => {
            // 성공 시 알림 및 입력창 초기화
            alert("축하 메시지가 소중하게 전달되었습니다.");
            nameInput.value = '';
            messageInput.value = '';
            toggleInput(); // 입력창 닫기
        }).catch((error) => {
            console.error("저장 중 오류 발생:", error);
            alert("메시지 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        });
    } else {
        alert("성함과 메시지를 모두 입력해 주세요.");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        // 모바일 대응을 위해 클릭 이벤트를 명시적으로 연결
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault(); // 폼 전송 방지 (안정성 확보)
            saveMessage();
        });
    }
});

// 입력창 토글 함수
function toggleInput() {
    const inputDiv = document.getElementById('guestbook-input');
    if (inputDiv) {
        inputDiv.style.display = inputDiv.style.display === 'none' ? 'block' : 'none';
    }
}

// 카카오 SDK 초기화 (이미 되어 있다면 중복 선언 주의)
if (!Kakao.isInitialized()) {
    Kakao.init('4189f2b4f758ae4fc6af6ad06c09c2d5'); 
}

function shareKakao() {
    Kakao.Share.sendCustom({
        templateId: 131097, // 확정된 템플릿 ID
    });
}