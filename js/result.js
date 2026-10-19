
document.addEventListener("DOMContentLoaded", () => {
    const RESULT_STORAGE_KEY = "bookmate-test-result";

    const resultEmpty = document.querySelector("#result-empty");
    const resultContent = document.querySelector("#result-content");

    const resultTypeLabel = document.querySelector("#result-type-label");
    const resultTitle = document.querySelector("#result-title");
    const resultSubtitle = document.querySelector("#result-subtitle");
    const resultDescription = document.querySelector("#result-description");
    const resultKeywords = document.querySelector("#result-keywords");
    const resultTypeVisual = document.querySelector("#result-type-visual");
    const resultVisualSymbol = document.querySelector("#result-visual-symbol");

    const resultScores = document.querySelector("#result-scores");
    const resultBooksDescription = document.querySelector("#result-books-description");
    const resultBooksGrid = document.querySelector("#result-books-grid");
    const resultTipText = document.querySelector("#result-tip-text");

    const retryButton = document.querySelector("#retry-test");

    // 도서 정보: books.html에 등록한 도서와 동일하게 유지
    const bookData = {
        uncomfortable: {
            title: "불편한 편의점",
            author: "김호연",
            category: "소설",
            image: "./img/불편한 편의점.webp"
        },
        dalgurtt: {
            title: "달러구트 꿈 백화점",
            author: "이미예",
            category: "소설",
            image: "./img/달러구트 꿈 백화점.jfif"
        },
        hyunamdong: {
            title: "어서 오세요, 휴남동 서점입니다",
            author: "황보름",
            category: "소설",
            image: "./img/어서오세요 휴남동 서점입니다.jpg"
        },
        stationery: {
            title: "아무튼, 문구",
            author: "김규림",
            category: "에세이",
            image: "./img/아무튼, 문구.jpg"
        },
        "live-as-me": {
            title: "나는 나로 살기로 했다",
            author: "김수현",
            category: "에세이",
            image: "./img/나는 나로 살기로 했다..jpg"
        },
        courage: {
            title: "미움받을 용기",
            author: "기시미 이치로, 고가 후미타케",
            category: "인문",
            image: "./img/미움받을 용기.jpg"
        },
        "atomic-habits": {
            title: "아주 작은 습관의 힘",
            author: "제임스 클리어",
            category: "자기계발",
            image: "./img/아주 작은 습관의 힘.jpg"
        },
        sentence: {
            title: "문장 수집가들의 인생 가이드",
            author: "BOOKMATE 큐레이션",
            category: "에세이",
            image: "./img/문장 수집가들의 인생 가이드.jpg"
        }
    };

    // 결과 유형별 추가 정보
    const resultTypeInfo = {
        healing: {
            label: "BOOK TYPE 01",
            symbol: "HEAL",
            visualClass: "healing",
            tip: "지친 하루에는 무언가를 해결하려 애쓰기보다 마음을 편안하게 해 주는 책을 펼쳐 보세요. 마음에 와닿는 문장을 기록해 두는 것도 좋은 방법이에요."
        },
        story: {
            label: "BOOK TYPE 02",
            symbol: "STORY",
            visualClass: "story",
            tip: "새로운 이야기에 몰입하는 시간을 가져 보세요. 평소 접하지 않았던 장르의 책도 읽어 보면 예상하지 못한 취향을 발견할 수 있어요."
        },
        thinking: {
            label: "BOOK TYPE 03",
            symbol: "THINK",
            visualClass: "thinking",
            tip: "책을 읽으며 떠오른 질문과 생각을 짧게 기록해 보세요. 인상 깊은 문장뿐 아니라 그 문장을 읽고 어떤 생각이 들었는지도 남겨 보세요."
        },
        growth: {
            label: "BOOK TYPE 04",
            symbol: "GROW",
            visualClass: "growth",
            tip: "배운 내용을 하나씩 실천해 보세요. 거창한 목표보다는 오늘 바로 할 수 있는 작은 행동 하나를 정하고 꾸준히 이어 가는 것이 좋아요."
        }
    };

    // 점수 표시 순서
    const scoreTypes = [
        { key: "healing", label: "마음 충전형" },
        { key: "story", label: "이야기 탐험형" },
        { key: "thinking", label: "생각 수집형" },
        { key: "growth", label: "성장 탐구형" }
    ];

    // 저장된 결과 불러오기
    function getSavedResult() {
        try {
            const savedResult = localStorage.getItem(RESULT_STORAGE_KEY);

            if (!savedResult) {
                return null;
            }

            const result = JSON.parse(savedResult);

            if (
                !result ||
                typeof result !== "object" ||
                !result.title ||
                !result.scores ||
                !Array.isArray(result.books)
            ) {
                return null;
            }

            return result;
        } catch (error) {
            console.error("검사 결과를 불러오지 못했습니다.", error);
            return null;
        }
    }

    // 결과가 없을 때 안내 화면 표시
    function showEmptyState() {
        if (resultEmpty) {
            resultEmpty.hidden = false;
        }

        if (resultContent) {
            resultContent.hidden = true;
        }
    }

    // 결과가 있을 때 결과 화면 표시
    function showResultState() {
        if (resultEmpty) {
            resultEmpty.hidden = true;
        }

        if (resultContent) {
            resultContent.hidden = false;
        }
    }

    // 결과 유형 표시
    function renderResultType(result) {
        const typeInfo = resultTypeInfo[result.type] || {
            label: "MY BOOK TYPE",
            symbol: "BOOK",
            visualClass: "default",
            tip: "마음에 드는 책을 천천히 읽으며 나만의 독서 취향을 발견해 보세요."
        };

        if (resultTypeLabel) {
            resultTypeLabel.textContent = typeInfo.label;
        }

        if (resultTitle) {
            resultTitle.textContent = result.title;
        }

        if (resultSubtitle) {
            resultSubtitle.textContent = result.subtitle || "";
        }

        if (resultDescription) {
            resultDescription.textContent = result.description || "";
        }

        if (resultVisualSymbol) {
            resultVisualSymbol.textContent = typeInfo.symbol;
        }

        if (resultTypeVisual) {
            resultTypeVisual.classList.remove(
                "healing",
                "story",
                "thinking",
                "growth",
                "default"
            );

            resultTypeVisual.classList.add(typeInfo.visualClass);
        }

        if (resultTipText) {
            resultTipText.textContent = typeInfo.tip;
        }

        if (resultBooksDescription) {
            resultBooksDescription.textContent =
                `${result.title}에게 추천하는 책을 모았어요.`;
        }

        renderKeywords(result.keywords);
    }

    // 키워드 표시
    function renderKeywords(keywords) {
        if (!resultKeywords) {
            return;
        }

        resultKeywords.replaceChildren();

        if (!Array.isArray(keywords)) {
            return;
        }

        keywords.forEach((keyword) => {
            const item = document.createElement("span");
            item.className = "result-keyword";
            item.textContent = keyword;
            resultKeywords.appendChild(item);
        });
    }

    // 유형별 점수 표시
    function renderScores(scores) {
        if (!resultScores) {
            return;
        }

        resultScores.replaceChildren();

        scoreTypes.forEach((type) => {
            const rawScore = Number(scores[type.key]);
            const score = Number.isFinite(rawScore)
                ? Math.max(0, Math.min(10, rawScore))
                : 0;

            const item = document.createElement("div");
            item.className = "result-score-item";

            const name = document.createElement("span");
            name.className = "result-score-name";
            name.textContent = type.label;

            const track = document.createElement("div");
            track.className = "result-score-track";

            const bar = document.createElement("div");
            bar.className = "result-score-bar";
            bar.style.width = `${score / 10 * 100}%`;

            track.appendChild(bar);

            const value = document.createElement("span");
            value.className = "result-score-value";
            value.textContent = `${score}점`;

            item.append(name, track, value);
            resultScores.appendChild(item);
        });
    }

    // 추천 도서 카드 생성
    function createBookCard(bookId) {
        const book = bookData[bookId];

        if (!book) {
            return null;
        }

        const card = document.createElement("article");
        card.className = "result-book-card";

        const link = document.createElement("a");
        link.className = "result-book-link";
        link.href = "books.html";
        link.setAttribute("aria-label", `${book.title} 도서 목록에서 보기`);

        const cover = document.createElement("div");
        cover.className = "result-book-cover";

        const image = document.createElement("img");
        image.src = book.image;
        image.alt = `${book.title} 도서 표지`;
        image.loading = "lazy";

        const placeholder = document.createElement("div");
        placeholder.className = "result-book-cover-placeholder";
        placeholder.textContent = book.title;
        placeholder.hidden = true;

        image.addEventListener("error", () => {
            image.hidden = true;
            placeholder.hidden = false;
        });

        cover.append(image, placeholder);

        const info = document.createElement("div");
        info.className = "result-book-info";

        const category = document.createElement("span");
        category.className = "result-book-category";
        category.textContent = book.category;

        const title = document.createElement("h3");
        title.className = "result-book-title";
        title.textContent = book.title;

        const author = document.createElement("p");
        author.className = "result-book-author";
        author.textContent = book.author;

        info.append(category, title, author);
        link.append(cover, info);
        card.appendChild(link);

        return card;
    }

    // 추천 도서 목록 표시
    function renderBooks(bookIds) {
        if (!resultBooksGrid) {
            return;
        }

        resultBooksGrid.replaceChildren();

        if (!Array.isArray(bookIds) || bookIds.length === 0) {
            const message = document.createElement("p");
            message.textContent = "추천 도서를 준비하고 있어요.";
            resultBooksGrid.appendChild(message);
            return;
        }

        bookIds.forEach((bookId) => {
            const card = createBookCard(bookId);

            if (card) {
                resultBooksGrid.appendChild(card);
            }
        });
    }

    // 전체 결과 렌더링
    function renderResult(result) {
        renderResultType(result);
        renderScores(result.scores);
        renderBooks(result.books);
        showResultState();
    }

    // 처음 실행
    const savedResult = getSavedResult();

    if (savedResult) {
        renderResult(savedResult);
    } else {
        showEmptyState();
    }

    // 다시 검사하기
    if (retryButton) {
        retryButton.addEventListener("click", () => {
            localStorage.removeItem(RESULT_STORAGE_KEY);
            window.location.href = "test.html";
        });
    }
});
