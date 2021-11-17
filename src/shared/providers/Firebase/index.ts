import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../../../config/firebaseServiceAccount.json';

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export { admin }
