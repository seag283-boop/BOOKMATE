
document.addEventListener("DOMContentLoaded", () => {
    // HOME 페이지의 즐겨찾기 버튼
    const favoriteButtons = document.querySelectorAll(".favorite-btn");

    // localStorage에 저장된 즐겨찾기 목록 불러오기
    const STORAGE_KEY = "bookmate-favorites";

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

    function saveFavorites(favorites) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(favorites)
        );
    }

    // 즐겨찾기 버튼 상태 표시
    function updateFavoriteButton(button, isFavorite) {
        button.classList.toggle("is-favorite", isFavorite);

        button.setAttribute(
            "aria-pressed",
            String(isFavorite)
        );

        button.textContent = isFavorite ? "♥" : "♡";
    }

    // 페이지를 열었을 때 저장된 즐겨찾기 반영
    const favorites = getFavorites();

    favoriteButtons.forEach((button) => {
        const bookId = button.dataset.favorite;

        updateFavoriteButton(
            button,
            favorites.includes(bookId)
        );

        // 버튼 클릭 시 즐겨찾기 추가 또는 해제
        button.addEventListener("click", () => {
            const currentFavorites = getFavorites();
            const isFavorite = currentFavorites.includes(bookId);

            let updatedFavorites;

            if (isFavorite) {
                updatedFavorites = currentFavorites.filter(
                    (id) => id !== bookId
                );
            } else {
                updatedFavorites = [...currentFavorites, bookId];
            }

            saveFavorites(updatedFavorites);

            updateFavoriteButton(
                button,
                !isFavorite
            );
        });
    });
});
