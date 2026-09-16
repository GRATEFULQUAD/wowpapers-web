// Client-side port of the backend's feed normalizer, so the static frontend
// can talk directly to the Google Apps Script feed with no server in between.

const SUPPORTED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function getExtension(filename = "") {
  const parts = filename.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].toLowerCase();
}

function isSupportedFile(file) {
  if (!file || typeof file !== "object") return false;
  return SUPPORTED_EXTENSIONS.has(getExtension(file.name || ""));
}

function normalizeFile(file, folderName) {
  return {
    id: String(file.id ?? ""),
    name: String(file.name ?? "untitled"),
    folder: String(file.folder ?? folderName ?? ""),
    modified: file.modified ? new Date(file.modified).toISOString() : null,
    imageUrl: file.imageUrl || (file.id ? `https://drive.google.com/uc?export=view&id=${file.id}` : ""),
  };
}

function sortNewestFirst(files) {
  return [...files].sort((a, b) => {
    const ta = a.modified ? Date.parse(a.modified) : 0;
    const tb = b.modified ? Date.parse(b.modified) : 0;
    return tb - ta;
  });
}

function normalizePrimaryFormat(raw) {
  return (raw.folders || []).map((folder) => {
    const files = (folder.files || []).filter(isSupportedFile).map((f) => normalizeFile(f, folder.name));
    return { name: String(folder.name ?? "Untitled"), files: sortNewestFirst(files) };
  });
}

// Backward-compat: sections/categories shaped feeds.
function normalizeLegacyFormat(raw) {
  const sourceList = raw.sections || raw.categories || [];
  return sourceList.map((section) => {
    const name = section.name || section.title || section.category || "Untitled";
    const rawFiles = section.files || section.images || section.items || [];
    const files = rawFiles.filter(isSupportedFile).map((f) => normalizeFile(f, name));
    return { name: String(name), files: sortNewestFirst(files) };
  });
}

export function normalizeFeed(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Feed response is not a valid object");
  }

  let folders = [];
  if (Array.isArray(raw.folders)) {
    folders = normalizePrimaryFormat(raw);
  } else if (Array.isArray(raw.sections) || Array.isArray(raw.categories)) {
    folders = normalizeLegacyFormat(raw);
  } else {
    throw new Error("Feed response did not match any known folder format");
  }

  const wallpaperCount = folders.reduce((sum, f) => sum + f.files.length, 0);

  return {
    updated: raw.updated ? new Date(raw.updated).toISOString() : new Date().toISOString(),
    folders,
    meta: { folderCount: folders.length, wallpaperCount },
  };
}
