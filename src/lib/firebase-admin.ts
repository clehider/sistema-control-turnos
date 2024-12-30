import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('FIREBASE_PRIVATE_KEY no está configurado en las variables de entorno');
    }

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || 'sistematurnos-733c7',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-rsd8o@sistematurnos-733c7.iam.gserviceaccount.com',
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });

    console.log('Firebase Admin inicializado correctamente con:', {
      projectId: serviceAccount.projectId,
      clientEmail: serviceAccount.clientEmail
    });
  } catch (error) {
    console.error('Error al inicializar Firebase Admin:', error);
    throw error;
  }
}

const db = admin.firestore();

if (!db) {
  throw new Error('Firestore no se pudo inicializar');
}

export { db };
export default admin;
