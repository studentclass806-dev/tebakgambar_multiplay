// Menghubungkan ke server Socket.IO
const socket = io();

// Mengambil elemen kanvas dari HTML
const canvas = document.getElementById('papanGambar');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let currentX = 0;
let currentY = 0;

// Fungsi utama untuk menggambar garis
function drawLine(x0, y0, x1, y1, kirimKeServer = true) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = 'black'; // Warna garis
    ctx.lineWidth = 3;         // Ketebalan garis
    ctx.stroke();
    ctx.closePath();

    // Jika garis ini buatan kita sendiri, kirim koordinatnya ke server
    if (kirimKeServer) {
        socket.emit('coretan_baru', {
            x0: x0,
            y0: y0,
            x1: x1,
            y1: y1
        });
    }
}

// Deteksi saat mouse ditekan (mulai menggambar)
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    currentX = e.offsetX;
    currentY = e.offsetY;
});

// Deteksi saat mouse digeser (proses menggambar)
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return; // Kalau mouse nggak ditekan, jangan menggambar
    drawLine(currentX, currentY, e.offsetX, e.offsetY, true);
    currentX = e.offsetX;
    currentY = e.offsetY;
});

// Deteksi saat mouse dilepas atau keluar dari kanvas (berhenti menggambar)
canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('mouseout', () => { isDrawing = false; });

// ---------------------------------------------------------
// MENERIMA CORETAN DARI PEMAIN LAIN VIA SERVER
// ---------------------------------------------------------
socket.on('gambar_ke_layar', (data) => {
    // Gambar garis di layar kita berdasarkan data dari server, 
    // tapi JANGAN dikirim balik ke server (kirimKeServer = false) biar gak looping
    drawLine(data.x0, data.y0, data.x1, data.y1, false);
});
