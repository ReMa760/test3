const leaderboardBtn = document.querySelector(".leaderboard-btn");
const leaderboard = document.querySelector(".leaderboard");
const input = document.querySelector(".input");
const btnCheck = document.querySelector(".check");
const body = document.querySelector("body");
const message = document.querySelector(".text");
const displayNumber = document.querySelector(".number");
const guessMessage = document.querySelector(".guess-counter");
const btnTryAgain = document.querySelector(".try-again");
const rank = document.querySelector(".rank");
const rankImg = document.querySelector(".ranked-img");

const ranks = [
  "bronze",
  "silver",
  "gold",
  "diamond",
  "mythic",
  "legendary",
  "masters",
  "pro",
];
const rankImages = {
  bronze: "bronzeRank.png",
  silver: "silverRank.png",
  gold: "goldRank.png",
  diamond: "diamondRank.png",
  mythic: "mythicRank.png",
  legendary: "legendaryRank.png",
  masters: "mastersRank.png",
  pro: "proRank_1-removebg-preview.png",
};
const leaderboardKey = "leaderboardData";

let guess = 5;
let i = 0;
let secretNumber = Math.trunc(Math.random() * 50) + 1;
console.log(secretNumber);

function getLeaderboard() {
  return JSON.parse(localStorage.getItem(leaderboardKey)) || [];
}

function updateLeaderboard(playerName, playerRank) {
  let leaderboard = getLeaderboard();

  // Ako igrač već postoji, ne tražimo unos imena
  let existingPlayer = leaderboard.find((player) => player.name === playerName);
  if (
    existingPlayer &&
    ranks.indexOf(playerRank) <= ranks.indexOf(existingPlayer.rank)
  ) {
    return;
  }

  // Dodajemo novog igrača ako prestigne nekoga
  leaderboard.push({ name: playerName, rank: playerRank });
  leaderboard.sort((a, b) => ranks.indexOf(b.rank) - ranks.indexOf(a.rank));
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboardData = getLeaderboard();
  leaderboard.innerHTML =
    leaderboardData.length === 0
      ? "No players yet."
      : "<h2>Leaderboard 🏆</h2><ol>" +
        leaderboardData
          .map((player) => `<li>${player.name} - ${player.rank}</li>`)
          .join("") +
        "</ol>";
}

document.addEventListener("DOMContentLoaded", displayLeaderboard);

const againFunction = function () {
  if (i === 7) {
    message.textContent = "You won🏆";
    input.style.display = "none";
    btnCheck.style.display = "none";
    btnTryAgain.style.opacity = "1";
    btnTryAgain.style.visibility = "visible";
  }

  secretNumber = Math.trunc(Math.random() * 50) + 1;
  guess = 5;
  input.value = "";
  guessMessage.textContent = guess;
  message.textContent = "Start guessing...";
  displayNumber.textContent = "?";
  rank.textContent = ranks[i];
  rankImg.src = rankImages[ranks[i]];
  console.log(secretNumber);
};

btnCheck.addEventListener("click", function () {
  let inputNumber = +input.value;

  if (inputNumber === secretNumber) {
    displayNumber.textContent = secretNumber;
    message.textContent = "Correct✅";

    setTimeout(() => {
      let leaderboard = getLeaderboard();
      let lowestRankInTop5 =
        leaderboard.length < 5
          ? null
          : leaderboard[leaderboard.length - 1].rank;

      // Proveravamo da li igrač treba da unese ime
      if (
        leaderboard.length < 5 ||
        ranks.indexOf(ranks[i]) > ranks.indexOf(lowestRankInTop5)
      ) {
        let playerName = prompt("Čestitamo! Unesi svoje ime za leaderboard:");
        if (playerName) updateLeaderboard(playerName, ranks[i]);
      }

      againFunction();
    }, 1500);

    i++;
  } else {
    message.textContent =
      inputNumber < secretNumber ? "Too low📉" : "Too high📈";
    guess--;
    guessMessage.textContent = guess;
  }

  if (guess === 0) {
    message.textContent = "You lost try again❌";
    input.style.display = "none";
    btnCheck.style.display = "none";
    btnTryAgain.style.opacity = "1";
    btnTryAgain.style.visibility = "visible";
  }
});

btnTryAgain.addEventListener("click", function () {
  btnTryAgain.style.opacity = "0";
  btnTryAgain.style.visibility = "hidden";
  guess = 5;
  input.style.display = "block";
  btnCheck.style.display = "block";
  secretNumber = Math.trunc(Math.random() * 50) + 1;
  guessMessage.textContent = guess;
  message.textContent = "Start guessing...";
  input.value = "";
  rank.textContent = "bronze";
  rankImg.src = "bronzeRank.png";
  i = 0;
});

leaderboardBtn.addEventListener("click", function () {
  leaderboard.classList.toggle("hidden");
});
