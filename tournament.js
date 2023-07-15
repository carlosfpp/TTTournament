let players = [];
let currentRound = 0;
let matches = [];
let winners = [];

function startTournament() {
    const playerNamesTextArea = document.getElementById('playerNames');
    const names = playerNamesTextArea.value.split('\n');
    players = names.map(name => ({ name: name.trim(), wins: 0 }));

    // Generar la clasificación inicial
    renderTournamentTable();

    document.getElementById('playerNames').disabled = true;
    document.getElementById('tournamentTable').style.display = 'block';
    generateNextRound();

    // Llamamos a renderTournamentTable() después de generateNextRound()
    renderTournamentTable();
}

function generateNextRound() {
    currentRound++;
    matches = generateMatches();
    renderTournamentTable();
}

function generateMatches() {
    const matches = [];
    const playedMatches = [];

    // Generar los enfrentamientos para la siguiente ronda
    const playersToMatch = [...players]; // Hacemos una copia de los jugadores
    while (playersToMatch.length > 1) {
        const player1Index = getRandomIndex(playersToMatch.length);
        const player1 = playersToMatch[player1Index];
        playersToMatch.splice(player1Index, 1);

        const player2Index = getRandomIndex(playersToMatch.length);
        const player2 = playersToMatch[player2Index];
        playersToMatch.splice(player2Index, 1);

        matches.push({ player1, player2 });
        playedMatches.push({ player1, player2 });
    }

    // Comprobar si hay enfrentamientos anteriores y evitarlos si es posible
    for (const match of matches) {
        const hasPlayedBefore = playedMatches.find(
            playedMatch =>
                (playedMatch.player1 === match.player1 && playedMatch.player2 === match.player2) ||
                (playedMatch.player1 === match.player2 && playedMatch.player2 === match.player1)
        );

        if (hasPlayedBefore) {
            // Intercambiar los jugadores para evitar el enfrentamiento repetido
            const temp = match.player1;
            match.player1 = match.player2;
            match.player2 = temp;
        }
    }

    return matches;
}

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}


function endTournament() {
    // Lógica para finalizar el torneo
    // Aquí puedes determinar al ganador, segundo y tercer lugar basado en el número de victorias.

    // Mostrar los resultados finales
    renderTournamentTable();
    document.getElementById('playerNames').disabled = false;
}

function updateMatchResult(matchIndex, winnerIndex) {
    // Actualizar los datos del ganador y clasificación
    const match = matches[matchIndex];
    const winner = players[winnerIndex];

    winner.wins++;

    // Ordenar la clasificación en orden descendente según el número de partidos ganados
    players.sort((a, b) => b.wins - a.wins);

    // Actualizar los resultados en la tabla del torneo
    renderTournamentTable();
}

function renderTournamentTable() {
    const tournamentTable = document.getElementById('tournamentTable');
    tournamentTable.innerHTML = '';

    if (currentRound === 0) {
        tournamentTable.innerHTML = '<p>Aún no se ha empezado el torneo.</p>';
        return;
    }

    tournamentTable.innerHTML = `<h3>Ronda ${currentRound}</h3>`;

    if (matches.length === 0 && currentRound > 0) {
        tournamentTable.innerHTML += '<p>No hay más partidos por jugar. Torneo finalizado.</p>';

        // Mostrar los resultados finales
        tournamentTable.innerHTML += '<h3>Resultados Finales</h3>';

        if (players.length > 0) {
            tournamentTable.innerHTML += '<ol>';
            for (let i = 0; i < players.length; i++) {
                tournamentTable.innerHTML += `<li>${players[i].name} - ${players[i].wins} partidos ganados</li>`;
            }
            tournamentTable.innerHTML += '</ol>';
        }

        return;
    }

    tournamentTable.innerHTML += '<ul>';
    for (let i = 0; i < matches.length; i++) {
        tournamentTable.innerHTML += `<li>${matches[i].player1.name} vs ${matches[i].player2.name} 
                                        <button onclick="updateMatchResult(${i}, 0)">Gana ${matches[i].player1.name}</button>
                                        <button onclick="updateMatchResult(${i}, 1)">Gana ${matches[i].player2.name}</button>
                                      </li>`;
    }
    tournamentTable.innerHTML += '</ul>';
}
