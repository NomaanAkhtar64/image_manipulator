export function conditionalStyle(
  initValue: string,
  condition: boolean,
  ontrue: string = "",
  onfalse: string = ""
) {
  if (condition) {
    return initValue + " " + ontrue;
  }
  return initValue + " " + onfalse;
}

export function isImage(name: string) {
  const ext = name.split(".").pop();

  if (!ext) return false;

  const image_exts = ["jpeg", "jpg", "jpeg", "png"];

  return image_exts.includes(ext.toLowerCase());
}
