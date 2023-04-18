// Bonjour bienvenue dans le script 0.1

const database = ["Tour Eiffel","Douglas Adams","Jurassic Park","Final Fantasy VII","Alain Chabat","Emmanuel Macron"]

const points = document.getElementById("points");
const keywords = document.getElementById("keywords");
const answerInput = document.getElementById("answer");

let remainingPoints = 10;

answerInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    submitAnswer();
  }
});

function choisirElementsAleatoires(liste, nombre) {
  if (nombre > liste.length) {
    throw new Error("Le nombre d'éléments demandés est supérieur à la taille de la liste.");
  }

  // Fonction de comparaison aléatoire
  function comparaisonAleatoire() {
    return 0.5 - Math.random();
  }

  // Mélanger la liste
  let listeMelangee = liste.slice().sort(comparaisonAleatoire);

  // Récupérer les 'nombre' premiers éléments
  return listeMelangee.slice(0, nombre);
}

const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * database.length);
  return database[randomIndex];
};

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



function revealKeyword(keywordElement, index) {
  if (!keywordElement.classList.contains("revealed")) {
    keywordElement.textContent = keywordsList[index];
    keywordElement.classList.add("revealed");
    remainingPoints--;
    points.textContent = remainingPoints;
  }
}

function submitAnswer() {
  const userAnswer = answerInput.value.trim();

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    alert(`Félicitations ! Vous avez trouvé la bonne réponse avec ${remainingPoints} points restants.`);
    location.reload();
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

async function getWikidataFromWikipediaUrl(wikipediaUrl) {
  const wikipediaTitle = encodeURIComponent(new URL(wikipediaUrl).pathname.split('/').pop());
  const lang = new URL(wikipediaUrl).pathname.split('/')[1];
  
  const sparqlQuery = `
  SELECT ?item ?itemLabel ?prop ?propLabel ?value ?valueLabel
  WHERE {
    ?article schema:about ?item ;
             schema:isPartOf <https://${lang}.wikipedia.org/> ;
             schema:name ?name .
    FILTER (STR(?name) = "${wikipediaTitle}")
    ?item ?p ?statement .
    ?statement ?ps ?value .
    ?prop wikibase:claim ?p;
          wikibase:statementProperty ?ps.
    SERVICE wikibase:label { 
      bd:serviceParam wikibase:language "${lang}".
    }
  }`;

  console.log("QUERY:",sparqlQuery)

  const url = new URL('https://query.wikidata.org/sparql');
  url.searchParams.set('query', sparqlQuery);
  url.searchParams.set('format', 'json');

  const response = await fetch(url);
  const data = await response.json();

  const result = data.results.bindings.map(binding => ({
    item: binding.item.value,
    itemLabel: binding.itemLabel.value,
    prop: binding.prop.value,
    propLabel: binding.propLabel.value,
    value: binding.value.value,
    valueLabel: binding.valueLabel.value
  }));

  return data;
}

// Utilisation :
const wikipediaUrl = 'https://fr.wikipedia.org/wiki/Albert_Einstein';
getWikidataFromWikipediaUrl(wikipediaUrl).then(data => {
  console.log(data);
});



function getWikipediaPageContent(title, callback) {
  return new Promise((resolve, reject) => {
    const endpoint = "https://fr.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
      action: "query",
      prop: "extracts",
      format: "json",
      titles: title,
      explaintext: 1,
      origin: "*"
  });

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${endpoint}?${params}`, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      if (data && data.query && data.query.pages) {
        const pageId = Object.keys(data.query.pages)[0];
        const pageContent = data.query.pages[pageId].extract;
        callback(null, pageContent);
      } else {
        callback("Aucun contenu trouvé pour cette page.");
      }
    }
  };
  xhr.send();
})}

function getFilteredBacklinks(title, callback) {
  getBacklinks(title, function (error, backlinks) {
    if (error) {
      callback(error);
      return;
    }

    getWikipediaPageContent(title, function (error, content) {
      if (error) {
        callback(error);
        return;
      }

      const filteredBacklinks = backlinks.filter((link) => {
        const regex = new RegExp(`\\b${link.title}\\b`, "gi");
        return regex.test(content);
      });

      callback(null, filteredBacklinks);
    });
  });
}

function getBacklinks(title, callback) {
  return new Promise((resolve, reject) => {
    const endpoint = "https://fr.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      list: "backlinks",
      bltitle: title,
      bllimit: "max",
      origin: "*"
    });

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${endpoint}?${params}`, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data && data.query && data.query.backlinks) {
          const backlinks = data.query.backlinks.filter(
            (link) => !link.title.startsWith("Liste")
          );
          callback(null, backlinks);
        } else {
          callback("Aucun article trouvé pointant vers cette page.");
        }
      }
    };
    xhr.send();
  });
}

function getTopic(title) {
  return new Promise((resolve, reject) => {
    getFilteredBacklinks(title)
      .then((filteredBacklinks) => {
        resolve(filteredBacklinks);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

(async () => {
  const question = getRandomQuestion();

  const correctAnswer = question;
  try {
    const keywordsList_all = await getTopic(question);
    console.log(keywordsList_all);
    const keywordsList = choisirElementsAleatoires(keywordsList_all, 10);

    keywordsList.forEach((keyword, index) => {
      const keywordElement = createKeyword(keyword, index);
      keywords.appendChild(keywordElement);
    });
  } catch (error) {
    console.error(error);
  }
})();