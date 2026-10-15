(function(){
var KEY='pws_consent_doitall',VER='1.0';
function get(){try{var v=JSON.parse(localStorage.getItem(KEY));return v&&v.v===VER?v:null}catch(e){return null}}
function save(c){try{localStorage.setItem(KEY,JSON.stringify({v:VER,choice:c,at:new Date().toISOString()}))}catch(e){}}
var box=document.createElement('div');box.className='cc';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-modal','false');box.setAttribute('aria-labelledby','ccT');
box.innerHTML='<h2 id="ccT">Your privacy</h2><p>This site uses no analytics, ads, maps or tracking. It only remembers this choice. Pick what you prefer.</p>'+
'<div class="btns"><button type="button" class="pri" data-c="all">Accept all</button><button type="button" class="pri" data-c="reject">Reject non-essential</button><button type="button" data-c="manage">Manage choices</button></div>'+
'<div class="manage" hidden><label><input type="checkbox" disabled checked> Essential (remembers this choice)</label><label style="margin-top:8px"><input type="checkbox" id="ccOpt"> Optional tools (none are used on this site today)</label><div class="btns"><button type="button" class="pri" data-c="save">Save choices</button></div></div>';
document.body.appendChild(box);
var last=null;
function open(){last=document.activeElement;box.hidden=false;box.querySelector('button').focus()}
function close(){box.hidden=true;if(last&&last.focus)last.focus()}
box.addEventListener('click',function(e){var c=e.target.getAttribute&&e.target.getAttribute('data-c');if(!c)return;
 if(c==='manage'){box.querySelector('.manage').hidden=false;document.getElementById('ccOpt').focus();return}
 save(c==='save'?(document.getElementById('ccOpt').checked?'all':'reject'):c);close()});
box.addEventListener('keydown',function(e){if(e.key==='Escape'){close()}});
document.querySelectorAll('[data-cookie-settings]').forEach(function(b){b.addEventListener('click',function(){box.querySelector('.manage').hidden=true;open()})});
if(!get())open();
})();
