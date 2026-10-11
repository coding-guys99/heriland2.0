/* Heriland free merchant onboarding — Firebase Auth and Firestore. */
let hAuth,hDb,hMine=[],hAdminClaim=false;
function hInit(){if(!window.firebase||!window.HERILAND_FIREBASE_CONFIG)return false;if(!firebase.apps.length)firebase.initializeApp(HERILAND_FIREBASE_CONFIG);hAuth=firebase.auth();hDb=firebase.firestore();return true}
function hInfo(msg){document.getElementById('businessFormFeedback').textContent=msg}
register=function(){return '<main class="wrap"><div class="onboard-layout"><div class="onboard-copy"><span class="eyebrow">HERILAND FOR BUSINESS</span><h1>Grow your business. Stay local.</h1><p>Submit your business for free. Reach customers across Sarawak.</p><div class="onboard-point">✓ Free registration</div><div class="onboard-point">✓ Cross-town service areas</div><div class="onboard-point">✓ Reviewed before publication</div></div><div class="panel"><div class="tabs"><button class="chip" data-business-tab="signup">Sign up</button><button class="chip" data-business-tab="login">Log in</button><button class="chip" data-business-tab="manage">My businesses</button><button class="chip" id="hAdminTab" data-business-tab="review" hidden>Review</button></div><div id="businessAuthArea">'+hAccount('signup')+'</div><p id="businessFormFeedback" role="status"></p></div></div></main>'};
function hAccount(which){return '<form id="hAccount" class="onboard-form"><h2>'+(which==='signup'?'Create free account':'Log in')+'</h2><input type="hidden" name="mode" value="'+which+'"><label>Email<input name="email" type="email" class="field" required></label><label>Password<input name="password" type="password" minlength="8" class="field" required></label><button class="btn">'+(which==='signup'?'Register':'Log in')+'</button></form>'}
function hEdit(b={}){let v=k=>safe(b[k]||'');return '<form id="hListing" class="onboard-form"><h2>'+(b.id?'Edit business':'Add a business')+'</h2><input type="hidden" name="id" value="'+v('id')+'"><label>Name<input class="field" name="name" required maxlength="120" minlength="2" value="'+v('name')+'"></label><label>Category<select class="select" name="category">'+cats.map(c=>'<option '+(b.category===c[0]?'selected':'')+'>'+c[0]+'</option>').join('')+'</select></label><label>Based in<select class="select" name="hometown">'+areas.map(a=>'<option '+(b.hometown===a?'selected':'')+'>'+a+'</option>').join('')+'</select></label><label>Service areas (comma-separated)<input name="service_areas" class="field" required value="'+safe((b.service_areas||[]).join(', '))+'"></label><label>Description<textarea name="description" class="field" rows="4">'+v('description')+'</textarea></label><label>Phone<input name="phone" class="field" value="'+v('phone')+'"></label><label>WhatsApp<input name="whatsapp" class="field" value="'+v('whatsapp')+'"></label><label>Website<input name="website" class="field" value="'+v('website')+'"></label><label>Address<input name="address" class="field" value="'+v('address')+'"></label><button class="btn">Save for review</button></form>'}
async function hDashboard(){if(!hInit())return;const u=hAuth.currentUser;if(!u){$('businessAuthArea').innerHTML=hAccount('login');return}
if(!u.emailVerified){$('businessAuthArea').innerHTML='<h2>Verify your email</h2><p>Please confirm the verification link sent to '+safe(u.email)+' before submitting a business.</p><button class="btn" id="hRefreshEmail">I have verified my email</button> <button class="btn line" id="hResendEmail">Resend email</button>';return}
hAdminClaim=(await u.getIdTokenResult()).claims.herilandAdmin===true;const adminTab=$('hAdminTab');if(adminTab)adminTab.hidden=!hAdminClaim;const s=await hDb.collection('heriland_businesses').where('ownerId','==',u.uid).get();hMine=s.docs.map(d=>({id:d.id,...d.data()}));$('businessAuthArea').innerHTML='<h2>My businesses</h2><p class="muted-note">'+safe(u.email)+'</p>'+hMine.map(b=>'<div class="owner-card"><strong>'+safe(b.name)+'</strong><span class="pill">'+safe(b.status)+'</span><button class="btn small line" data-h-edit="'+b.id+'">Edit</button></div>').join('')+'<button class="btn" id="hNew">+ Add business</button> <button class="btn line" id="hLogout">Log out</button>'}
document.addEventListener('click',async e=>{const tab=e.target.closest('[data-business-tab]');if(tab){if(tab.dataset.businessTab==='manage'){try{await hDashboard()}catch(x){hInfo(x.message)}}else if(tab.dataset.businessTab==='review'){try{await hReview()}catch(x){hInfo(x.message)}}else $('businessAuthArea').innerHTML=hAccount(tab.dataset.businessTab)}if(e.target.id==='hNew')$('businessAuthArea').innerHTML=hEdit();const edit=e.target.closest('[data-h-edit]');if(edit){const b=hMine.find(x=>x.id===edit.dataset.hEdit);if(b)$('businessAuthArea').innerHTML=hEdit(b)}if(e.target.id==='hLogout'){await hAuth.signOut();$('businessAuthArea').innerHTML=hAccount('login')}
if(e.target.id==='hRefreshEmail'){await hAuth.currentUser.reload();try{await hDashboard()}catch(x){hInfo(x.message)}}
if(e.target.id==='hResendEmail'){try{await hAuth.currentUser.sendEmailVerification();hInfo('Verification email sent.')}catch(x){hInfo(x.message)}}});
document.addEventListener('submit',async e=>{if(!['hAccount','hListing'].includes(e.target.id))return;e.preventDefault();if(!hInit()){hInfo('Cloud connection unavailable');return}const v=Object.fromEntries(new FormData(e.target).entries());try{if(e.target.id==='hAccount'){if(v.mode==='signup')await hAuth.createUserWithEmailAndPassword(v.email,v.password);else await hAuth.signInWithEmailAndPassword(v.email,v.password);await hDashboard();hInfo('Signed in. You can manage your business.')}else{const u=hAuth.currentUser;if(!u)throw Error('Please log in first');if(!u.emailVerified)throw Error('Verify your email before submitting a business.');const b={ownerId:u.uid,name:v.name.trim(),category:v.category,hometown:v.hometown,service_areas:v.service_areas.split(',').map(s=>s.trim()).filter(Boolean),description:v.description.trim(),phone:v.phone.trim(),whatsapp:v.whatsapp.trim(),website:v.website.trim(),address:v.address.trim(),status:'pending',updatedAt:firebase.firestore.FieldValue.serverTimestamp()};if(v.id){const old=hMine.find(x=>x.id===v.id&&x.ownerId===u.uid);if(!old)throw Error('Business not found');await hDb.collection('heriland_businesses').doc(v.id).update(b)}else await hDb.collection('heriland_businesses').add({...b,createdAt:firebase.firestore.FieldValue.serverTimestamp()});await hDashboard();hInfo('Saved. Pending Heriland review.')}}catch(x){hInfo(x.message)}});

