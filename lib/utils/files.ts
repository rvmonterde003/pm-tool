const IMAGE_EXT = /\.(jpe?g|png|gif|webp|svg|avif|bmp)$/i

export function isImageFile(fileName: string) {
  return IMAGE_EXT.test(fileName)
}
