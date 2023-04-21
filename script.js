const points = document.getElementById("points");
const keywords = document.getElementById("keywords");
const answerInput = document.getElementById("answer");

answerInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    submitAnswer();
  }
});


// Remplacez cette liste par les vrais mots clés de l'API ChatGPT

const database = [
  { 
    "reponse" : "Jurassic Park",
    "keywords" : [
      "film",
      "Steven Spielberg",
      "roman",
      "Michael Crichton",
      "parc",
      "génétique",
      "clonage",
      "île",
      "aventure",
      "John Hammond"
    ]
  },

  { 
    "reponse" : "Bayonetta",
    "keywords" : [
      "jeu vidéo",
      "hack & slash",
      "sorcière",
      "Platinum Games",
      "Hideki Kamiya",
      "magie",
      "lumen",
      "purgatoire",
      "paradis",
      "enfer"
    ]
  },

  { 
    "reponse" : "The Last Of Us",
    "keywords" : [
      "Naughty Dog",
      "action-aventure",
      "survie",
      "horreur",
      "PlayStation",
      "Joel",
      "pandémie",
      "Cordyceps",
      "infectés",
      "post-apocalyptique"
    ]
  },

  { 
    "reponse" : "Pedro Pascal",
    "keywords" : [
      "acteur",
      "Chili",
      "Etats-Unis",
      "télévision",
      "cinéma",
      "théâtre",
      "Game of Thrones",
      "Narcos",
      "Wonder Woman 1984",
      "Mandalorian",
    ]
  },

  { 
    "reponse" : "Nirvana",
    "keywords" : [
      "grunge",
      "Seattle",
      "Bleach",
      "Sub Pop",
      "MTV",
      "légende",
      "années 90",
      "musiciens",
      "héritage",
      "Oui FM"
    ]
  },

  { 
    "reponse" : "Jacques Chirac",
    "keywords" : [
      "président",
      "France",
      "politique",
      "Premier ministre",
      "maire",
      "Paris",
      "Gaullisme",
      "RPR",
      "UMP",
      "corrézien",
      "cohabitation"
    ]
  },

  { 
    "reponse" : "Elisabeth Borne",
    "keywords" : [
      "gouvernement",
      "haut-fonctionnaire",
      "ingénieure",
      "X-Ponts",
      "RATP",
      "École des Ponts",
      "ENA",
      "Conseil d'État",
      "Macron",
      "réforme"
    ]
  },

  { 
    "reponse" : "Brendan Fraser",
    "keywords" : [
      "canadien",
      "cinéma",
      "télévision",
      "théâtre",
      "Rick O'Connell",
      "Scrubs",
      "Doom Patrol",
      "Cliff Steel",
      "Robotman",
      "Getty"
    ]
  },

  { 
    "reponse" : "Prague",
    "keywords" : [
      "Bohême",
      "Pont Charles",
      "Château",
      "Hradčany",
      "Vieille Ville",
      "Mala Strana",
      "Horloge astronomique",
      "Franz Kafka",
      "Velours",
      "tramway"      
    ]
  },

  { 
    "reponse" : "Ben Barnes",
    "keywords" : [
      "Londres",
      "Narnia",
      "Sons of Liberty",
      "Oscar Wilde",
      "Kingston University",
      "West End",
      "The Punisher",
      "Jigsaw",
      "Westworld",
      "Logan"
    ]
  }
]

const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * database.length);
  return database[randomIndex];
};

const question = getRandomQuestion();

const keywordsList = question["keywords"];
const correctAnswer = question["reponse"]; // Remplacez par le vrai titre de l'article Wikipédia de l'API ChatGPT

let remainingPoints = 10;

function createKeyword(keyword, index) {
  const keywordElement = document.createElement("div");
  keywordElement.className = "keyword";
  keywordElement.onclick = () => revealKeyword(keywordElement, index);

  if (index === 10000) {
    keywordElement.textContent = keyword;
    keywordElement.classList.add("revealed");
  } else {
    keywordElement.textContent = "Indice";
  }

  return keywordElement;
}

keywordsList.forEach((keyword, index) => {
  const keywordElement = createKeyword(keyword, index);
  keywords.appendChild(keywordElement);
});

function revealKeyword(keywordElement, index) {
  if (!keywordElement.classList.contains("revealed")) {
    keywordElement.classList.add("keyword-flip");
    setTimeout(() => {
      keywordElement.textContent = keywordsList[index];
      keywordElement.classList.add("revealed");
      keywordElement.classList.remove("keyword-flip");
    }, 300); // Attendre la moitié de la durée de l'animation (0.6s / 2 = 0.3s)
    remainingPoints--;
    points.textContent = remainingPoints;
  }
}

function showPopup() {
  document.getElementById("popup").classList.remove("hidden");
  document.getElementById("popup-points").textContent = remainingPoints;
  updateEmojiSquares();
}

function updateEmojiSquares() {
  const emojiSquaresElement = document.querySelector(".emoji-squares");
  const squareColors = keywordsList.map((_, index) => document.querySelector(`.keyword:nth-child(${index + 1})`).classList.contains("revealed") ? "🟩" : "⬜");
  emojiSquaresElement.textContent = squareColors.join(" ");
}

function copyTextToClipboard() {
  const textToCopy = document.querySelector(".popup-text").textContent + "\n" + document.querySelector(".emoji-squares").textContent;
  const textarea = document.createElement("textarea");
  textarea.textContent = textToCopy;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  alert("Le texte a été copié dans le presse-papiers.");
}

function restartGame() {
  location.reload();
}


function submitAnswer() {
  const userAnswer = answerInput.value.trim();

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    showPopup();
    } else {
    remainingPoints--;
    points.textContent = remainingPoints;
    if (remainingPoints === 0) {
    alert(`Vous avez perdu ! La bonne réponse était : ${correctAnswer}.`);
    location.reload();
    } else {
    alert("Mauvaise réponse, essayez encore !");
    }
    }
    answerInput.value = "";
    }



