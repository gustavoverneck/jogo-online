document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    document.getElementById('join').onclick = () => {
        const username = document.getElementById('username').value;
        const room = document.getElementById('room').value;
        if (username && room) {
            socket.emit('join', { username: username, room: room });
        }
    };

    document.getElementById('roll').onclick = () => {
        const steps = Math.floor(Math.random() * 6) + 1;
        const username = document.getElementById('username').value;
        const room = document.getElementById('room').value;
        socket.emit('move', { username: username, steps: steps, room: room });
    };

    socket.on('player_joined', (data) => {
        const playersDiv = document.getElementById('players');
        playersDiv.innerHTML = '';
        for (const [player, info] of Object.entries(data.players)) {
            playersDiv.innerHTML += `<p>${player}: Posição ${info.position}, Dinheiro $${info.money}</p>`;
        }
    });

    socket.on('player_moved', (data) => {
        const playersDiv = document.getElementById('players');
        playersDiv.innerHTML += `<p>${data.username} moveu para a posição ${data.position}</p>`;
    });
});
