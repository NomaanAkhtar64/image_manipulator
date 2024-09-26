export default function getBase64(file: File): Promise<IMImage> {
  return new Promise((resolve, reject) => {
    const imgLoader = document.getElementById("img-loader") as HTMLImageElement;
    if (imgLoader === null) return reject("Failed to load Image");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      if (reader.result === null) {
        return reject("No File Converted");
      }
      const base64Image = reader.result.toString();
      imgLoader.src = base64Image;
      imgLoader.onload = function (ev) {
        resolve({
          base64: base64Image,
          name: file.name,
          size: file.size,
          w: imgLoader.width,
          h: imgLoader.height,
        });
      };
    };
    reader.onerror = function (error) {
      reject("Loading Error: " + error);
    };
  });
}
