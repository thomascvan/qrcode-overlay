const fs = require('fs').promises;
const path = require('path');
const qr = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

const qrCodeSizePercentage = 13; // Adjust the percentage as needed
const qrCodeMarginLeft = 130; // Adjust the left margin as needed
const qrCodeMarginTop = qrCodeMarginLeft; // Adjust the top margin as needed

const outputDirectory = path.join(__dirname, 'images');

async function qrCodeOverlay(inputImageFilePath, qrCodeLink = 'example.com') {
  try {
    // Create the output directory if it doesn't exist
    await fs.mkdir(outputDirectory, { recursive: true });

    // Define the output file path for the composite image (PNG format)
    const outputFilePath = path.join(outputDirectory, `output.png`);

    // Check if the output file already exists
    const fileExists = await fs.access(outputFilePath)
      .then(() => true) // Resolve if file exists
      .catch(() => false); // Reject if file doesn't exist

    // Generate the QR code as a data URL
    const image = await loadImage(inputImageFilePath);
    const qrCodeSize = Math.floor(image.width * (qrCodeSizePercentage / 100));
    const url = await qr.toDataURL(qrCodeLink, { width: qrCodeSize });

    // Create a canvas with the same dimensions as the original image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the original image on the canvas
    ctx.drawImage(image, 0, 0);

    // Draw the QR code on the canvas with adjusted position
    const qrCode = await loadImage(url);
    ctx.drawImage(qrCode, qrCodeMarginLeft, qrCodeMarginTop);

    // Save the composite image to the output file
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(outputFilePath, buffer);

    console.log('Composite image created:', outputFilePath);
  } catch (err) {
    console.error('Error creating composite image:', err);
  }
}

module.exports = qrCodeOverlay;


// qrCodeOverlay(path.join(__dirname, 'crypto-noir.jpg'));
