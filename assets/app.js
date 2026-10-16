(function(){
  // copy buttons
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var t=b.getAttribute('data-copy'),done=function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy number'},1600)};
      try{navigator.clipboard.writeText(t).then(done,function(){sel(b)})}catch(e){sel(b)}
    });
  });
  function sel(b){var a=b.previousElementSibling;var r=document.createRange();r.selectNodeContents(a);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected, copy it'}

  // thermostat
  var cx=120,cy=120,R=88,start=135,sweep=270;
  function pt(a,r){a=(a-90)*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]}
  var ticks=document.getElementById('ticks'),ns='http://www.w3.org/2000/svg';
  for(var i=0;i<=54;i++){var a=-135+i*5,p1=pt(a,96),p2=pt(a,i%9===0?86:91);var l=document.createElementNS(ns,'line');l.setAttribute('x1',p1[0]);l.setAttribute('y1',p1[1]);l.setAttribute('x2',p2[0]);l.setAttribute('y2',p2[1]);ticks.appendChild(l)}
  function arc(frac){var a0=-135,a1=-135+sweep*frac,s=pt(a0,R),e=pt(a1,R),large=(a1-a0)>180?1:0;return'M'+s[0]+' '+s[1]+' A'+R+' '+R+' 0 '+large+' 1 '+e[0]+' '+e[1]}
  var modes={heat:{t:68,word:'Furnace',lede:'Furnace and air conditioning repair and installation for Beavercreek, Fairborn and the Dayton area. Locally owned by Erik Steinbrugge. Call him direct.',label:'Heat'},
             cool:{t:72,word:'AC',lede:'Air conditioning and furnace repair and installation for Beavercreek, Fairborn and the Dayton area. Locally owned by Erik Steinbrugge. Call him direct.',label:'Cool'}};
  function setMode(m){
    var d=modes[m];document.body.classList.toggle('cool',m==='cool');
    document.getElementById('modeWord').textContent=d.word;
    document.getElementById('lede').textContent=d.lede;
    document.getElementById('temp').textContent=d.t+'°';
    document.getElementById('setTxt').textContent=(m==='cool'?'COOL':'HEAT')+' SET TO';
    document.getElementById('statMode').textContent=d.label;document.getElementById('statNote').textContent=m==='cool'?'Summer mode. Flip it back for heating season.':'Heating season in Beavercreek. Flip it to see the summer version.';
    document.getElementById('dialT').textContent='Thermostat dial set to '+d.t+' degrees, '+d.label.toLowerCase()+' mode';
    document.getElementById('arc').setAttribute('d',arc((d.t-50)/40));
    document.getElementById('bHeat').setAttribute('aria-pressed',m==='heat');
    document.getElementById('bCool').setAttribute('aria-pressed',m==='cool');
  }
  document.getElementById('bHeat').onclick=function(){setMode('heat')};
  document.getElementById('bCool').onclick=function(){setMode('cool')};
  var mo=new Date().getMonth();setMode(mo>=4&&mo<=8?'cool':'heat');

  // troubleshooter
  var S=[
   {k:'Furnace is blowing cold air',u:'Same day if it\'s cold out',h:'Blowing cold',steps:['Check the thermostat says HEAT and the fan says AUTO, not ON.','Pull the filter. If you can\'t see light through it, replace it.','Make sure the furnace door panel is pushed in all the way. The furnace won\'t fire with it loose.'],why:'Still cold? Common causes are a dirty flame sensor, a failed igniter or an overheating limit switch. All quick fixes for a tech.'},
   {k:'AC runs but the house won\'t cool',u:'Call soon',h:'Running, not cooling',steps:['Check the filter first. A clogged one is the #1 cause.','Go outside. Is the big unit\'s fan spinning?','See ice on the copper lines? Switch the system OFF and run only the fan so it can thaw.'],why:'Usual suspects: a failed capacitor, a refrigerant leak or a dirty coil. Running a frozen system can damage the compressor.'},
   {k:'Nothing turns on at all',u:'Check these first',h:'Totally dead',steps:['Swap the thermostat batteries if it has them.','Check the breaker panel for a tripped furnace or AC breaker.','Find the light-style switch on or near the furnace and make sure it\'s ON.'],why:'If power is fine and it still won\'t start, it may be a control board, a safety switch or a blown low-voltage fuse.'},
   {k:'Turns on and off every few minutes',u:'Book a visit',h:'Short cycling',steps:['Replace the filter.','Make sure supply vents and returns aren\'t blocked by furniture or rugs.','Note how long each run lasts. It helps the diagnosis.'],why:'Short cycling wears out parts fast. Causes range from a dirty flame sensor or low refrigerant to a system that\'s the wrong size for the house.'},
   {k:'Strange noise or burning smell',u:'Depends on the smell',h:'Noise or smell',steps:['A dusty smell for the first hour of the season\'s first heat is normal.','A burning plastic or electrical smell is not. Turn the system off at the thermostat.','Banging, squealing or grinding? Turn it off and call before it gets worse.'],why:'Squeals point to a motor or belt, booms to delayed ignition, rattles to loose panels or a failing blower.'},
   {k:'I smell gas or the CO alarm is going off',u:'Emergency',danger:true,h:'Get out first',steps:['Do not flip light switches or use anything that could spark.','Get everyone, pets too, out of the house right away.','From outside, call 911 or your gas utility\'s emergency line.'],why:'Once the gas company or fire department says it\'s safe, call Erik to find and fix the cause.'}
  ];
  var list=document.getElementById('symptoms'),ans=document.getElementById('answer');
  S.forEach(function(s,i){var b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.id='sy'+i;b.setAttribute('aria-controls','answer');b.textContent=s.k;if(s.danger)b.className='danger';b.onclick=function(){show(i)};
    b.onkeydown=function(e){if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();var n=(i+(e.key==='ArrowDown'?1:S.length-1))%S.length;show(n);document.getElementById('sy'+n).focus()}};list.appendChild(b)});
  function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}
  function show(i){var s=S[i];
    list.querySelectorAll('button').forEach(function(b,j){b.setAttribute('aria-selected',j===i);b.tabIndex=j===i?0:-1});
    ans.setAttribute('aria-labelledby','sy'+i);
    ans.innerHTML='<span class="ulabel'+(s.danger?' red':'')+'">'+esc(s.u)+'</span><h3>'+esc(s.h)+'</h3><ol>'+s.steps.map(function(x){return'<li>'+esc(x)+'</li>'}).join('')+'</ol><p class="why">'+esc(s.why)+'</p><p class="cta">'+(s.danger?'Safe and cleared? Then call Erik at 937-232-6314.':'Still stuck? Call Erik at 937-232-6314 and tell him what you saw.')+'</p>'}
  show(0);

  // service area map (straight-line, equirectangular at ~39.7N)
  var home=[39.7352,-84.0411];
  var T=[['Beavercreek',39.7092,-84.0633,1],['Fairborn',39.8209,-84.0194,1],['Wright-Patt area',39.8261,-84.0483,1],['Dayton',39.7589,-84.1916,1],['Xenia',39.6848,-83.9297,0],['Kettering',39.6895,-84.1688,0],['Bellbrook',39.6356,-84.0708,0],['Huber Heights',39.8439,-84.1247,0]];
  var svg=document.getElementById('map'),W=600,H=480,ox=300,oy=250,sc=22;
  function xy(lat,lon){return[ox+(lon-home[1])*53.2*sc,oy-(lat-home[0])*69*sc]}
  function el(t,a,txt){var e=document.createElementNS(ns,t);for(var k in a)e.setAttribute(k,a[k]);if(txt)e.textContent=txt;svg.appendChild(e);return e}
  el('rect',{x:0,y:0,width:W,height:H,fill:'#f5f6f1'});
  [10,5].forEach(function(m){el('circle',{cx:ox,cy:oy,r:m*sc,fill:m===5?'#dfe9da':'#eef3eb',stroke:'#9dbf95','stroke-width':2,'stroke-dasharray':m===10?'6 6':''});el('text',{x:ox+m*sc*0.71+4,y:oy-m*sc*0.71-4,'font-size':16,'font-weight':700,fill:'#3f6a3c','font-family':'Barlow, Arial, sans-serif'},m+' mi')});
  var rows=[];
  T.forEach(function(t){var p=xy(t[1],t[2]),d=Math.hypot((t[2]-home[1])*53.2,(t[1]-home[0])*69);rows.push([t[0],d,t[3]]);
    el('circle',{cx:p[0],cy:p[1],r:t[3]?7:5,fill:t[3]?'#222523':'#ffffff',stroke:'#222523','stroke-width':2});
    var L={'Huber Heights':['end',-12],'Wright-Patt area':['end',-6],'Fairborn':['start',8],'Dayton':['start',6],'Beavercreek':['start',7],'Xenia':['start',6],'Kettering':['start',6],'Bellbrook':['start',6]}[t[0]],right=L[0]==='start', lbl=el('text',{x:p[0]+(right?12:-12),y:p[1]+L[1],'text-anchor':L[0],'font-size':19,'font-weight':t[3]?700:500,fill:t[3]?'#1d201e':'#5a605b','font-family':'Barlow, Arial, sans-serif'},t[0]+(t[3]?'':' (ask)'));});
  el('rect',{x:ox-9,y:oy-9,width:18,height:18,fill:'#9dbf95',stroke:'#222523','stroke-width':2.5,transform:'rotate(45 '+ox+' '+oy+')'});
  el('text',{x:ox+16,y:oy+6,'font-size':16,'font-weight':700,fill:'#1d201e','font-family':'Barlow Condensed, Arial Narrow, sans-serif'},'SHOP · LANTZ RD');
  el('text',{x:W-14,y:24,'text-anchor':'end','font-size':13,'font-weight':700,fill:'#5a605b','font-family':'Barlow, Arial, sans-serif'},'N ↑');
  rows.sort(function(a,b){return a[1]-b[1]});
  document.getElementById('towns').innerHTML=rows.map(function(r){return'<li class="'+(r[2]?'':'ask')+'"><span>'+r[0]+(r[2]?'':' <span class="tbc">(ask)</span>')+'</span><span class="d">'+r[1].toFixed(1)+' mi</span></li>'}).join('');

  // demo form
  document.getElementById('req').addEventListener('submit',function(e){e.preventDefault();var f=e.target,m=document.getElementById('formMsg');
    if(!f.name.value.trim()||!f.phone.value.trim()){m.textContent='Please add your name and phone number so Erik can call you back.';(f.name.value.trim()?f.phone:f.name).focus();return}
    m.textContent='Demo only: on the real site, this request would go straight to Erik. For now, please call 937-232-6314.'});
})();
