import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Safe Firebase Initialization
let auth: ReturnType<typeof getAuth> | null = null;
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase initialization warning:', e);
}

export { auth };

// Configure Google Auth Provider with Drive Scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Auth State Listener
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // User logged in but no token cached yet (e.g., page reload)
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Popup and obtain access token
export const googleSignInWithDrive = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (!auth) {
    throw new Error('ระบบ Google Auth ยังไม่ได้ถูกตั้งค่าหรือเปิดใช้งาน');
  }
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google OAuth access token');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getDriveAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutDrive = async () => {
  if (auth) {
    await signOut(auth);
  }
  cachedAccessToken = null;
};

// --- Google Drive API v3 Methods ---

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  iconLink?: string;
  webViewLink?: string;
  thumbnailLink?: string;
}

/**
 * List files in Google Drive
 */
export const listDriveFiles = async (
  accessToken: string,
  query: string = "trashed = false"
): Promise<DriveFileItem[]> => {
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,mimeType,modifiedTime,size,iconLink,webViewLink,thumbnailLink)&orderBy=modifiedTime desc&pageSize=50`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to list Drive files (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
};

/**
 * Upload a file to Google Drive using Multipart
 */
export const uploadFileToDrive = async (
  accessToken: string,
  fileName: string,
  mimeType: string,
  content: string | Blob | ArrayBuffer,
  parentFolderId?: string
): Promise<DriveFileItem> => {
  const metadata: any = {
    name: fileName,
    mimeType: mimeType,
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );

  let fileBlob: Blob;
  if (content instanceof Blob) {
    fileBlob = content;
  } else if (typeof content === 'string') {
    fileBlob = new Blob([content], { type: mimeType });
  } else {
    fileBlob = new Blob([content]);
  }

  form.append('file', fileBlob);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,modifiedTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to upload file to Google Drive (${response.status})`);
  }

  return await response.json();
};

/**
 * Create a new folder in Google Drive
 */
export const createDriveFolder = async (
  accessToken: string,
  folderName: string,
  parentFolderId?: string
): Promise<DriveFileItem> => {
  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create folder (${response.status})`);
  }

  return await response.json();
};

/**
 * Get file content from Google Drive
 */
export const getDriveFileContent = async (
  accessToken: string,
  fileId: string
): Promise<string> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download file content (${response.status})`);
  }

  return await response.text();
};

/**
 * Delete a file from Google Drive
 */
export const deleteDriveFile = async (
  accessToken: string,
  fileId: string
): Promise<boolean> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete file from Drive (${response.status})`);
  }

  return true;
};
