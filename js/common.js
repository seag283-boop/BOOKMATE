
document.addEventListener("DOMContentLoaded", async () => {
    const headerContainer = document.querySelector("#common-header");
    const footerContainer = document.querySelector("#common-footer");

    // 01. 공통 헤더와 푸터 불러오기
    try {
        const response = await fetch("common.html");

        if (!response.ok) {
            throw new Error("공통 레이아웃을 불러오지 못했습니다.");
        }

        const html = await response.text();
        const parser = new DOMParser();
        const commonDocument = parser.parseFromString(html, "text/html");

        const header = commonDocument.querySelector("header");
        const footer = commonDocument.querySelector("footer");

        if (headerContainer && header) {
            headerContainer.replaceChildren(
                document.importNode(header, true)
            );
        }

        if (footerContainer && footer) {
            footerContainer.replaceChildren(
                document.importNode(footer, true)
            );
        }

        // 02. 현재 페이지 메뉴 표시
        setActiveNavigation();

        // 03. 모바일 메뉴 설정
        setupMobileMenu();

    } catch (error) {
        console.error("공통 레이아웃 오류:", error);
    }
});


// 현재 페이지에 해당하는 메뉴에 active 클래스 추가
function setActiveNavigation() {
    const currentPage = document.body.dataset.page;

    const navigationLinks = document.querySelectorAll(
        ".gnb [data-page]"
    );

    navigationLinks.forEach((link) => {
        const isActive = link.dataset.page === currentPage;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}


// 모바일 메뉴 열기 및 닫기
function setupMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".gnb");

    if (!menuToggle || !navigation) return;

    // common.html의 버튼과 메뉴 연결
    navigation.id = "main-navigation";

    menuToggle.addEventListener("click", () => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "메뉴 열기" : "메뉴 닫기"
        );

        navigation.classList.toggle("is-open", !isOpen);
    });

    // 메뉴 항목을 클릭하면 모바일 메뉴 닫기
    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "메뉴 열기");
            navigation.classList.remove("is-open");
        });
    });

    // PC 화면으로 변경되면 모바일 메뉴 상태 초기화
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "메뉴 열기");
            navigation.classList.remove("is-open");
        }
    });
}
