
document.addEventListener("DOMContentLoaded", () => {
    // 01. ELEMENTS

    const startButton = document.querySelector("#start-test");
    const introSection = document.querySelector("#test-intro");
    const quizContainer = document.querySelector("#quiz-container");

    const testForm = document.querySelector("#book-test-form");
    const questions = Array.from(
        document.querySelectorAll(".quiz-question")
    );

    const currentQuestionText = document.querySelector("#current-question");
    const totalQuestionsText = document.querySelector("#total-questions");

    const progressTrack = document.querySelector("#quiz-progress-track");
    const progressBar = document.querySelector("#quiz-progress-bar");

    const prevButton = document.querySelector("#prev-question");
    const nextButton = document.querySelector("#next-question");
    const submitButton = document.querySelector("#submit-test");
    const notice = document.querySelector("#quiz-notice");

    // 02. SETTINGS

    const TOTAL_QUESTIONS = questions.length;
    const RESULT_STORAGE_KEY = "bookmate-test-result";

    let currentIndex = 0;

    // 결과 유형별 정보
    const resultTypes = {
        healing: {
            type: "healing",
            title: "마음 충전형",
            subtitle: "따뜻한 위로가 필요한 당신",
            description:
                "당신은 책을 통해 마음을 돌아보고 작은 위로를 얻는 것을 좋아해요. " +
                "일상의 소중함과 사람 사이의 따뜻함을 담은 이야기가 잘 어울려요.",
            keywords: ["위로", "공감", "따뜻함"],
            categories: ["에세이", "소설"],
            books: ["uncomfortable", "hyunamdong", "live-as-me"]
        },

        story: {
            type: "story",
            title: "이야기 탐험형",
            subtitle: "새로운 세계를 만나고 싶은 당신",
            description:
                "당신은 흥미로운 이야기와 매력적인 인물에 빠져드는 것을 좋아해요. " +
                "현실에서 잠시 벗어나 새로운 세계를 경험할 수 있는 소설을 추천해요.",
            keywords: ["몰입", "상상력", "이야기"],
            categories: ["소설"],
            books: ["dalgurtt", "uncomfortable", "hyunamdong"]
        },

        thinking: {
            type: "thinking",
            title: "생각 수집형",
            subtitle: "책 속에서 나만의 답을 찾는 당신",
            description:
                "당신은 새로운 관점과 생각할 거리를 얻는 독서를 좋아해요. " +
                "삶과 사람, 세상을 다른 시선으로 바라볼 수 있는 책이 잘 어울려요.",
            keywords: ["성찰", "관점", "질문"],
            categories: ["인문", "에세이"],
            books: ["courage", "sentence", "live-as-me"]
        },

        growth: {
            type: "growth",
            title: "성장 탐구형",
            subtitle: "작은 변화로 더 나은 내일을 만드는 당신",
            description:
                "당신은 독서를 통해 배우고 실제 생활에 적용하는 것을 좋아해요. " +
                "새로운 습관과 자신만의 방향을 만들어 가는 데 도움이 되는 책을 추천해요.",
            keywords: ["성장", "실천", "변화"],
            categories: ["자기계발", "인문"],
            books: ["atomic-habits", "courage", "sentence"]
        }
    };

    // 03. INITIALIZE

    if (
        !startButton ||
        !introSection ||
        !quizContainer ||
        !testForm ||
        questions.length === 0 ||
        !currentQuestionText ||
        !totalQuestionsText ||
        !progressTrack ||
        !progressBar ||
        !prevButton ||
        !nextButton ||
        !submitButton ||
        !notice
    ) {
        console.error(
            "BOOKMATE 테스트: 필요한 HTML 요소를 찾을 수 없습니다."
        );
        return;
    }

    totalQuestionsText.textContent = String(TOTAL_QUESTIONS).padStart(2, "0");

    // 04. START TEST

    startButton.addEventListener("click", () => {
        introSection.hidden = true;
        quizContainer.hidden = false;

        currentIndex = 0;

        showQuestion(currentIndex);

        quizContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // 05. SHOW QUESTION

    function showQuestion(index) {
        if (index < 0 || index >= TOTAL_QUESTIONS) {
            return;
        }

        currentIndex = index;

        questions.forEach((question, questionIndex) => {
            const isCurrent = questionIndex === currentIndex;

            question.hidden = !isCurrent;
            question.classList.toggle("is-active", isCurrent);
        });

        const questionNumber = currentIndex + 1;

        currentQuestionText.textContent = String(questionNumber).padStart(2, "0");

        const progress = (questionNumber / TOTAL_QUESTIONS) * 100;

        progressBar.style.width = `${progress}%`;

        progressTrack.setAttribute(
            "aria-valuenow",
            String(questionNumber)
        );

        prevButton.disabled = currentIndex === 0;

        const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;

        nextButton.hidden = isLastQuestion;
        submitButton.hidden = !isLastQuestion;

        notice.textContent = isLastQuestion
            ? "마지막 답변을 선택한 후 결과를 확인해 보세요."
            : "마음이 가는 답을 하나 선택해 주세요.";
    }

    // 06. CHECK CURRENT ANSWER

    function getSelectedAnswer(index) {
        const questionNumber = index + 1;

        return testForm.querySelector(
            `input[name="question${questionNumber}"]:checked`
        );
    }

    function validateCurrentAnswer() {
        const selectedAnswer = getSelectedAnswer(currentIndex);

        if (!selectedAnswer) {
            notice.textContent = "답변을 하나 선택해 주세요.";
            return false;
        }

        return true;
    }

    // 07. NEXT QUESTION

    nextButton.addEventListener("click", () => {
        if (!validateCurrentAnswer()) {
            return;
        }

        if (currentIndex < TOTAL_QUESTIONS - 1) {
            showQuestion(currentIndex + 1);
        }
    });

    // 08. PREVIOUS QUESTION

    prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
            showQuestion(currentIndex - 1);
        }
    });

    // 09. ANSWER CHANGE

    testForm.addEventListener("change", (event) => {
        if (!event.target.matches('input[type="radio"]')) {
            return;
        }

        notice.textContent = "답변이 선택되었어요.";

        // 선택 상태에 따라 접근성 상태 갱신
        questions.forEach((question) => {
            const options = question.querySelectorAll(".quiz-option");

            options.forEach((option) => {
                const radio = option.querySelector('input[type="radio"]');

                option.classList.toggle(
                    "is-selected",
                    Boolean(radio && radio.checked)
                );
            });
        });
    });

    // 10. COLLECT ANSWERS 

    function collectAnswers() {
        const answers = {};

        for (let index = 0; index < TOTAL_QUESTIONS; index++) {
            const selectedAnswer = getSelectedAnswer(index);

            if (!selectedAnswer) {
                return null;
            }

            answers[`question${index + 1}`] = selectedAnswer.value;
        }

        return answers;
    }

    //  11. CALCULATE RESULT 
    function calculateResult(answers) {
        const scores = {
            healing: 0,
            story: 0,
            thinking: 0,
            growth: 0
        };

        Object.values(answers).forEach((answer) => {
            if (Object.prototype.hasOwnProperty.call(scores, answer)) {
                scores[answer]++;
            }
        });

        const maxScore = Math.max(...Object.values(scores));

        const tiedTypes = Object.keys(scores).filter(
            (type) => scores[type] === maxScore
        );

        // 동점이면 마지막 답변에서 선택한 유형을 우선하고,
        // 그래도 동점이면 가장 많이 나온 유형 중 첫 번째를 사용합니다.
        const lastAnswer = answers[`question${TOTAL_QUESTIONS}`];

        const winningType = tiedTypes.includes(lastAnswer)
            ? lastAnswer
            : tiedTypes[0];

        return {
            ...resultTypes[winningType],
            scores,
            answers,
            completedAt: new Date().toISOString()
        };
    }

    //  12. SUBMIT TEST 

    testForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateCurrentAnswer()) {
            return;
        }

        const answers = collectAnswers();

        if (!answers) {
            notice.textContent = "모든 질문에 답변했는지 확인해 주세요.";
            return;
        }

        const result = calculateResult(answers);

        try {
            localStorage.setItem(
                RESULT_STORAGE_KEY,
                JSON.stringify(result)
            );

            window.location.href = "result.html";
        } catch (error) {
            console.error("테스트 결과 저장에 실패했습니다.", error);

            notice.textContent =
                "결과를 저장하지 못했어요. 브라우저 저장 설정을 확인해 주세요.";
        }
    });

    //  13. RESET TEST

    function resetTest() {
        testForm.reset();

        currentIndex = 0;

        showQuestion(0);
    }

    // 페이지를 새로 열면 처음 상태로 시작합니다.
    resetTest();
});
