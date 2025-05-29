from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)

# You're allowing your Flask application to accept requests from other origins.
CORS(app)


# Allow SocketIO WebSocket connections from any origin
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/')
def index():
    return render_template('index.html')


# By using socketio.on, you can create event-driven applications that respond to incoming messages from clients in real-time.
@socketio.on('location')
# The argument data means the latitude and the longitude
def handle_location(data):  
    # The first argument 'location' is the channel on which to send the message.
    # The second argument data is the data to be sent to the clients.
    # The third argument broadcast=True indicates that the message should be sent to all connected clients.
    emit('location', data, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
