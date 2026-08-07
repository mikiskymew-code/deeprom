import React from 'react';

/**
 * Formats and normalizes product image URLs (e.g. converting Google Drive / Dropbox share links to direct raw image URLs)
 */
export function formatImageUrl(
  url?: string | null,
  modelCode?: string,
  name?: string,
  brand?: string
): string {
  if (!url || typeof url !== 'string') {
    return getFallbackSvgUrl(modelCode, name, brand);
  }

  let cleanUrl = url.trim().replace(/^["']|["']$/g, '');

  if (!cleanUrl) {
    return getFallbackSvgUrl(modelCode, name, brand);
  }

  // Handle Google Drive links
  // e.g. https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
  // or https://drive.google.com/open?id=1ABC123xyz
  // or https://drive.google.com/uc?id=1ABC123xyz
  if (cleanUrl.includes('drive.google.com')) {
    let fileId = '';
    const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const idMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (fileDMatch && fileDMatch[1]) {
      fileId = fileDMatch[1];
    } else if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }

    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  // Handle Dropbox links
  if (cleanUrl.includes('dropbox.com')) {
    cleanUrl = cleanUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
  }

  // If it's a valid data URL, http, https, blob or relative path
  if (
    cleanUrl.startsWith('data:') ||
    cleanUrl.startsWith('http://') ||
    cleanUrl.startsWith('https://') ||
    cleanUrl.startsWith('blob:') ||
    cleanUrl.startsWith('/')
  ) {
    return cleanUrl;
  }

  // If it looks like a filename or text string without protocol, wrap with http or fallback
  if (cleanUrl.includes('.')) {
    return `https://${cleanUrl}`;
  }

  return getFallbackSvgUrl(modelCode || cleanUrl, name, brand);
}

/**
 * Generates an elegant SVG Data URL fallback when an image is missing or broken.
 */
export function getFallbackSvgUrl(
  modelCode?: string,
  name?: string,
  brand?: string
): string {
  const codeLabel = (modelCode || name || 'HVAC PRODUCT').substring(0, 24);
  const brandLabel = (brand || 'AIR PARTS').substring(0, 16);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="100%" height="100%">
    <rect width="200" height="120" fill="#F8FAFC" rx="10" />
    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E2E8F0" stroke-width="0.5"/>
    </pattern>
    <rect width="200" height="120" fill="url(#grid)" rx="10" />
    <rect x="25" y="22" width="150" height="76" rx="12" fill="#D97706" />
    <rect x="29" y="26" width="142" height="68" rx="10" fill="#F59E0B" />
    <text x="100" y="60" font-family="sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">${encodeURIComponent(codeLabel)}</text>
    <text x="100" y="76" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FEF3C7" text-anchor="middle">${encodeURIComponent(brandLabel)}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Image error event handler for <img> tags to safely fallback to SVG if the image fail to load.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  modelCode?: string,
  name?: string,
  brand?: string
) {
  const target = e.currentTarget;
  target.onerror = null; // Prevent infinite fallback loops
  target.src = getFallbackSvgUrl(modelCode, name, brand);
}
