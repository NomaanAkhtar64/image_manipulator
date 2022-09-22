export function conditionalStyle(
  initValue: string,
  condition: boolean,
  ontrue: string = '',
  onfalse: string = ''
) {
  if (condition) {
    return initValue + ' ' + ontrue;
  }
  return initValue + ' ' + onfalse;
}

export function isImage(name: string) {
  const ext = name.split('.').pop();

  if (!ext) return false;

  const image_exts = ['jpeg', 'jpg', 'jpeg', 'png'];

  return image_exts.includes(ext.toLowerCase());
}

// export async function encodeImageFile(file: File): Promise<String> {
//   return new Promise((response, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = function () {
//       if (typeof reader.result === 'string') {
//         response(reader.result);
//       } else {
//         reject();
//       }
//     };
//     reader.readAsDataURL(file);
//   });
// }
