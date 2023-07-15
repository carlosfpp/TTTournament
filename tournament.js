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

function generateMatches() {
    const matches = [];
    const playedMatches = [];

    // Filtrar jugadores que aún no han ganado partidos en la ronda actual
    const playersToMatch = players.filter(player => player.wins === (currentRound - 1));

    // Generar los enfrentamientos para la siguiente ronda
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

function generateNextRound() {
    if (currentRound > 0) {
        // Actualizar los ganadores de los partidos en la ronda actual
        for (const match of matches) {
            const winnerIndex = winners.findIndex(winner => winner.player === match.player1 || winner.player === match.player2);
            if (winnerIndex !== -1) {
                winners[winnerIndex].wins++;
            }
        }
    }

    currentRound++;
    matches = generateMatches();
    winners = [];
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

        // Mostrar la clasificación en forma de tabla
        tournamentTable.innerHTML += '<h3>Clasificación</h3>';
        if (players.length > 0) {
            const table = document.createElement('table');
            table.innerHTML = '<tr><th>Jugador</th><th>Partidos Ganados</th><th>Partidos Jugados</th></tr>';
            const maxWins = Math.max(...players.map(p => p.wins));

            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                const row = document.createElement('tr');
                if (player.wins === maxWins) {
                    row.classList.add('winner');
                }
                row.innerHTML = `<td>${player.name}</td><td>${player.wins}</td><td>${currentRound - 1}</td>`;
                table.appendChild(row);
            }

            tournamentTable.appendChild(table);
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


    // Actualizar los resultados en la tabla del torneo
    renderTournamentTable();
}

