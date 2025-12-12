import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = {
  type: "service_account",
  project_id: "scream-5cef9",
  private_key_id: "5cb973517bc8cfca9b1c8b56718f48456203bec2",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD3di5O+16WskDa\n+upy9Ph/3qNAlVYX2uRL/A8giKRyu4+57pNNqhpxgh/fZMJAjQRMy5AqAPSo1vwA\nA7YvYgVu0+2BHZ1FNRd9s49JfoOxHKksYoLXleomLsYWytTbtucLojKQmRGgstgd\nWJckkS4p2WekqE+tGC6HGlSbEM0MY3DA/iBeN+aRAwIj8nj5hGE7ywGPN6RbATal\nqv1cAyPQtGckqkBRUW4VRHyIQM2fpmXpSeA5EgW5Mj3yQMBaobGBd8rUMVKDT/Vs\no0D/NQBD+dQ5htz+5XiUebepO8zg40bWZNwtY4kNmHwSEQRVgWPwZVkru7AxsJKV\nfzUyjbTDAgMBAAECggEAOa1O79PA4Sjc2u0+tdqJDOysakIkVd0L9vXh5LhUc/Vp\nc3G63ZA3J5unqB7I89iqVuffSxr761poU+yJixOypnk40y4+2MGeHws562xUb3R5\nrcGsM2lasNmYC/nskOVZhqmgVXmH1Ue5/WUHnVtFQjXM5WDhaTvIpG6rp5TL5gXW\nC3XeIoWLZygNsSWZWqLAT4EfyUqogf3L+dffJoWJdqqkHzQRqJAgIwhyF2+1uNVf\nB9iHljn7nGsQ+VG/i5sBHbm8Oj0iV0wZ7hBenJIHA3BHPGV6LSU+xa59bFsR+MSK\nQfcDjr6thwasSTNUHqwy2V1KGIJ53qLEie5Vvb6WgQKBgQD/cd1jPS4OcE6rxY1r\nvmBSg60mGNoynClZEp1PMD213TEBuOAl2cFN7vLhy5DdThUXdV7FDJFxbP5/6HtX\n+/GuN8icsIJlmfKMkcUFQO29Yv0zwHiudxgrDe5by5wu7IzZPo+V4bJNS+j4fE7e\ntdo9vbZawcl0TqqJnZeGx+aRwQKBgQD3/9/E8v0s5uB3qpQAzvC5bSCzlbKaLNA5\nSbeA6fqfxgbG2JrpRIAs9804Qr/GE2fHZt7Dk5RxITPv1zZveE2wptXpefz7JlyZ\n8MSDW3REabSIh3Tfs1X6Klz72ogQhkUdfc0an+vR29xF7eLFrQ4cO8PNILb7qbIZ\n2aO+gRrfgwKBgQDYxIl4M2yn+AnqniQacF1Q6EjA8YoINJip66/uiSN09xUlPvuH\nYzg0qDcYASUXh7FCTOl1EetCc5msdV5mFXjLvK7SuL6O9YrsWq70fFrCwgPYLNa8\nRngN4S6KW0hYUYhcukgiinpCOc6jPum2+F8Q0bKzZYtM1YzGZyM0zuIMgQKBgHok\nxftkihlRZQDLPLXhNmK9QrvwYNTaeXuduQl/M/b5O2E4UaPOHysGqUaqaXWPHS/y\nlIjS6OuHJONdpevk3q7AnN6vPFAeJsGS+daQdoUzYr1TqdZ7pz7dGorYqOcqmmPa\nD+irFyR3Gtg+P9CIWUjCjr86+6SbgaKFtMYhJDEtAoGBAKphemIgTbx8C7dHITLC\n9up5nHHgPoYLtaBoxlJHEAWe30/So0s2QAbGo+nKYJD1Ho9lGY7MaDoBpU9CiVRL\nOXjcj0u/dri4llkwwQ7GuBunX6NTwpzg0NIpBN1E+KG8WcM6EpZJdw1p+gRJhSiH\nNMAzWCrVcqqCHA2fG1Z0ctdo\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-r44k2@scream-5cef9.iam.gserviceaccount.com",
  client_id: "114636375951286903394",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r44k2%40scream-5cef9.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
    storageBucket: 'scream-5cef9.firebasestorage.app',
  });
}

const storage = getStorage();
const bucket = storage.bucket();

export async function uploadImage(buffer: Buffer, filename: string): Promise<string> {
  const file = bucket.file(`disney/${filename}`);

  await file.save(buffer, {
    metadata: {
      contentType: 'image/png',
    },
  });

  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/disney/${filename}`;
}

export async function getGalleryImages(): Promise<string[]> {
  const [files] = await bucket.getFiles({ prefix: 'disney/' });

  const urls = files
    .filter(file => file.name !== 'disney/')
    .map(file => `https://storage.googleapis.com/${bucket.name}/${file.name}`);

  return urls;
}
