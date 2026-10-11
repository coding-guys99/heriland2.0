
/* Business onboarding. Configure Heriland Supabase ONLY after the correct project is verified. */
const HERILAND_DB_CONFIG={url:"",publishableKey:""};
let heriDb=null, heriUser=null, heriBusinesses=[];
function heriConfigured(){return !!(HERILAND_DB_CONFIG.url&&HERILAND_DB_CONFIG.publishableKey&&window.supabase)}
function heriConnect(){if(!heriConfigured())return null;if(!heriDb)heriDb=window.supabase.createClient(HERILAND_DB_CONFIG.url,HERILAND_DB_CONFIG.publishableKey);return heriDb}
function hMessage(message,isError=false){return '<div class="notice '+(isError?'error-note':'')+'" role="status">'+safe(message)+'</div>'}
register=function(){
 const ready=heriConfigured();
 return '<main class="wrap"><a href="#" class="back" data-go="home">← Home</a><div class="onboard-layout"><div class="onboard-copy"><span class="eyebrow">HERILAND FOR BUSINESS</span><h1>Grow your business. Stay local.</h1><p>Create a business page for free, manage service areas across Sarawak, and help customers discover your services.</p><div class="onboard-point">✓ Free to submit a listing</div><div class="onboard-point">✓ Your profile stays under your control</div><div class="onboard-point">✓ Listings are reviewed before publishing</div><p class="muted-note">No paid plan or transaction fees are required for this first version.</p></div><div class="panel"><div class="tabs"><button class="chip active" data-auth-tab="signup">Create account</button><button class="chip" data-auth-tab="login">Log in</button><button class="chip" data-auth-tab="manage">My businesses</button></div>'+
 (!ready?hMessage('Registration preview: the correct Heriland database has not been connected. Live registration is currently disabled.',true):'')+
 '<div id="businessAuthArea">'+heriSignupForm(ready)+'</div><div id="businessFormFeedback"></div></div></div></main>'
};
function heriSignupForm(ready){
 return '<h2>Business account</h2><p>Create your account with email and password.</p><form id="heriSignup" class="onboard-form"><label>Email<input required type="email" name="email" class="field" autocomplete="email"></label><label>Password (minimum 8 characters)<input required minlength="8" type="password" name="password" class="field" autocomplete="new-password"></label><button class="btn" '+(!ready?'disabled':'')+'>Create free account</button></form>'
}
function heriLoginForm(ready){
 return '<h2>Welcome back</h2><form id="heriLogin" class="onboard-form"><label>Email<input required type="email" name="email" class="field" autocomplete="email"></label><label>Password<input required type="password" name="password" class="field" autocomplete="current-password"></label><button class="btn" '+(!ready?'disabled':'')+'>Log in</button></form>'
}
function heriListingForm(item){
 const s=item||{};
 const values=field=>safe(s[field]||'');
 return '<form id="heriListing" class="onboard-form"><input type="hidden" name="listingId" value="'+values('id')+'"><h2>'+(item?'Edit business':'Submit a business')+'</h2><p>Submitted listings are reviewed before they are visible in Explore.</p><label>Business name<input class="field" name="name" value="'+values('name')+'" required maxlength="120"></label><label>Category<select class="select" name="category">'+cats.map(c=>'<option '+(s.category===c[0]?'selected':'')+'>'+c[0]+'</option>').join('')+'</select></label><label>Based in<select class="select" name="hometown">'+areas.map(a=>'<option '+(s.hometown===a?'selected':'')+'>'+a+'</option>').join('')+'</select></label><label>Where can you provide service? (comma separated)<input class="field" name="service_areas" value="'+safe((s.service_areas||[]).join(', '))+'" placeholder="Miri, Marudi, Bintulu" required></label><label>About your business<textarea class="field" rows="4" name="description">'+values('description')+'</textarea></label><label>Business phone (optional)<input class="field" name="phone" type="tel" value="'+values('phone')+'"></label><label>WhatsApp number (optional)<input class="field" name="whatsapp" type="tel" value="'+values('whatsapp')+'"></label><label>Website (optional)<input class="field" name="website" type="url" value="'+values('website')+'" placeholder="https://"></label><label>Address (optional)<input class="field" name="address" value="'+values('address')+'"></label><button class="btn">Save business</button></form>'
}
async function heriDashboard(){
 const client=heriConnect();if(!client)return;
 const user=(await client.auth.getUser()).data.user;
 heriUser=user;
 if(!user){$('businessAuthArea').innerHTML=heriLoginForm(true);return}
 const {data,error}=await client.from('business_listings').select('id,name,category,hometown,service_areas,description,phone,whatsapp,website,address,status').eq('owner_id',user.id).order('created_at',{ascending:false});
 if(error){$('businessFormFeedback').innerHTML=hMessage(error.message,true);return}
 heriBusinesses=data||[];
 $('businessAuthArea').innerHTML='<div class="owner-header"><h2>My businesses</h2><button class="btn small line" id="heriLogout">Log out</button></div><p class="muted-note">Signed in as '+safe(user.email)+'</p>'+heriBusinesses.map(x=>'<div class="owner-card"><strong>'+safe(x.name)+'</strong><span class="pill">'+safe(x.status)+'</span><button class="btn small line" data-edit-listing="'+safe(x.id)+'">Edit</button></div>').join('')+'<button class="btn" id="heriNewListing">+ Add a business</button>';
}
document.addEventListener('click',async e=>{
 const tab=e.target.closest('[data-auth-tab]'),edit=e.target.closest('[data-edit-listing]');
 if(tab){let key=tab.dataset.authTab;document.querySelectorAll('[data-auth-tab]').forEach(b=>b.classList.toggle('active',b===tab));$('businessFormFeedback').innerHTML='';if(key==='manage'){await heriDashboard()}else $('businessAuthArea').innerHTML=key==='login'?heriLoginForm(heriConfigured()):heriSignupForm(heriConfigured())}
 if(e.target.closest('#heriNewListing'))$('businessAuthArea').innerHTML=heriListingForm();
 if(edit){const item=heriBusinesses.find(x=>x.id===edit.dataset.editListing);if(item)$('businessAuthArea').innerHTML=heriListingForm(item)}
 if(e.target.closest('#heriLogout')){await heriDb.auth.signOut();heriUser=null;$('businessAuthArea').innerHTML=heriLoginForm(true)}
});
document.addEventListener('submit',async e=>{
 if(!['heriSignup','heriLogin','heriListing'].includes(e.target.id))return;
 e.preventDefault();
 const client=heriConnect();if(!client){$('businessFormFeedback').innerHTML=hMessage('Heriland database connection is not yet configured.',true);return}
 const v=Object.fromEntries(new FormData(e.target).entries());
 let error=null,message='';
 if(e.target.id==='heriSignup'){
 const result=await client.auth.signUp({email:v.email,password:v.password});error=result.error;message='Account created. Check your email for a confirmation link if required, then log in.';
 }else if(e.target.id==='heriLogin'){
 const result=await client.auth.signInWithPassword({email:v.email,password:v.password});error=result.error;if(!error){await heriDashboard();message='Signed in.'}
 }else{
 const user=(await client.auth.getUser()).data.user;
 if(!user){error={message:'Please log in first.'}}else{
 const record={owner_id:user.id,name:v.name.trim(),category:v.category,hometown:v.hometown,service_areas:v.service_areas.split(',').map(x=>x.trim()).filter(Boolean),description:v.description.trim(),phone:v.phone.trim()||null,whatsapp:v.whatsapp.trim()||null,website:v.website.trim()||null,address:v.address.trim()||null};
 let result=v.listingId?await client.from('business_listings').update(record).eq('id',v.listingId):await client.from('business_listings').insert(record);error=result.error;
 if(!error){await heriDashboard();message='Saved. Your listing is not public until it is reviewed.'}
 }}
 $('businessFormFeedback').innerHTML=hMessage(error?error.message:message,!!error);
});
