/* Heriland free merchant onboarding — Firebase Auth and Firestore. */
let hAuth,hDb,hMine=[],hAdminClaim=false;
function hInit(){if(!window.firebase||!window.HERILAND_FIREBASE_CONFIG)return false;if(!firebase.apps.length)firebase.initializeApp(HERILAND_FIREBASE_CONFIG);hAuth=firebase.auth();hDb=firebase.firestore();return true}
function hInfo(msg){document.getElementById('businessFormFeedback').textContent=msg}
register=function(){return '<main class="wrap"><div class="onboard-layout"><div class="onboard-copy"><span class="eyebrow">HERILAND FOR BUSINESS</span><h1>Grow your business. Stay local.</h1><p>Submit your business for free. Reach customers across Sarawak.</p><div class="onboard-point">✓ Free registration</div><div class="onboard-point">✓ Cross-town service areas</div><div class="onboard-point">✓ Reviewed before publication</div></div><div class="panel"><div class="tabs"><button class="chip" data-business-tab="signup">Sign up</button><button class="chip" data-business-tab="login">Log in</button><button class="chip" data-business-tab="manage">My businesses</button><button class="chip" id="hAdminTab" data-business-tab="review" hidden>Review</button></div><div id="businessAuthArea">'+hAccount('signup')+'</div><p id="businessFormFeedback" role="status"></p></div></div></main>'};
function hAccount(which){
const reset=which==='reset',signup=which==='signup';
return '<form id="hAccount" class="onboard-form"><h2>'+(reset?'Reset password':signup?'Create free account':'Log in')+'</h2><input type="hidden" name="mode" value="'+which+'"><label>Email<input name="email" type="email" class="field" autocomplete="email" required></label>'+(reset?'':'<label>Password<input name="password" type="password" minlength="8" class="field" autocomplete="'+(signup?'new-password':'current-password')+'" required></label>')+'<button class="btn">'+(reset?'Send password reset email':signup?'Register':'Log in')+'</button>'+(signup?'':'<button type="button" class="text-btn" id="hForgotPassword">'+(reset?'Back to log in':'Forgot password?')+'</button>')+'</form>'
}
function hEdit(b={}){
 const v=k=>safe(b[k]||'');
 const currentTown=b.hometown||state.area||'Miri';
 const town=areas.includes(currentTown)?currentTown:'Miri';
 const whatsappSame=!b.id||(!b.whatsapp||b.whatsapp===b.phone);
 const serviceAreas=(b.service_areas||[town]).join(', ');
 const more=!!b.id;
 return '<form id="hListing" class="onboard-form">'+
 '<div><h2>'+(b.id?'Edit business profile':'Quick business setup')+'</h2><p class="muted-note">Start with the essentials. Add more details anytime.</p></div>'+
 '<input type="hidden" name="id" value="'+v('id')+'">'+
 '<label>Account email (private)<input class="field" value="'+safe(hAuth?.currentUser?.email||'')+'" disabled></label>'+
 '<label>Business name *<input class="field" name="name" required maxlength="120" minlength="2" value="'+v('name')+'" placeholder="Your business name"></label>'+
 '<label>Category *<select class="select" name="category">'+cats.map(c=>'<option '+(b.category===c[0]?'selected':'')+'>'+safe(c[0])+'</option>').join('')+'</select></label>'+
 '<label>Based in *<select id="hTown" class="select" name="hometown">'+areas.map(t=>'<option '+(town===t?'selected':'')+'>'+safe(t)+'</option>').join('')+'</select></label>'+
 '<label>Customer contact number *<input class="field" name="phone" type="tel" required inputmode="tel" maxlength="30" value="'+v('phone')+'" placeholder="+60 12 345 6789"></label>'+
 '<label class="h-check"><input type="checkbox" id="hSameWhatsapp" name="same_whatsapp" '+(whatsappSame?'checked':'')+'> Use this number for WhatsApp</label>'+
 '<label id="hWhatsappField" '+(whatsappSame?'hidden':'')+'>WhatsApp number (optional)<input class="field" name="whatsapp" type="tel" inputmode="tel" maxlength="30" value="'+(whatsappSame?'':v('whatsapp'))+'" placeholder="+60 12 345 6789"></label>'+
 '<label>Short description<textarea name="description" class="field" rows="2" maxlength="1000" placeholder="What does your business offer?">'+v('description')+'</textarea></label>'+
 '<details class="h-extra" '+(more?'open':'')+'><summary>More business details (optional)</summary><div class="h-extra-fields">'+
 '<label>Service areas (comma-separated)<input name="service_areas" class="field" value="'+safe(serviceAreas)+'" placeholder="Miri, Marudi, Bekenu"></label>'+
 '<label>Website<input name="website" type="url" class="field" value="'+v('website')+'" placeholder="https://"></label>'+
 '<label>Business address<input name="address" class="field" value="'+v('address')+'" placeholder="Optional — leave blank for mobile services"></label>'+
 '</div></details>'+
 '<p class="muted-note">Your contact number will be shown publicly when approved. Your login email stays private.</p>'+
 '<button class="btn">Save for review</button></form>';
}
async function hDashboard(){if(!hInit())return;const u=hAuth.currentUser;if(!u){$('businessAuthArea').innerHTML=hAccount('login');return}
hAdminClaim=(await u.getIdTokenResult()).claims.herilandAdmin===true;const adminTab=$('hAdminTab');if(adminTab)adminTab.hidden=!hAdminClaim;const s=await hDb.collection('heriland_businesses').where('ownerId','==',u.uid).get();hMine=s.docs.map(d=>({id:d.id,...d.data()}));$('businessAuthArea').innerHTML='<h2>My businesses</h2><p class="muted-note">'+safe(u.email)+'</p>'+hMine.map(b=>'<div class="owner-card"><strong>'+safe(b.name)+'</strong><span class="pill">'+safe(b.status)+'</span><button class="btn small line" data-h-edit="'+b.id+'">Edit</button></div>').join('')+'<button class="btn" id="hNew">+ Add business</button> <button class="btn line" id="hLogout">Log out</button>'}
document.addEventListener('click',async e=>{const tab=e.target.closest('[data-business-tab]');if(tab){if(tab.dataset.businessTab==='manage'){try{await hDashboard()}catch(x){hInfo(x.message)}}else if(tab.dataset.businessTab==='review'){try{await hReview()}catch(x){hInfo(x.message)}}else $('businessAuthArea').innerHTML=hAccount(tab.dataset.businessTab)}if(e.target.id==='hForgotPassword'){$('businessAuthArea').innerHTML=hAccount(e.target.textContent.includes('Back')?'login':'reset');hInfo('')}
if(e.target.id==='hNew')$('businessAuthArea').innerHTML=hEdit();const edit=e.target.closest('[data-h-edit]');if(edit){const b=hMine.find(x=>x.id===edit.dataset.hEdit);if(b)$('businessAuthArea').innerHTML=hEdit(b)}if(e.target.id==='hLogout'){await hAuth.signOut();$('businessAuthArea').innerHTML=hAccount('login')}
});
document.addEventListener('change',e=>{if(e.target.id==='hSameWhatsapp'){const label=$('hWhatsappField');if(label)label.hidden=e.target.checked;}if(e.target.id==='hTown'){const form=e.target.closest('form');const field=form?.elements?.namedItem('service_areas');if(field&&(!field.value.trim()||areas.includes(field.value.trim())))field.value=e.target.value;}});
document.addEventListener('submit',async e=>{if(!['hAccount','hListing'].includes(e.target.id))return;e.preventDefault();if(!hInit()){hInfo('Cloud connection unavailable');return}const v=Object.fromEntries(new FormData(e.target).entries());try{if(e.target.id==='hAccount'){if(v.mode==='reset'){await hAuth.sendPasswordResetEmail(v.email.trim());hInfo('If this account can receive a password reset, an email has been sent. Check your inbox and spam folder.')}else{if(v.mode==='signup'){await hAuth.createUserWithEmailAndPassword(v.email.trim(),v.password)}else await hAuth.signInWithEmailAndPassword(v.email.trim(),v.password);await hDashboard();hInfo(v.mode==='signup'?'Account created. Add your business below.':'Signed in.')}}else{const u=hAuth.currentUser;if(!u)throw Error('Please log in first');const contact=v.phone.trim();const digits=contact.replace(/[^0-9]/g,'');if(digits.length<9||digits.length>15)throw Error('Enter a valid phone number (9–15 digits), preferably with +60.');const serviceAreas=(v.service_areas||v.hometown).split(',').map(s=>s.trim()).filter(Boolean);const b={ownerId:u.uid,name:v.name.trim(),category:v.category,hometown:v.hometown,service_areas:[...new Set(serviceAreas.length?serviceAreas:[v.hometown])],description:v.description.trim(),phone:contact,whatsapp:v.same_whatsapp==='on'?contact:(v.whatsapp||'').trim(),website:v.website.trim(),address:v.address.trim(),status:'pending',updatedAt:firebase.firestore.FieldValue.serverTimestamp()};if(v.id){const old=hMine.find(x=>x.id===v.id&&x.ownerId===u.uid);if(!old)throw Error('Business not found');await hDb.collection('heriland_businesses').doc(v.id).update(b)}else await hDb.collection('heriland_businesses').add({...b,createdAt:firebase.firestore.FieldValue.serverTimestamp()});await hDashboard();hInfo('Saved. Pending Heriland review.')}}catch(x){hInfo(['auth/invalid-credential','auth/wrong-password','auth/user-not-found'].includes(x.code)?'Unable to sign in. Check your email and password, or use Forgot password to reset it.':x.message)}});

async function hLoadApproved(){
 if(!hInit())return;
 try{
  const snap=await hDb.collection('heriland_businesses').where('status','==','approved').limit(100).get();
  approvedListings=snap.docs.map(d=>{
   const x=d.data();
   return {id:d.id,name:x.name||'',cat:x.category||'',area:x.hometown||'',serves:x.service_areas||[],desc:x.description||'',whatsapp:x.whatsapp||'',phone:x.phone||'',img:'https://placehold.co/600x400/f1f5f0/245540?text=Heriland+Business'};
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
