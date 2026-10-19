
document.addEventListener("DOMContentLoaded", () => {
    const FAVORITES_KEY = "bookmate-favorites";
    const READING_STATUS_KEY = "bookmate-reading-status";

    const books = [
        {
            id: "uncomfortable",
            title: "불편한 편의점",
            author: "김호연",
            category: "소설",
            image: "./img/불편한 편의점.webp",
            description:
                "서울역의 작은 편의점을 배경으로 펼쳐지는 따뜻한 이야기. 서로 다른 사연을 가진 사람들이 만나 위로와 변화를 경험합니다.",
            quote: "일상 속에서 발견하는 작은 위로와 사람의 온기.",
            keywords: ["위로", "일상", "관계", "성장"]
        },
        {
            id: "dalgurtt",
            title: "달러구트 꿈 백화점",
            author: "이미예",
            category: "소설",
            image: "./img/달러구트 꿈 백화점.jfif",
            description:
                "잠들어야만 입장할 수 있는 신비한 꿈 백화점. 꿈을 사고파는 사람들의 이야기를 통해 일상의 소중함을 돌아봅니다.",
            quote: "꿈을 통해 만나는 신비롭고 따뜻한 이야기.",
            keywords: ["판타지", "꿈", "상상력", "위로"]
        },
        {
            id: "hyunamdong",
            title: "어서 오세요, 휴남동 서점입니다",
            author: "황보름",
            category: "소설",
            image: "./img/어서오세요 휴남동 서점입니다.jpg",
            description:
                "동네 서점을 중심으로 사람들이 만나고 서로의 상처를 이해하며 조금씩 자신만의 삶을 찾아가는 이야기입니다.",
            quote: "각자의 속도로 삶을 살아가는 사람들의 이야기.",
            keywords: ["서점", "휴식", "일상", "자기 발견"]
        },
        {
            id: "stationery",
            title: "아무튼, 문구",
            author: "김규림",
            category: "에세이",
            image: "./img/아무튼, 문구.jpg",
            description:
                "문구를 사랑하는 마음과 일상 속 작은 물건들이 주는 즐거움을 담은 에세이입니다.",
            quote: "좋아하는 것을 좋아하는 마음에 대하여.",
            keywords: ["문구", "취향", "일상", "수집"]
        },
        {
            id: "live-as-me",
            title: "나는 나로 살기로 했다",
            author: "김수현",
            category: "에세이",
            image: "./img/나는 나로 살기로 했다..jpg",
            description:
                "타인의 시선에 흔들리지 않고 자신의 삶을 살아가기 위해 필요한 생각과 태도를 담았습니다.",
            quote: "누구도 아닌 나로 살아가기.",
            keywords: ["자존감", "나답게", "관계", "위로"]
        },
        {
            id: "courage",
            title: "미움받을 용기",
            author: "기시미 이치로, 고가 후미타케",
            category: "인문",
            image: "./img/미움받을 용기.jpg",
            description:
                "아들러 심리학을 바탕으로 타인의 시선에서 벗어나 자신의 삶을 선택하는 방법을 대화 형식으로 풀어냅니다.",
            quote: "타인의 기대보다 자신의 삶을 선택하는 용기.",
            keywords: ["심리학", "자유", "관계", "자기 이해"]
        },
        {
            id: "atomic-habits",
            title: "아주 작은 습관의 힘",
            author: "제임스 클리어",
            category: "자기계발",
            image: "./img/아주 작은 습관의 힘.jpg",
            description:
                "작은 행동의 반복이 어떻게 큰 변화를 만드는지 설명하고, 좋은 습관을 만들고 나쁜 습관을 줄이는 방법을 소개합니다.",
            quote: "작은 변화가 모여 놀라운 결과를 만듭니다.",
            keywords: ["습관", "성장", "목표", "실천"]
        },
        {
            id: "sentence",
            title: "문장 수집가들의 인생 가이드",
            author: "BOOKMATE 큐레이션",
            category: "에세이",
            image: "./img/문장 수집가들의 인생 가이드.jpg",
            description:
                "책 속 문장을 통해 자신의 마음을 돌아보고 일상에서 새로운 의미를 발견하도록 돕는 BOOKMATE 큐레이션입니다.",
            quote: "마음에 남은 한 문장이 하루를 바꿀 수 있습니다.",
            keywords: ["문장", "기록", "독서", "성찰"]
        }
    ];

    const statusLabels = {
        unread: "읽고 싶은 책",
        reading: "읽는 중",
        completed: "완독"
    };

    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get("id") || "uncomfortable";
    const book = books.find(item => item.id === requestedId);

    if (!book) {
        const container = document.querySelector(".book-detail");

        if (container) {
            container.innerHTML = `
                <div class="detail-not-found">
                    <h2>도서를 찾을 수 없습니다.</h2>
                    <p>선택한 도서 정보가 없거나 주소가 올바르지 않습니다.</p>
                    <a href="./books.html">도서 목록으로 돌아가기</a>
                </div>
            `;
        }

        return;
    }

    function readStorage(key, fallback) {
        try {
            const saved = JSON.parse(localStorage.getItem(key) || "null");
            return saved ?? fallback;
        } catch (error) {
            console.error(`${key} 데이터를 불러오지 못했습니다.`, error);
            return fallback;
        }
    }

    function getFavorites() {
        const saved = readStorage(FAVORITES_KEY, []);
        return Array.isArray(saved) ? saved : [];
    }

    function getReadingStatuses() {
        const saved = readStorage(READING_STATUS_KEY, {});
        return saved && typeof saved === "object" && !Array.isArray(saved)
            ? saved
            : {};
    }

    function saveStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`${key} 데이터를 저장하지 못했습니다.`, error);
            alert("변경 사항을 저장하지 못했어요. 브라우저 저장 공간을 확인해 주세요.");
            return false;
        }
    }

    // 도서 기본 정보 표시
    function renderBookInfo() {
        document.title = `${book.title} | BOOKMATE`;

        const title = document.querySelector(".detail-title");
        const author = document.querySelector(".detail-author");
        const category = document.querySelector(".detail-category");
        const description = document.querySelector(".detail-copy");
        const cover = document.querySelector(".detail-cover-image");
        const breadcrumb = document.querySelector(".detail-breadcrumb");
        const summary = document.querySelector("#book-summary");
        const quote = document.querySelector(".detail-quote");
        const keywordList = document.querySelector(".keyword-list");

        if (title) title.textContent = book.title;
        if (author) author.textContent = book.author;
        if (category) category.textContent = book.category;
        if (description) description.textContent = book.description;

        if (cover) {
            cover.src = book.image;
            cover.alt = `${book.title} 표지`;

            cover.addEventListener("error", () => {
                cover.alt = `${book.title} 표지 이미지를 불러올 수 없습니다.`;
            }, { once: true });
        }

        if (breadcrumb) {
            const lastItem = breadcrumb.querySelector("span:last-child");
            if (lastItem) lastItem.textContent = book.title;
        }

        if (summary) summary.textContent = book.description;
        if (quote) quote.textContent = book.quote;

        if (keywordList) {
            keywordList.replaceChildren();

            book.keywords.forEach(keyword => {
                const element = document.createElement("span");
                element.className = "keyword";
                element.textContent = keyword;
                keywordList.appendChild(element);
            });
        }
    }

    // 찜하기 기능
    function renderFavoriteButton() {
        const button = document.querySelector("#detail-favorite-btn");
        if (!button) return;

        function updateButton() {
            const isFavorite = getFavorites().includes(book.id);

            button.textContent = isFavorite ? "♥ 찜한 도서" : "♡ 찜하기";
            button.classList.toggle("is-favorite", isFavorite);
            button.classList.toggle("is-active", isFavorite);
            button.setAttribute("aria-pressed", String(isFavorite));
        }

        button.addEventListener("click", () => {
            const currentFavorites = getFavorites();
            const isFavorite = currentFavorites.includes(book.id);

            const updatedFavorites = isFavorite
                ? currentFavorites.filter(id => id !== book.id)
                : [...currentFavorites, book.id];

            if (saveStorage(FAVORITES_KEY, updatedFavorites)) {
                updateButton();
            }
        });

        updateButton();
    }

    // 독서 상태 기능
    function renderReadingStatus() {
        const actions = document.querySelector(".detail-actions");
        if (!actions) return;

        let statusSelect = document.querySelector("#detail-reading-status");

        if (!statusSelect) {
            statusSelect = document.createElement("select");
            statusSelect.id = "detail-reading-status";
            statusSelect.className = "detail-reading-status";
            statusSelect.setAttribute("aria-label", "독서 상태 선택");

            Object.entries(statusLabels).forEach(([value, label]) => {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = label;
                statusSelect.appendChild(option);
            });

            actions.appendChild(statusSelect);
        }

        const savedStatuses = getReadingStatuses();
        const savedStatus = savedStatuses[book.id];

        statusSelect.value = Object.hasOwn(statusLabels, savedStatus)
            ? savedStatus
            : "unread";

        statusSelect.addEventListener("change", () => {
            const updatedStatuses = getReadingStatuses();
            updatedStatuses[book.id] = statusSelect.value;

            saveStorage(READING_STATUS_KEY, updatedStatuses);
        });
    }

    // 추천 도서 카드 생성
    function renderRecommendations() {
        const recommendGrid = document.querySelector(".recommend-grid");
        if (!recommendGrid) return;

        let recommendations = books
            .filter(item => item.id !== book.id && item.category === book.category)
            .slice(0, 3);

        if (recommendations.length < 3) {
            const additionalBooks = books.filter(item =>
                item.id !== book.id &&
                !recommendations.some(recommended => recommended.id === item.id)
            );

            recommendations = [
                ...recommendations,
                ...additionalBooks.slice(0, 3 - recommendations.length)
            ];
        }

        recommendGrid.replaceChildren();

        recommendations.forEach(item => {
            const link = document.createElement("a");
            link.className = "recommend-card";
            link.href = `./book-detail.html?id=${encodeURIComponent(item.id)}`;

            const image = document.createElement("img");
            image.src = item.image;
            image.alt = `${item.title} 표지`;
            image.loading = "lazy";

            const title = document.createElement("h3");
            title.textContent = item.title;

            const author = document.createElement("p");
            author.textContent = item.author;

            link.append(image, title, author);
            recommendGrid.appendChild(link);
        });
    }

    // 도서 목록으로 돌아가기
    function setupBackButtons() {
        document.querySelectorAll(".detail-bottom-btn").forEach(button => {
            if (button.tagName === "A") {
                button.href = "./books.html";
            } else {
                button.addEventListener("click", () => {
                    window.location.href = "./books.html";
                });
            }
        });
    }

    // 초기 실행
    renderBookInfo();
    renderFavoriteButton();
    renderReadingStatus();
    renderRecommendations();
    setupBackButtons();
});