async function hLoadApproved(){
 if(!hInit())return;
 try{
  const snap=await hDb.collection('heriland_businesses').where('status','==','approved').limit(100).get();
  approvedListings=snap.docs.map(d=>{
   const x=d.data();
   return {id:d.id,name:x.name||'',cat:x.category||'',area:x.hometown||'',serves:x.service_areas||[],desc:x.description||'',whatsapp:x.whatsapp||'',img:'https://placehold.co/600x400/f1f5f0/245540?text=Heriland+Business'};
  });
  if(state.page==='explore')render();
 }catch(err){console.warn('Unable to load approved listings',err)}
}
hLoadApproved();

async function hReview(){
 if(!hInit()||!hAuth.currentUser)throw Error('Please log in');
 const claims=(await hAuth.currentUser.getIdTokenResult()).claims;
 if(claims.herilandAdmin!==true)throw Error('Administrator access is required');
 const snap=await hDb.collection('heriland_businesses').where('status','==','pending').limit(100).get();
 const entries=snap.docs.map(d=>({id:d.id,...d.data()}));
 $('businessAuthArea').innerHTML='<h2>Pending review ('+entries.length+')</h2>'+
 (entries.length?entries.map(b=>'<div class="owner-card"><div><strong>'+safe(b.name)+'</strong><p>'+safe(b.category)+' · '+safe(b.hometown)+'</p><p>'+safe(b.description||'')+'</p><small>Service areas: '+(b.service_areas||[]).map(safe).join(', ')+'</small></div><div><button class="btn small" data-h-review="'+b.id+'" data-decision="approved">Approve</button> <button class="btn small line" data-h-review="'+b.id+'" data-decision="rejected">Reject</button></div></div>').join(''):'<p class="muted-note">No pending submissions.</p>');
}
document.addEventListener('click',async e=>{
 const button=e.target.closest('[data-h-review]');
 if(!button)return;
 const decision=button.dataset.decision;
 if(!['approved','rejected'].includes(decision))return;
 if(!hAuth?.currentUser||!((await hAuth.currentUser.getIdTokenResult()).claims.herilandAdmin===true)){hInfo('Not authorized');return}
 button.disabled=true;
 try{
  await hDb.collection('heriland_businesses').doc(button.dataset.hReview).update({status:decision,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
  await hReview();await hLoadApproved();hInfo('Listing '+decision+'.');
 }catch(err){button.disabled=false;hInfo(err.message)}
});
