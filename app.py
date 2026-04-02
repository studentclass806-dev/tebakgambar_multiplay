from flask import Flask, render_template
from flask_socketio import SocketIO

# Inisialisasi aplikasi Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = 'rahasia-game-tebak-gambar'

# Inisialisasi SocketIO
socketio = SocketIO(app)

# Rute utama saat pemain membuka website
@app.route('/')
def index():
    return render_template('index.html')

# Mendeteksi jika ada pemain yang terhubung
@socketio.on('connect')
def handle_connect():
    print("Seseorang telah terhubung ke permainan!")

# Mendeteksi jika ada pemain yang keluar/putus koneksi
@socketio.on('disconnect')
def handle_disconnect():
    print("Seseorang telah meninggalkan permainan.")

if __name__ == '__main__':
    # Menjalankan server di port 5000
    print("Server berjalan! Buka http://localhost:5000 di browsermu.")
    socketio.run(app, debug=True)
