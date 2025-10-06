const quizForm = document.getElementById("quiz-form");
const nextBtn = document.getElementById("next-btn");
const timerSpan = document.getElementById("time");
const scoreSpan = document.getElementById("score");
const resultContainer = document.getElementById("result");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
const timePerQuestion = 30;

fetch("https://opentdb.com/api.php?amount=5&category=21&difficulty=easy")
  .then(res => res.json())
  .then(data => {
    if (data.response_code === 0) {
      questions = data.results.map(q => ({
        question: decodeHTML(q.question),
        correct: decodeHTML(q.correct_answer),
        options: shuffle([decodeHTML(q.correct_answer), ...q.incorrect_answers.map(decodeHTML)])
      }));

      question();
    } else {
      quizForm.innerHTML = "<p>Failed to load quiz questions.</p>";
      nextBtn.style.display = "none";
    }
  });


function question() {
  clearInterval(timer); 
  timerSpan.textContent = timePerQuestion;

  const q = questions[currentQuestionIndex];
  quizForm.innerHTML = "";

  const qTitle = document.createElement("div");
  qTitle.className = "question";
  qTitle.innerHTML = `<strong>Q${currentQuestionIndex + 1}:</strong> ${q.question}`;
  quizForm.appendChild(qTitle);

  q.options.forEach(option => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = option;
    label.appendChild(input);
    label.append(" " + option);
    quizForm.appendChild(label);
  });

  Timer();
}


function Timer() {
  clearInterval(timer); 

  let timeLeft = timePerQuestion;
  timerSpan.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      goToNextQuestion();
    }
  }, 1000);
}


nextBtn.addEventListener("click", () => {
  clearInterval(timer);
  questionSuivante();
});


function questionSuivante() {
  const selected = document.querySelector('input[name="answer"]:checked');
  const current = questions[currentQuestionIndex];

  if (selected && selected.value === current.correct) {
    score++;
    scoreSpan.textContent = score;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    question();
  } else {
    ResultatFinal();
  }
}

function ResultatFinal() {
  quizForm.style.display = "none";
  nextBtn.style.display = "none";
  timerSpan.textContent = "0";

  resultContainer.style.display = "block";
  resultContainer.innerHTML = `
    <p>Quiz complete! 🎉</p>
    <p>Your score: <strong>${score}</strong> / ${questions.length}</p>
  `;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
