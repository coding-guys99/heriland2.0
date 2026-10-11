/* Grant Heriland review access to an existing Firebase Authentication user.
   Run only on an authorized developer computer with Google ADC credentials.
   Usage: node scripts/grant-heriland-admin.cjs admin@example.com
*/
const admin = require('firebase-admin');
const email = process.argv[2];
if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
  console.error('Usage: node scripts/grant-heriland-admin.cjs admin@example.com');
  process.exit(1);
}
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'imeet-prototype'
});
(async () => {
  const user = await admin.auth().getUserByEmail(email);
  const existing = user.customClaims || {};
  await admin.auth().setCustomUserClaims(user.uid, { ...existing, herilandAdmin: true });
  console.log('Heriland reviewer permission granted. The user must sign out and sign in again.');
})().catch(err => { console.error(err.message); process.exit(1); });
