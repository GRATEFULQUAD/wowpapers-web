// Google Drive's `uc?export=view` links set `Cross-Origin-Resource-Policy: same-site`
// on the final response, which modern browsers block from loading as a cross-site
// <img> subresource (it only works via direct top-level navigation). Drive's
// thumbnail endpoint is explicitly designed for embedding and does not set that
// header, so we rewrite feed image URLs to use it for on-screen display.
//
// The full-quality `uc?export=view` / `uc?export=download` URL is still used for
// the actual download action, where a direct navigation is used instead of an
// <img> tag.

export function toEmbeddableUrl(wallpaper, size = 1600) {
  if (!wallpaper?.id) return wallpaper?.imageUrl || "";
  return `https://drive.google.com/thumbnail?id=${wallpaper.id}&sz=w${size}`;
}

export function toDownloadUrl(wallpaper) {
  if (!wallpaper?.id) return wallpaper?.imageUrl || "";
  return `https://drive.google.com/uc?export=download&id=${wallpaper.id}`;
}
