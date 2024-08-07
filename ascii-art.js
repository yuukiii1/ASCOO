const asciiElement = document.getElementById('ascii');
const video = document.createElement('video');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(drawAscii);
    })
    .catch(err => console.error("Error accessing camera: " + err));

const characters = " .:-=+*%@#";

function drawAscii() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const width = 300;
    const height = 100;

    canvas.width = width;
    canvas.height = height;

    context.drawImage(video, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height).data;

    let ascii = '';

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const index = (i * width + j) * 4;
            const r = imageData[index];
            const g = imageData[index + 1];
            const b = imageData[index + 2];
            const brightness = (r + g + b) / 3;
            const charIndex = Math.floor((brightness / 255) * (characters.length - 1));
            ascii += characters[charIndex];
        }
        ascii += '\n';
    }

    asciiElement.textContent = ascii;
    requestAnimationFrame(drawAscii);
}

document.getElementById('capture-button').addEventListener('click', () => {
    const wrapper = document.getElementById('ascii-wrapper');
    const title = document.getElementById('title').textContent;
    const subtitle = document.getElementById('subtitle').textContent;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const lines = asciiElement.textContent.split('\n');
    const lineHeight = 20; // Adjust this for better spacing

    // Increase canvas dimensions for higher quality
    canvas.width = 3320;
    canvas.height = (lines.length + 5) * lineHeight; // Extra space for title, subtitle, and watermark

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'white';
    context.font = '20px monospace';

    context.fillText(title, 10, lineHeight);
    context.fillText(subtitle, 10, 2 * lineHeight);

    lines.forEach((line, index) => {
        context.fillText(line, 10, (index + 4) * lineHeight);
    });

    // Overlaying and larger watermark
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.font = '40px sans-serif';
    context.fillText('Captured with ASCOO', 40, canvas.height - lineHeight * 2);

    const img = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = img;
    link.download = 'ASCOO_1.png';
    link.click();
});
