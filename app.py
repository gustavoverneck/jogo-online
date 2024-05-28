from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, join_room, leave_room, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

players = {}
rooms = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    players[username] = {'position': 0, 'money': 1500}  # Exemplo de estado do jogador
    rooms[room] = players
    emit('player_joined', {'players': rooms[room]}, room=room)

@socketio.on('move')
def on_move(data):
    username = data['username']
    steps = data['steps']
    room = data['room']
    players[username]['position'] += steps
    emit('player_moved', {'username': username, 'position': players[username]['position']}, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)