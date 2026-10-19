
document.addEventListener("DOMContentLoaded", () => {
    const booksGrid = document.querySelector("#books-grid");
    const searchForm = document.querySelector("#books-search-form");
    const searchInput = document.querySelector("#book-search");
    const sortSelect = document.querySelector("#book-sort");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const booksCount = document.querySelector("#books-count");
    const emptyMessage = document.querySelector("#books-empty");
    const resetButton = document.querySelector("#reset-books");

    const STORAGE_KEY = "bookmate-favorites";

    if (!booksGrid) return;

    // 도서 카드 목록
    const bookCards = Array.from(
        booksGrid.querySelectorAll(".book-card")
    );

    // 현재 선택된 장르
    let selectedCategory = "all";

    // 즐겨찾기 목록 불러오기
    function getFavorites() {
        try {
            const favorites = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(favorites) ? favorites : [];
        } catch (error) {
            console.error("즐겨찾기 목록을 불러오지 못했습니다.", error);
            return [];
        }
    }

    // 즐겨찾기 목록 저장하기
    function saveFavorites(favorites) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(favorites)
            );
        } catch (error) {
            console.error("즐겨찾기를 저장하지 못했습니다.", error);
        }
    }

    // 하트 버튼 상태 업데이트
    function updateFavoriteButton(button, isFavorite) {
        button.classList.toggle("is-favorite", isFavorite);
        button.setAttribute("aria-pressed", String(isFavorite));
        button.setAttribute(
            "aria-label",
            isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"
        );
        button.textContent = isFavorite ? "♥" : "♡";
    }

    // 저장된 즐겨찾기 상태 적용
    function initializeFavorites() {
        const favorites = getFavorites();

        booksGrid.querySelectorAll(".favorite-btn").forEach((button) => {
            const bookId = button.dataset.favorite;

            updateFavoriteButton(
                button,
                favorites.includes(bookId)
            );
        });
    }

    // 검색, 필터, 정렬 적용
    function renderBooks() {
        const keyword = searchInput.value.trim().toLowerCase();
        const sortType = sortSelect.value;

        // 검색어와 장르에 맞는 책 찾기
        let visibleBooks = bookCards.filter((card) => {
            const title = (card.dataset.title || "").toLowerCase();
            const author = (card.dataset.author || "").toLowerCase();
            const category = card.dataset.category || "";

            const matchesKeyword =
                title.includes(keyword) ||
                author.includes(keyword);

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            return matchesKeyword && matchesCategory;
        });

        // 정렬
        if (sortType === "title") {
            visibleBooks.sort((a, b) => {
                return (a.dataset.title || "").localeCompare(
                    b.dataset.title || "",
                    "ko"
                );
            });
        } else if (sortType === "author") {
            visibleBooks.sort((a, b) => {
                return (a.dataset.author || "").localeCompare(
                    b.dataset.author || "",
                    "ko"
                );
            });
        } else {
            // 기본순: HTML에 작성된 순서 유지
            visibleBooks.sort(
                (a, b) => bookCards.indexOf(a) - bookCards.indexOf(b)
            );
        }

        // 모든 카드 숨기기
        bookCards.forEach((card) => {
            card.hidden = true;
        });

        // 조건에 맞는 카드만 표시
        visibleBooks.forEach((card) => {
            card.hidden = false;
            booksGrid.appendChild(card);
        });

        // 결과 개수 업데이트
        booksCount.textContent = visibleBooks.length;

        // 검색 결과가 없으면 안내 메시지 표시
        emptyMessage.hidden = visibleBooks.length !== 0;
        booksGrid.hidden = visibleBooks.length === 0;
    }

    // 검색 폼
    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            renderBooks();
        });

        // 입력할 때마다 실시간 검색
        searchInput.addEventListener("input", renderBooks);
    }

    // 장르 필터
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedCategory = button.dataset.category;

            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            renderBooks();
        });
    });

    // 정렬 선택
    if (sortSelect) {
        sortSelect.addEventListener("change", renderBooks);
    }

    // 즐겨찾기 버튼
    booksGrid.addEventListener("click", (event) => {
        const button = event.target.closest(".favorite-btn");

        if (!button) return;

        const bookId = button.dataset.favorite;

        if (!bookId) return;

        const favorites = getFavorites();
        const isFavorite = favorites.includes(bookId);

        const updatedFavorites = isFavorite
            ? favorites.filter((id) => id !== bookId)
            : [...favorites, bookId];

        saveFavorites(updatedFavorites);

        updateFavoriteButton(button, !isFavorite);
    });

    // 검색 초기화
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            searchInput.value = "";
            selectedCategory = "all";

            if (sortSelect) {
                sortSelect.value = "default";
            }

            filterButtons.forEach((button) => {
                const isActive = button.dataset.category === "all";

                button.classList.toggle("active", isActive);
                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            renderBooks();
            searchInput.focus();
        });
    }

    // 최초 실행
    initializeFavorites();

    filterButtons.forEach((button) => {
        button.setAttribute(
            "aria-pressed",
            String(button.dataset.category === selectedCategory)
        );
    });

    renderBooks();
});
