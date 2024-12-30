import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Verificar que las credenciales estén disponibles
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('FIREBASE_PRIVATE_KEY no está configurado en las variables de entorno');
    }

    // Configurar las credenciales
    const serviceAccount = {
      projectId: 'sistematurnos-733c7',
      clientEmail: 'firebase-adminsdk-2jbhk@sistematurnos-733c7.iam.gserviceaccount.com',
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };

    // Inicializar Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: 'https://sistematurnos-733c7.firebaseio.com'
    });

    console.log('Firebase Admin inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar Firebase Admin:', error);
    throw error;
  }
}

// Obtener y exportar la instancia de Firestore
const db = admin.firestore();

if (!db) {
  throw new Error('No se pudo inicializar Firestore');
}

export { db };
export default admin;
