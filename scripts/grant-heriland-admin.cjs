/* Grant Heriland admin review access using Google Application Default Credentials.
   Run: node scripts/grant-heriland-admin.cjs admin@example.com
*/
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const email = process.argv[2];
if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
  console.error('Usage: node scripts/grant-heriland-admin.cjs admin@example.com');
  process.exit(1);
}
initializeApp({ credential: applicationDefault(), projectId: 'imeet-prototype' });
(async () => {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { ...(user.customClaims || {}), herilandAdmin: true });
  const confirmed = await auth.getUser(user.uid);
  if (confirmed.customClaims?.herilandAdmin !== true) throw new Error('Admin claim not confirmed');
  console.log('Heriland admin permission confirmed. Sign out and sign in again.');
})().catch(err => { console.error(err.message); process.exit(1); });
