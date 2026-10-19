
document.addEventListener("DOMContentLoaded", () => {
    const FAVORITES_KEY = "bookmate-favorites";
    const READING_STATUS_KEY = "bookmate-reading-status";

    const booksGrid = document.querySelector("#library-books-grid");
    const emptyState = document.querySelector("#library-empty");
    const filterButtons = document.querySelectorAll(".library-filter-btn");

    const totalBooksElement = document.querySelector("#total-books");
    const unreadBooksElement = document.querySelector("#unread-books");
    const readingBooksElement = document.querySelector("#reading-books");
    const completedBooksElement = document.querySelector("#completed-books");

    // 도서 정보는 books.html의 도서 ID와 일치시킴
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

    const statusLabels = {
        unread: "읽고 싶은 책",
        reading: "읽는 중",
        completed: "완독"
    };

    let currentFilter = "all";

    // localStorage에서 배열 불러오기
    function loadFavorites() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(FAVORITES_KEY) || "[]"
            );

            if (!Array.isArray(saved)) {
                return [];
            }

            // 실제 등록된 도서만 유지하고 중복 제거
            return [...new Set(
                saved.filter((id) => {
                    return typeof id === "string" && bookData[id];
                })
            )];
        } catch (error) {
            console.error("관심 도서를 불러오지 못했습니다.", error);
            return [];
        }
    }

    // 독서 상태 불러오기
    function loadReadingStatuses() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(READING_STATUS_KEY) || "{}"
            );

            return saved && typeof saved === "object" && !Array.isArray(saved)
                ? saved
                : {};
        } catch (error) {
            console.error("독서 상태를 불러오지 못했습니다.", error);
            return {};
        }
    }

    let favorites = loadFavorites();
    let readingStatuses = loadReadingStatuses();

    // 등록된 책에 기본 상태 적용
    function getStatus(bookId) {
        const status = readingStatuses[bookId];

        return Object.hasOwn(statusLabels, status)
            ? status
            : "unread";
    }

    // 관심 도서 저장
    function saveFavorites() {
        try {
            localStorage.setItem(
                FAVORITES_KEY,
                JSON.stringify(favorites)
            );
        } catch (error) {
            console.error("관심 도서를 저장하지 못했습니다.", error);
            alert("저장 공간을 사용할 수 없어 변경 사항을 저장하지 못했어요.");
        }
    }

    // 독서 상태 저장
    function saveReadingStatuses() {
        try {
            localStorage.setItem(
                READING_STATUS_KEY,
                JSON.stringify(readingStatuses)
            );
        } catch (error) {
            console.error("독서 상태를 저장하지 못했습니다.", error);
            alert("저장 공간을 사용할 수 없어 변경 사항을 저장하지 못했어요.");
        }
    }

    // 독서 현황 숫자 업데이트
    function updateStatistics() {
        let unreadCount = 0;
        let readingCount = 0;
        let completedCount = 0;

        favorites.forEach((bookId) => {
            const status = getStatus(bookId);

            if (status === "unread") {
                unreadCount++;
            } else if (status === "reading") {
                readingCount++;
            } else if (status === "completed") {
                completedCount++;
            }
        });

        if (totalBooksElement) {
            totalBooksElement.textContent = favorites.length;
        }

        if (unreadBooksElement) {
            unreadBooksElement.textContent = unreadCount;
        }

        if (readingBooksElement) {
            readingBooksElement.textContent = readingCount;
        }

        if (completedBooksElement) {
            completedBooksElement.textContent = completedCount;
        }
    }

    // 도서 표지 생성
    function createBookCover(book) {
        const cover = document.createElement("div");
        cover.className = "library-book-cover";

        const image = document.createElement("img");
        image.src = book.image;
        image.alt = `${book.title} 도서 표지`;
        image.loading = "lazy";

        const placeholder = document.createElement("div");
        placeholder.className = "library-book-cover-placeholder";
        placeholder.textContent = book.title;
        placeholder.hidden = true;

        image.addEventListener("error", () => {
            image.hidden = true;
            placeholder.hidden = false;
        });

        cover.append(image, placeholder);

        return cover;
    }

    // 독서 상태 선택 상자 생성
    function createStatusSelect(bookId) {
        const select = document.createElement("select");
        select.className = "library-status-select";
        select.setAttribute("aria-label", `${bookData[bookId].title} 독서 상태`);

        Object.entries(statusLabels).forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;

            if (getStatus(bookId) === value) {
                option.selected = true;
            }

            select.appendChild(option);
        });

        select.addEventListener("change", () => {
            const newStatus = select.value;

            if (!Object.hasOwn(statusLabels, newStatus)) {
                return;
            }

            readingStatuses[bookId] = newStatus;
            saveReadingStatuses();

            updateStatistics();
            renderBooks();
        });

        return select;
    }

    // 관심 도서 삭제 버튼 생성
    function createRemoveButton(bookId) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "library-remove-btn";
        button.textContent = "×";
        button.setAttribute(
            "aria-label",
            `${bookData[bookId].title} 관심 도서에서 삭제`
        );
        button.title = "관심 도서에서 삭제";

        button.addEventListener("click", () => {
            const book = bookData[bookId];

            const confirmed = window.confirm(
                `「${book.title}」을(를) 나의 책장에서 삭제할까요?`
            );

            if (!confirmed) {
                return;
            }

            favorites = favorites.filter((id) => id !== bookId);

            saveFavorites();
            updateStatistics();
            renderBooks();
        });

        return button;
    }

    // 도서 카드 생성
    function createBookCard(bookId) {
        const book = bookData[bookId];

        if (!book) {
            return null;
        }

        const card = document.createElement("article");
        card.className = "library-book-card";
        card.dataset.bookId = bookId;

        const cover = createBookCover(book);

        const info = document.createElement("div");
        info.className = "library-book-info";

        const category = document.createElement("span");
        category.className = "library-book-category";
        category.textContent = book.category;

        const title = document.createElement("h3");
        title.className = "library-book-title";
        title.textContent = book.title;

        const author = document.createElement("p");
        author.className = "library-book-author";
        author.textContent = book.author;

        info.append(category, title, author);

        const actions = document.createElement("div");
        actions.className = "library-book-actions";

        const statusSelect = createStatusSelect(bookId);
        const removeButton = createRemoveButton(bookId);

        actions.append(statusSelect, removeButton);
        card.append(cover, info, actions);

        return card;
    }

    // 책장 목록 렌더링
    function renderBooks() {
        if (!booksGrid || !emptyState) {
            return;
        }

        booksGrid.replaceChildren();

        const filteredBooks = favorites.filter((bookId) => {
            return currentFilter === "all" ||
                getStatus(bookId) === currentFilter;
        });

        if (favorites.length === 0) {
            emptyState.hidden = false;
            booksGrid.hidden = true;

            const heading = emptyState.querySelector("h3");
            const description = emptyState.querySelector("p");

            if (heading) {
                heading.textContent = "아직 책장이 비어 있어요.";
            }

            if (description) {
                description.textContent =
                    "마음에 드는 책을 찾아 나만의 책장을 채워 보세요.";
            }

            return;
        }

        if (filteredBooks.length === 0) {
            emptyState.hidden = false;
            booksGrid.hidden = true;

            const heading = emptyState.querySelector("h3");
            const description = emptyState.querySelector("p");
            const link = emptyState.querySelector(".library-empty-link");

            if (heading) {
                heading.textContent = "이 상태에 해당하는 책이 없어요.";
            }

            if (description) {
                description.textContent =
                    "다른 독서 상태를 선택하거나 책의 상태를 변경해 보세요.";
            }

            if (link) {
                link.textContent = "전체 책장 보기";
                link.href = "library.html";
                link.onclick = (event) => {
                    event.preventDefault();
                    setFilter("all");
                };
            }

            return;
        }

        emptyState.hidden = true;
        booksGrid.hidden = false;

        // 원래 빈 책장 안내 링크 복원
        const emptyLink = emptyState.querySelector(".library-empty-link");

        if (emptyLink) {
            emptyLink.textContent = "책 둘러보기 ↗";
            emptyLink.href = "books.html";
            emptyLink.onclick = null;
        }

        filteredBooks.forEach((bookId) => {
            const card = createBookCard(bookId);

            if (card) {
                booksGrid.appendChild(card);
            }
        });
    }

    // 필터 변경
    function setFilter(status) {
        currentFilter = status;

        filterButtons.forEach((button) => {
            const isActive = button.dataset.status === status;

            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        renderBooks();
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setFilter(button.dataset.status || "all");
        });
    });

    // 페이지 처음 열기
    updateStatistics();
    renderBooks();
});
