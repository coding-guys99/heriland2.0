/* Heriland free merchant onboarding — Firebase Auth and Firestore. */
let hAuth,hDb,hMine=[],hAdminClaim=false,hProfile={},hSection='overview';
function hInit(){if(!window.firebase||!window.HERILAND_FIREBASE_CONFIG)return false;if(!firebase.apps.length)firebase.initializeApp(HERILAND_FIREBASE_CONFIG);hAuth=firebase.auth();hDb=firebase.firestore();return true}
function hInfo(msg){const el=document.getElementById('businessFormFeedback');if(el)el.textContent=msg}
function hIsLogged(){return !!(hAuth&&hAuth.currentUser)}
function hWorkspace(){
 const u=hAuth.currentUser;
 const menu=[['overview','⌂','Overview'],['businesses','▣','My Businesses'],['profile','♙','My Profile'],['settings','⚙','Settings']];
 return '<main class="wrap h-workspace"><aside class="h-sidebar"><div class="h-sidebar-label">MY ACCOUNT</div>'+menu.map(m=>'<button type="button" class="h-nav '+(hSection===m[0]?'active':'')+'" data-h-section="'+m[0]+'"><span>'+m[1]+'</span>'+m[2]+'</button>').join('')+(hAdminClaim?'<button class="h-nav '+(hSection==='review'?'active':'')+'" data-h-section="review"><span>✓</span>Business Review</button>':'')+'<button class="h-nav h-signout" id="hLogout">↪ &nbsp; Log out</button></aside><section class="h-main"><div id="businessAuthArea"></div><p id="businessFormFeedback" role="status" aria-live="polite"></p></section></main>';
}
function hGuest(){return '<main class="wrap"><div class="onboard-layout"><div class="onboard-copy"><span class="eyebrow">HERILAND FOR BUSINESS</span><h1>Grow your business. Stay local.</h1><p>Submit your business for free. Reach customers across Sarawak.</p><div class="onboard-point">✓ Free registration</div><div class="onboard-point">✓ Cross-town service areas</div><div class="onboard-point">✓ Reviewed before publication</div></div><div class="panel"><div class="tabs"><button class="chip" data-business-tab="signup">Sign up</button><button class="chip" data-business-tab="login">Log in</button></div><div id="businessAuthArea">'+hAccount('signup')+'</div><p id="businessFormFeedback" role="status" aria-live="polite"></p></div></div></main>'}
register=function(){return hIsLogged()?hWorkspace():hGuest()};
function hRerender(){if(state.page!=='register')return;const workspace=document.querySelector('.h-workspace');if(hIsLogged()&&workspace){workspace.outerHTML=hWorkspace();hContent();return;}render();}
function hProfileForm(){
 const p=hProfile||{};const value=k=>safe(p[k]||'');
 return '<div class="h-page-head"><div><span class="eyebrow">ACCOUNT</span><h1>My Profile</h1><p>Keep your private account details up to date.</p></div></div><div class="h-panel"><form class="onboard-form" id="hProfileForm"><label>Account type<select class="select" name="type"><option value="individual" '+(p.type!=='company'?'selected':'')+'>Individual / Sole operator</option><option value="company" '+(p.type==='company'?'selected':'')+'>Registered company</option></select></label><label>Contact person<input class="field" name="name" maxlength="100" value="'+value('name')+'" placeholder="Your name" required></label><label>Contact number<input type="tel" class="field" name="phone" maxlength="30" value="'+value('phone')+'" placeholder="+60 12 345 6789" required></label><label>Company name (optional)<input class="field" name="company" maxlength="120" value="'+value('company')+'"></label><label>SSM registration number (optional)<input class="field" name="ssm" maxlength="60" value="'+value('ssm')+'"></label><label>Account email (private)<input class="field" disabled value="'+safe(hAuth.currentUser.email)+'"></label><button class="btn">Save Profile</button></form></div>';
}
function hStatus(b){const t=b.status||'pending';return '<span class="h-status '+safe(t)+'">'+safe(t==='approved'?'Published':t==='pending'?'Pending review':'Rejected')+'</span>'}
function hBizRows(){return hMine.length?hMine.map(b=>'<div class="h-business-row"><div class="h-business-icon">▣</div><div class="h-business-info"><strong>'+safe(b.name)+'</strong><small>'+safe(b.category)+' · '+safe(b.hometown)+'</small></div>'+hStatus(b)+'<button class="btn small line" data-h-edit="'+safe(b.id)+'">Edit</button></div>').join(''):'<div class="h-empty"><div class="h-business-icon">▣</div><h3>No businesses yet</h3><p>Add your first business to reach customers across Sarawak.</p><button class="btn" id="hNew">+ Add Business</button></div>'}
function hContent(){
 const root=$('businessAuthArea');if(!root)return;
 const u=hAuth.currentUser;if(!u)return;
 const name=hProfile.name||u.displayName||u.email.split('@')[0];
 if(hSection==='profile'){root.innerHTML=hProfileForm();return}
 if(hSection==='settings'){root.innerHTML='<div class="h-page-head"><div><span class="eyebrow">ACCOUNT</span><h1>Settings</h1><p>Manage your account and sign-in details.</p></div></div><div class="h-panel"><h3>Sign-in email</h3><p>'+safe(u.email)+'</p><p class="muted-note">Your login email is private and will not be displayed on business listings.</p><button class="btn line" id="hResetPassword">Send password reset email</button></div>';return}
 if(hSection==='review'){hReview();return}
 if(hSection==='businesses'){root.innerHTML='<div class="h-page-head"><div><span class="eyebrow">YOUR LISTINGS</span><h1>My Businesses</h1><p>Manage all your business listings in one place.</p></div><button class="btn" id="hNew">+ Add Business</button></div><div class="h-panel">'+hBizRows()+'</div>';return}
 if(hSection==='edit'){root.innerHTML=hEdit(hMine.find(b=>b.id===hEditing)||{});return}
 const total=hMine.length,pending=hMine.filter(b=>b.status==='pending').length,approved=hMine.filter(b=>b.status==='approved').length;
 root.innerHTML='<div class="h-page-head"><div><span class="eyebrow">MY ACCOUNT</span><h1>Welcome back, '+safe(name)+'!</h1><p>Manage your account and businesses here.</p></div><button class="btn" id="hNew">+ Add Business</button></div><div class="h-stats"><div class="h-stat"><span>▣</span><div><small>Total Businesses</small><strong>'+total+'</strong></div></div><div class="h-stat"><span>◷</span><div><small>Pending Review</small><strong>'+pending+'</strong></div></div><div class="h-stat"><span>✓</span><div><small>Published</small><strong>'+approved+'</strong></div></div></div><h2 class="h-section-title">Next Steps</h2><div class="h-next"><div class="h-panel"><h3>Complete your profile</h3><p>Save your contact and company details to speed up business listings.</p><button class="btn line" data-h-section="profile">Manage Profile</button></div><div class="h-panel"><h3>Add your business</h3><p>List your business and reach customers across Sarawak.</p><button class="btn" id="hNew">+ Add Business</button></div></div><div class="h-panel"><div class="h-panel-head"><h2>My Businesses</h2><button class="h-link" data-h-section="businesses">View all →</button></div>'+hBizRows()+'</div>';
}
let hEditing='';
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
 '<label>Category *<select id="hCategory" class="select" name="category">'+cats.map(c=>'<option '+(b.category===c[0]?'selected':'')+'>'+safe(c[0])+'</option>').join('')+'<option value="Other" '+(b.category==='Other'||(b.category&&!cats.some(c=>c[0]===b.category))?'selected':'')+'>Other</option></select></label>'+
 '<label id="hOtherCategoryField" '+(b.category==='Other'||(b.category&&!cats.some(c=>c[0]===b.category))?'':'hidden')+'>Specify category *<input id="hOtherCategory" class="field" name="other_category" maxlength="80" value="'+safe(b.category&&!cats.some(c=>c[0]===b.category)?b.category:'')+'" placeholder="e.g. Pet grooming"></label>'+
 '<label>Based in *<select id="hTown" class="select" name="hometown">'+areas.map(t=>'<option '+(town===t?'selected':'')+'>'+safe(t)+'</option>').join('')+'</select></label>'+
 '<label>Customer contact number *<input class="field" name="phone" type="tel" required inputmode="tel" maxlength="30" value="'+safe(b.phone||hProfile.phone||'')+'" placeholder="+60 12 345 6789"></label>'+
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
async function hDashboard(){
 if(!hInit())return;const u=hAuth.currentUser;if(!u){hRerender();return}
 hAdminClaim=(await u.getIdTokenResult()).claims.herilandAdmin===true;
 try{const p=await hDb.collection('heriland_profiles').doc(u.uid).get();hProfile=p.exists?p.data():{}}catch(e){console.warn('Profile unavailable',e);hProfile={}}
 const snap=await hDb.collection('heriland_businesses').where('ownerId','==',u.uid).get();hMine=snap.docs.map(d=>({id:d.id,...d.data()}));hRerender();
}
document.addEventListener('click',async e=>{
 const tab=e.target.closest('[data-business-tab]');if(tab){const area=$('businessAuthArea');if(area)area.innerHTML=hAccount(tab.dataset.businessTab);hInfo('');return}
 const section=e.target.closest('[data-h-section]');if(section){hSection=section.dataset.hSection;hRerender();return}
 if(e.target.id==='hForgotPassword'){const area=$('businessAuthArea');if(area)area.innerHTML=hAccount(e.target.textContent.includes('Back')?'login':'reset');hInfo('');return}
 if(e.target.id==='hNew'){hSection='edit';hEditing='';hRerender();return}
 const edit=e.target.closest('[data-h-edit]');if(edit){hSection='edit';hEditing=edit.dataset.hEdit;hRerender();return}
 if(e.target.id==='hLogout'){await hAuth.signOut();hSection='overview';hProfile={};hMine=[];hRerender();return}
 if(e.target.id==='hResetPassword'){try{await hAuth.sendPasswordResetEmail(hAuth.currentUser.email);hInfo('Password reset email requested. Check your inbox and spam folder.')}catch(x){hInfo(x.message)}}
});
document.addEventListener('change',e=>{if(e.target.id==='hSameWhatsapp'){const label=$('hWhatsappField');if(label)label.hidden=e.target.checked;}if(e.target.id==='hCategory'){const field=$('hOtherCategoryField');const input=$('hOtherCategory');if(field)field.hidden=e.target.value!=='Other';if(input)input.required=e.target.value==='Other';}if(e.target.id==='hTown'){const form=e.target.closest('form');const field=form?.elements?.namedItem('service_areas');if(field&&(!field.value.trim()||areas.includes(field.value.trim())))field.value=e.target.value;}});
document.addEventListener('submit',async e=>{if(!['hAccount','hListing','hProfileForm'].includes(e.target.id))return;e.preventDefault();if(!hInit()){hInfo('Cloud connection unavailable');return}const v=Object.fromEntries(new FormData(e.target).entries());try{if(e.target.id==='hProfileForm'){const u=hAuth.currentUser;if(!u)throw Error('Please log in');const p={type:v.type==='company'?'company':'individual',name:v.name.trim(),phone:v.phone.trim(),company:v.company.trim(),ssm:v.ssm.trim(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()};await hDb.collection('heriland_profiles').doc(u.uid).set(p,{merge:true});const check=await hDb.collection('heriland_profiles').doc(u.uid).get({source:'server'});if(!check.exists)throw Error('Profile was not found after saving.');hProfile=check.data();hSection='profile';hRerender();hInfo('Profile saved to Heriland Cloud successfully.');}else if(e.target.id==='hAccount'){if(v.mode==='reset'){await hAuth.sendPasswordResetEmail(v.email.trim());hInfo('If this account can receive a password reset, an email has been sent. Check your inbox and spam folder.')}else{if(v.mode==='signup'){await hAuth.createUserWithEmailAndPassword(v.email.trim(),v.password)}else await hAuth.signInWithEmailAndPassword(v.email.trim(),v.password);await hDashboard();hInfo(v.mode==='signup'?'Account created. Add your business below.':'Signed in.')}}else{const u=hAuth.currentUser;if(!u)throw Error('Please log in first');const contact=v.phone.trim();const digits=contact.replace(/[^0-9]/g,'');if(digits.length<9||digits.length>15)throw Error('Enter a valid phone number (9–15 digits), preferably with +60.');const serviceAreas=(v.service_areas||v.hometown).split(',').map(s=>s.trim()).filter(Boolean);const category=v.category==='Other'?(v.other_category||'').trim():v.category;if(!category)throw Error('Please specify a category.');const b={ownerId:u.uid,name:v.name.trim(),category,hometown:v.hometown,service_areas:[...new Set(serviceAreas.length?serviceAreas:[v.hometown])],description:v.description.trim(),phone:contact,whatsapp:v.same_whatsapp==='on'?contact:(v.whatsapp||'').trim(),website:v.website.trim(),address:v.address.trim(),status:'pending',updatedAt:firebase.firestore.FieldValue.serverTimestamp()};if(v.id){const old=hMine.find(x=>x.id===v.id&&x.ownerId===u.uid);if(!old)throw Error('Business not found');await hDb.collection('heriland_businesses').doc(v.id).update(b)}else await hDb.collection('heriland_businesses').add({...b,createdAt:firebase.firestore.FieldValue.serverTimestamp()});hSection='businesses';await hDashboard();hInfo('Saved. Pending Heriland review.')}}catch(x){console.error('Heriland save failed',x);hInfo(['auth/invalid-credential','auth/wrong-password','auth/user-not-found'].includes(x.code)?'Unable to sign in. Check your email and password, or use Forgot password to reset it.':x.message)}});

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

// Restore account view when Firebase finishes checking persisted login.
if(hInit())hAuth.onAuthStateChanged(user=>{if(state.page==='register'){if(user)hDashboard().catch(err=>hInfo(err.message));else hRerender();}});
