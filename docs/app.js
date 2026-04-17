'use strict';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const CELL = 3;
const PR   = 130;
const SIZE = PR * 2 + 1; // 261 — equirectangular terrain grid

const T = { ROCK:1, OCEAN:2, VEGETATION:3, LAVA:4, ICE:5, SAND:6, CRATER:7, IRRADIATED:8 };

// Light direction (upper-left, toward viewer) — normalized
const LX = -0.32, LY = 0.48, LZ = 0.82;

// ─── CANVAS ──────────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
let W, H, CX, CY;

const off    = document.createElement('canvas');
off.width    = SIZE;
off.height   = SIZE;
const offCtx = off.getContext('2d');
const planetImg = new ImageData(SIZE, SIZE);

// ─── STATE ───────────────────────────────────────────────────────────────────
let terrain   = new Uint8Array(SIZE * SIZE);
let noiseMap  = new Float32Array(SIZE * SIZE);
let totalCells = SIZE * SIZE;
let destroyedCells = 0;
let floodLevel = 0;
let iceSpreading = false;
let planetDirty  = true;

let rotX = 0, rotY = 0; // 3-D rotation angles
let rotating = false, rotLastX = 0, rotLastY = 0;

let stars      = [];
let particles  = [];
let meteors    = [];
let blackHoles = [];
let laserSegs  = [];
let shakeAmt   = 0, shakeX = 0, shakeY = 0;
let cloudAngle = 0;
let nukeFlash  = null;

let selectedPower = 'meteor';
let mousePos  = { x: 0, y: 0 };
let isDown    = false;
let laserLast = null;
let iceFrame  = 0;

const POWER_COLORS = {
  meteor:'#ff8844', laser:'#ff3333', nuke:'#ffff44',
  blackhole:'#bb99ff', flood:'#44aaff', volcano:'#ff5500',
  ice:'#aaddff', restore:'#44ff88',
};

// ─── PERLIN NOISE ────────────────────────────────────────────────────────────
const P = new Uint8Array(512);
{ const t=[...Array(256).keys()];
  for(let i=255;i>0;i--){const j=0|Math.random()*(i+1);[t[i],t[j]]=[t[j],t[i]];}
  for(let i=0;i<256;i++) P[i]=P[i+256]=t[i]; }

function _f(t){return t*t*t*(t*(t*6-15)+10);}
function _l(a,b,t){return a+(b-a)*t;}
function _g(h,x,y){const u=h<2?x:y,v=h<2?y:x;return(h&1?-u:u)+(h&2?-v:v);}

function perlin(x,y){
  const xi=x&255|0, yi=y&255|0;
  const xf=x-(x|0), yf=y-(y|0);
  const u=_f(xf), v=_f(yf);
  const aa=P[P[xi]+yi],ab=P[P[xi]+yi+1],ba=P[P[xi+1]+yi],bb=P[P[xi+1]+yi+1];
  return _l(_l(_g(aa,xf,yf),_g(ba,xf-1,yf),u),_l(_g(ab,xf,yf-1),_g(bb,xf-1,yf-1),u),v);
}

function noise(x,y){
  return perlin(x,y)*0.60+perlin(x*2,y*2)*0.30+perlin(x*4,y*4)*0.10;
}

// ─── COORDINATE SYSTEM ───────────────────────────────────────────────────────
// Terrain is equirectangular: row j → lat, col i → lon.
// Sphere coords from lat/lon: ux=cos(lat)*sin(lon), uy=sin(lat), uz=cos(lat)*cos(lon)
// Screen (canvas) space: +x right, +y DOWN, camera at +z looking toward origin.
// We flip screen-y when computing sphere normals so geographic north is up.

function applyInvRot(nx, ny, nz){
  // world = Ry(-rotY) * Rx(-rotX) * screen_normal
  const cX=Math.cos(rotX), sX=Math.sin(rotX);
  const cY=Math.cos(rotY), sY=Math.sin(rotY);
  // Rx(-rotX):
  const ax=nx, ay=ny*cX+nz*sX, az=-ny*sX+nz*cX;
  // Ry(-rotY):
  return [ax*cY-az*sY, ay, ax*sY+az*cY];
}

function applyFwdRot(ux, uy, uz){
  // screen = Rx(rotX) * Ry(rotY) * world_normal
  const cX=Math.cos(rotX), sX=Math.sin(rotX);
  const cY=Math.cos(rotY), sY=Math.sin(rotY);
  const bx=ux*cY+uz*sY, by=uy, bz=-ux*sY+uz*cY;
  return [bx, by*cX-bz*sX, by*sX+bz*cX];
}

// Screen pixel → terrain grid {i,j}. Returns null if outside sphere.
function screenToGrid(wx, wy){
  const nx=(wx-CX)/(PR*CELL), ny=-(wy-CY)/(PR*CELL);
  const nz2=1-nx*nx-ny*ny;
  if(nz2<0) return null;
  const [ux,uy,uz]=applyInvRot(nx,ny,Math.sqrt(nz2));
  const lat=Math.asin(Math.max(-1,Math.min(1,uy)));
  const lon=Math.atan2(ux,uz);
  let i=Math.floor((lon/(Math.PI*2)+0.5)*SIZE);
  let j=Math.floor((lat/Math.PI+0.5)*SIZE);
  return { i:((i%SIZE)+SIZE)%SIZE, j:Math.max(0,Math.min(SIZE-1,j)) };
}

// Terrain grid → screen position. Returns null if on back face.
function gridToScreen(ti, tj){
  const lon=(ti/SIZE-0.5)*Math.PI*2;
  const lat=(tj/SIZE-0.5)*Math.PI;
  const cLat=Math.cos(lat);
  const [nx,ny,nz]=applyFwdRot(cLat*Math.sin(lon), Math.sin(lat), cLat*Math.cos(lon));
  if(nz<=0) return null;
  return { x:CX+nx*PR*CELL, y:CY-ny*PR*CELL };
}

// ─── PLANET INIT ─────────────────────────────────────────────────────────────
function initPlanet(){
  terrain.fill(0); destroyedCells=0; floodLevel=0; iceSpreading=false;
  nukeFlash=null; blackHoles=[]; meteors=[]; particles=[]; laserSegs=[];
  planetDirty=true;

  for(let j=0;j<SIZE;j++){
    for(let i=0;i<SIZE;i++){
      const lon=(i/SIZE-0.5)*Math.PI*2;
      const lat=(j/SIZE-0.5)*Math.PI;
      const cLat=Math.cos(lat);
      // Sample noise in 3-D sphere space to avoid polar distortion
      const sx=cLat*Math.sin(lon), sy=Math.sin(lat), sz=cLat*Math.cos(lon);
      const n=noise(sx*2.6,sz*2.6)*0.6+noise(sy*5.2,sx*5.2)*0.3+noise(sz*10.4,sy*10.4)*0.1;
      noiseMap[j*SIZE+i]=n;
      let type;
      if(Math.abs(lat)>1.4)            type=T.ICE;        // polar ice caps
      else if(n<-0.28)                 type=T.OCEAN;
      else if(n<-0.08)                 type=T.SAND;
      else if(n< 0.22)                 type=T.VEGETATION;
      else                             type=T.ROCK;
      terrain[j*SIZE+i]=type;
    }
  }
}

// ─── TERRAIN HELPERS ─────────────────────────────────────────────────────────
function wrapI(i){ return ((i%SIZE)+SIZE)%SIZE; }

function destroyCell(i,j){
  i=wrapI(i); j=Math.max(0,Math.min(SIZE-1,j));
  const idx=j*SIZE+i;
  if(terrain[idx]===T.CRATER) return false;
  terrain[idx]=T.CRATER; destroyedCells++; planetDirty=true; return true;
}

function setCell(i,j,type){
  i=wrapI(i); j=Math.max(0,Math.min(SIZE-1,j));
  if(terrain[j*SIZE+i]===T.CRATER) return;
  terrain[j*SIZE+i]=type; planetDirty=true;
}

function explodeAt(wx,wy,radius){
  const hit=screenToGrid(wx,wy); if(!hit) return;
  const cr=Math.ceil(radius/CELL);
  for(let dj=-cr;dj<=cr;dj++)
    for(let di=-cr;di<=cr;di++)
      if(di*di+dj*dj<=cr*cr) destroyCell(hit.i+di, hit.j+dj);
}

function spawnBurst(wx,wy,count,colors,sMin,sMax,lMin,lMax,grav=60){
  for(let k=0;k<count&&particles.length<900;k++){
    const a=Math.random()*Math.PI*2, sp=sMin+Math.random()*(sMax-sMin);
    particles.push({x:wx,y:wy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-Math.random()*20,
      life:lMin+Math.random()*(lMax-lMin),maxLife:lMax,
      color:colors[0|Math.random()*colors.length],size:2+Math.random()*3,grav});
  }
}

function shake(a){ shakeAmt=Math.max(shakeAmt,a); }

// ─── AUDIO ───────────────────────────────────────────────────────────────────
let AC;
function ac(){ if(!AC) AC=new(window.AudioContext||window.webkitAudioContext)(); return AC; }

function playBoom(f=80,d=0.7,v=0.4){try{
  const a=ac(),o=a.createOscillator(),g=a.createGain();
  o.connect(g);g.connect(a.destination);
  o.frequency.setValueAtTime(f,a.currentTime);
  o.frequency.exponentialRampToValueAtTime(4,a.currentTime+d);
  g.gain.setValueAtTime(v,a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d);
  o.start();o.stop(a.currentTime+d);}catch(_){}}

function playNoise(bp=1500,d=0.4,v=0.22){try{
  const a=ac(),sr=a.sampleRate,buf=a.createBuffer(1,sr*d,sr);
  const dd=buf.getChannelData(0);
  for(let i=0;i<dd.length;i++) dd[i]=(Math.random()*2-1)*(1-i/dd.length);
  const src=a.createBufferSource();src.buffer=buf;
  const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=bp;
  const g=a.createGain();g.gain.value=v;
  src.connect(f);f.connect(g);g.connect(a.destination);src.start();}catch(_){}}

function playTone(f=300,f2=900,d=0.5,v=0.2,type='sine'){try{
  const a=ac(),o=a.createOscillator(),g=a.createGain();
  o.type=type;o.connect(g);g.connect(a.destination);
  o.frequency.setValueAtTime(f,a.currentTime);
  o.frequency.exponentialRampToValueAtTime(f2,a.currentTime+d);
  g.gain.setValueAtTime(v,a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d);
  o.start();o.stop(a.currentTime+d);}catch(_){}}

// ─── POWERS ──────────────────────────────────────────────────────────────────
function usePower(wx,wy){
  switch(selectedPower){
    case 'meteor':    launchMeteor(wx,wy);   break;
    case 'nuke':      fireNuke(wx,wy);       break;
    case 'blackhole': placeBlackHole(wx,wy); break;
    case 'flood':     triggerFlood();        break;
    case 'volcano':   erupt(wx,wy);          break;
    case 'ice':       iceSpreading=!iceSpreading; updateStatus(); break;
    case 'restore':   restorePlanet();       break;
  }
}

function launchMeteor(tx,ty){
  const a=-Math.PI*0.55+(Math.random()-0.5)*0.6;
  const dist=Math.max(W,H)*0.85;
  meteors.push({x:tx-Math.cos(a)*dist,y:ty-Math.sin(a)*dist,
    tx,ty,speed:650+Math.random()*250,size:9+Math.random()*9,trail:[]});
  playNoise(1800,0.3,0.2);
}

function fireNuke(wx,wy){
  explodeAt(wx,wy,130);
  spawnBurst(wx,wy,220,['#fff','#ffff88','#ff8800','#ff4400'],70,520,1,3,80);
  const hit=screenToGrid(wx,wy);
  if(hit){
    const {i:ci,j:cj}=hit;
    const outer=Math.ceil(185/CELL), inner=Math.ceil(95/CELL);
    for(let dj=-outer;dj<=outer;dj++){
      for(let di=-outer;di<=outer;di++){
        const d2=di*di+dj*dj;
        if(d2>outer*outer||d2<inner*inner||Math.random()>0.28) continue;
        if(terrain[(Math.max(0,Math.min(SIZE-1,cj+dj)))*SIZE+wrapI(ci+di)]!==T.CRATER)
          setCell(ci+di,cj+dj,T.IRRADIATED);
      }
    }
  }
  nukeFlash={life:0.9}; shake(55); playBoom(160,2.2,0.9);
}

function placeBlackHole(wx,wy){
  blackHoles.push({x:wx,y:wy,life:12,age:0}); shake(8);
  playTone(30,8,2,0.15,'sawtooth');
}

function triggerFlood(){
  floodLevel=Math.min(1,floodLevel+0.13);
  for(let j=0;j<SIZE;j++)
    for(let i=0;i<SIZE;i++){
      const idx=j*SIZE+i;
      if(terrain[idx]===T.OCEAN||terrain[idx]===T.CRATER) continue;
      if(noiseMap[idx]<-0.28+floodLevel*0.95) setCell(i,j,T.OCEAN);
    }
  playNoise(800,0.5,0.2);
}

function erupt(wx,wy){
  explodeAt(wx,wy,16);
  const hit=screenToGrid(wx,wy);
  if(hit){
    const {i:ci,j:cj}=hit, r=Math.ceil(55/CELL);
    for(let k=0;k<80;k++){
      const a=Math.random()*Math.PI*2, d=5+Math.random()*r;
      setCell(ci+Math.round(Math.cos(a)*d), cj+Math.round(Math.sin(a)*d), T.LAVA);
    }
  }
  for(let k=0;k<70&&particles.length<900;k++)
    particles.push({x:wx,y:wy,vx:(Math.random()-0.5)*130,vy:-160-Math.random()*260,
      life:1+Math.random()*1.8,maxLife:2.8,color:Math.random()>0.5?'#ff5500':'#ff9900',size:3+Math.random()*5,grav:80});
  shake(22); playBoom(55,0.9,0.5);
}

function restorePlanet(){
  initPlanet(); playTone(250,1000,0.5,0.2,'sine');
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────
function update(dt){
  // Meteors
  for(let k=meteors.length-1;k>=0;k--){
    const m=meteors[k];
    m.trail.push({x:m.x,y:m.y,s:m.size});
    if(m.trail.length>28) m.trail.shift();
    const dx=m.tx-m.x,dy=m.ty-m.y,dist=Math.sqrt(dx*dx+dy*dy),step=m.speed*dt;
    if(dist<=step+m.size){
      explodeAt(m.tx,m.ty,38+m.size*2.2);
      spawnBurst(m.tx,m.ty,90,['#ff6030','#ff9050','#ffcc60','#ff4020'],55,260,0.5,2);
      shake(16+m.size); playBoom(75+Math.random()*35,0.65,0.45); meteors.splice(k,1);
    } else { m.x+=(dx/dist)*step; m.y+=(dy/dist)*step; }
  }

  // Black holes — destroy cells near their screen position
  for(let k=blackHoles.length-1;k>=0;k--){
    const bh=blackHoles[k];
    bh.life-=dt; bh.age+=dt;
    if(bh.life<=0){ blackHoles.splice(k,1); continue; }
    for(let att=0;att<18;att++){
      const a=Math.random()*Math.PI*2, r=8+Math.random()*110;
      const sx=bh.x+Math.cos(a)*r, sy=bh.y+Math.sin(a)*r;
      const hit=screenToGrid(sx,sy); if(!hit) continue;
      if(destroyCell(hit.i,hit.j)){
        const toA=Math.atan2(bh.y-sy,bh.x-sx)+0.45;
        if(particles.length<900)
          particles.push({x:sx,y:sy,vx:Math.cos(toA)*90,vy:Math.sin(toA)*90,
            life:0.35+Math.random()*0.5,maxLife:0.85,color:'#cc99ff',size:1.5,grav:0});
      }
    }
    shake(1.5);
  }

  // Particles
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=p.grav*dt; p.life-=dt;
    if(p.life<=0) particles.splice(i,1);
  }

  // Shake decay
  if(shakeAmt>0){
    shakeX=(Math.random()-0.5)*shakeAmt*2; shakeY=(Math.random()-0.5)*shakeAmt*2;
    shakeAmt=Math.max(0,shakeAmt-dt*130);
  } else { shakeX=shakeY=0; }

  // Ice spreading
  if(iceSpreading){
    iceFrame=(iceFrame+1)%2;
    if(iceFrame===0){
      for(let k=0;k<280;k++){
        const idx=0|Math.random()*SIZE*SIZE;
        const t=terrain[idx];
        if(t===T.ICE||t===T.CRATER) continue;
        setCell(idx%SIZE, idx/SIZE|0, T.ICE);
      }
    }
  }

  cloudAngle+=dt*0.025;
}

// ─── RENDER PLANET (3-D sphere projection) ───────────────────────────────────
function renderPlanetTexture(){
  const data=planetImg.data;
  const cX=Math.cos(rotX),sX=Math.sin(rotX);
  const cY=Math.cos(rotY),sY=Math.sin(rotY);

  for(let j=0;j<SIZE;j++){
    for(let i=0;i<SIZE;i++){
      const nx=(i-PR)/PR;
      const ny=-(j-PR)/PR;   // flip Y so north is up
      const nz2=1-nx*nx-ny*ny;
      const p=(j*SIZE+i)*4;

      if(nz2<0){ data[p+3]=0; continue; }
      const nz=Math.sqrt(nz2);

      // ── diffuse lighting (in screen space, before rotation) ──
      const diffuse=Math.max(0.12, nx*LX + ny*LY + nz*LZ);

      // ── inverse rotation → world sphere point ──
      // Step 1: Rx(-rotX)
      const ax=nx, ay=ny*cX+nz*sX, az=-ny*sX+nz*cX;
      // Step 2: Ry(-rotY)
      const ux=ax*cY-az*sY, uy=ay, uz=ax*sY+az*cY;

      // ── world sphere → lat/lon → terrain grid ──
      const lat=Math.asin(Math.max(-1,Math.min(1,uy)));
      const lon=Math.atan2(ux,uz);
      let ti=0|((lon/(Math.PI*2)+0.5)*SIZE);
      let tj=0|((lat/Math.PI+0.5)*SIZE);
      ti=((ti%SIZE)+SIZE)%SIZE; tj=Math.max(0,Math.min(SIZE-1,tj));

      const idx=tj*SIZE+ti;
      const t=terrain[idx];
      const n=noiseMap[idx]*14;

      let r,g,b;
      switch(t){
        case T.ROCK:       r=108+n;    g=74+n*.7;  b=54+n*.5;   break;
        case T.OCEAN:      r=22+n*.3;  g=62+n;     b=158+n*1.2; break;
        case T.VEGETATION: r=32+n*.3;  g=108+n;    b=42+n*.4;   break;
        case T.LAVA:       r=215+n*.4; g=44+Math.abs(n)*1.5; b=4; break;
        case T.ICE:        r=155+n*.4; g=208+n*.3; b=238+n*.2;  break;
        case T.SAND:       r=168+n;    g=148+n*.8; b=88+n*.5;   break;
        case T.CRATER:     r=38+n*.3;  g=26+n*.2;  b=20+n*.15;  break;
        case T.IRRADIATED: r=72+n;     g=92+n;     b=16;        break;
        default:           r=g=b=80;
      }

      // Apply lighting
      data[p]  =Math.max(0,Math.min(255,r*diffuse));
      data[p+1]=Math.max(0,Math.min(255,g*diffuse));
      data[p+2]=Math.max(0,Math.min(255,b*diffuse));
      data[p+3]=255;
    }
  }

  offCtx.putImageData(planetImg,0,0);
  planetDirty=false;
}

// ─── DRAW ────────────────────────────────────────────────────────────────────
function drawScene(){
  ctx.fillStyle='#00000e';
  ctx.fillRect(-shakeX,-shakeY,W,H);

  // Stars
  const t=Date.now()*0.0008;
  for(const s of stars){
    ctx.globalAlpha=(0.55+0.45*Math.sin(t*s.sp+s.ph))*s.br;
    ctx.fillStyle='#fff'; ctx.fillRect(s.x,s.y,s.r,s.r);
  }
  ctx.globalAlpha=1;

  // Planet
  if(planetDirty) renderPlanetTexture();
  ctx.save();
  ctx.beginPath(); ctx.arc(CX,CY,PR*CELL,0,Math.PI*2); ctx.clip();
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(off,CX-PR*CELL,CY-PR*CELL,SIZE*CELL,SIZE*CELL);
  ctx.restore();

  // Atmosphere
  const aR=PR*CELL;
  const atmo=ctx.createRadialGradient(CX,CY,aR*.82,CX,CY,aR*1.28);
  atmo.addColorStop(0,'rgba(50,110,255,0.28)');
  atmo.addColorStop(0.55,'rgba(20,60,200,0.08)');
  atmo.addColorStop(1,'rgba(0,10,80,0)');
  ctx.fillStyle=atmo; ctx.beginPath(); ctx.arc(CX,CY,aR*1.28,0,Math.PI*2); ctx.fill();

  // Clouds
  const CLOUDS=[
    {r:.72,a:0,   s:14,sp:1.0},{r:.85,a:1.2, s:10,sp:.8},
    {r:.78,a:2.5, s:16,sp:1.2},{r:.68,a:3.8, s:11,sp:.9},
    {r:.90,a:4.7, s:10,sp:1.1},{r:.75,a:5.5, s:15,sp:1.0},
    {r:.82,a:.55, s:9, sp:.7}, {r:.70,a:2.1, s:13,sp:1.3},
  ];
  ctx.shadowColor='#fff'; ctx.shadowBlur=8; ctx.fillStyle='#ddeeff';
  for(const c of CLOUDS){
    const ang=c.a+cloudAngle*c.sp;
    const cr=c.r*aR, cx2=CX+Math.cos(ang)*cr, cy2=CY+Math.sin(ang)*cr;
    const dx=cx2-CX,dy=cy2-CY;
    if(dx*dx+dy*dy>(aR*.97)**2) continue;
    ctx.globalAlpha=.38;
    ctx.beginPath();ctx.arc(cx2,cy2,c.s,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(cx2+c.s*.65,cy2-c.s*.2,c.s*.68,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(cx2-c.s*.55,cy2-c.s*.15,c.s*.55,0,Math.PI*2);ctx.fill();
  }
  ctx.shadowBlur=0; ctx.globalAlpha=1;

  // Black holes
  for(const bh of blackHoles){
    const alpha=Math.min(1,bh.life/3); ctx.globalAlpha=alpha;
    const g=ctx.createRadialGradient(bh.x,bh.y,0,bh.x,bh.y,68);
    g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.45,'rgba(90,45,200,.55)');g.addColorStop(1,'rgba(40,0,100,0)');
    ctx.fillStyle=g; ctx.beginPath();ctx.arc(bh.x,bh.y,68,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=`hsla(${275+bh.age*25},80%,72%,${alpha})`;
    ctx.shadowColor='#cc99ff';ctx.shadowBlur=22;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(bh.x,bh.y,13,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;ctx.globalAlpha=1;
  }

  // Meteors
  for(const m of meteors){
    for(let k=0;k<m.trail.length;k++){
      const tr=m.trail[k],f=k/m.trail.length;
      ctx.globalAlpha=f*.65;ctx.fillStyle='#ff7733';ctx.shadowColor='#ff9944';ctx.shadowBlur=14;
      ctx.beginPath();ctx.arc(tr.x,tr.y,tr.s*f,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;ctx.fillStyle='#ffaa66';ctx.shadowColor='#ff8844';ctx.shadowBlur=28;
    ctx.beginPath();ctx.arc(m.x,m.y,m.size,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  }
  ctx.globalAlpha=1;

  // Laser
  for(let i=laserSegs.length-1;i>=0;i--){
    const l=laserSegs[i]; l.life-=1/60;
    if(l.life<=0){laserSegs.splice(i,1);continue;}
    ctx.globalAlpha=l.life/.12;ctx.strokeStyle='#ff2222';ctx.shadowColor='#ff5555';ctx.shadowBlur=16;ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(l.x1,l.y1);ctx.lineTo(l.x2,l.y2);ctx.stroke();
    ctx.shadowBlur=0;ctx.globalAlpha=1;
  }

  // Particles
  ctx.shadowBlur=5;
  for(const p of particles){
    ctx.globalAlpha=(p.life/p.maxLife)*.95;ctx.fillStyle=p.color;ctx.shadowColor=p.color;
    ctx.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size);
  }
  ctx.shadowBlur=0;ctx.globalAlpha=1;

  // Nuke flash
  if(nukeFlash){
    nukeFlash.life-=1/60;
    if(nukeFlash.life<=0) nukeFlash=null;
    else{ ctx.globalAlpha=Math.min(1,nukeFlash.life/.35)*.85;ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1; }
  }

  drawCursor();
}

function drawCursor(){
  if(rotating) return;
  const {x,y}=mousePos;
  const col=POWER_COLORS[selectedPower]||'#fff';
  ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.lineWidth=1.5;ctx.globalAlpha=.7;
  ctx.beginPath();
  ctx.moveTo(x-20,y);ctx.lineTo(x-7,y); ctx.moveTo(x+7,y);ctx.lineTo(x+20,y);
  ctx.moveTo(x,y-20);ctx.lineTo(x,y-7); ctx.moveTo(x,y+7);ctx.lineTo(x,y+20);
  ctx.stroke();
  ctx.lineWidth=1;ctx.globalAlpha=.18;
  if(selectedPower==='meteor'){ctx.beginPath();ctx.arc(x,y,62,0,Math.PI*2);ctx.stroke();}
  else if(selectedPower==='nuke'){
    ctx.beginPath();ctx.arc(x,y,130,0,Math.PI*2);ctx.stroke();
    ctx.globalAlpha=.08;ctx.beginPath();ctx.arc(x,y,185,0,Math.PI*2);ctx.stroke();
  } else if(selectedPower==='blackhole'){ctx.beginPath();ctx.arc(x,y,110,0,Math.PI*2);ctx.stroke();}
  else if(selectedPower==='volcano'){ctx.beginPath();ctx.arc(x,y,55,0,Math.PI*2);ctx.stroke();}
  ctx.globalAlpha=1;ctx.shadowBlur=0;
}

// ─── HUD ─────────────────────────────────────────────────────────────────────
function updateHUD(){
  const ratio=1-(destroyedCells/totalCells);
  const pop=Math.max(0,Math.round(ratio*8_000_000_000));
  const pct=Math.round((1-ratio)*100);
  const popEl=document.getElementById('pop');
  popEl.textContent=pop.toLocaleString();
  popEl.className='value '+(pop<1e6?'red':pop<1e9?'orange':'green');
  const destEl=document.getElementById('dest');
  destEl.textContent=pct+'%';
  destEl.style.color=pct>80?'#ff3333':pct>40?'#ffaa44':'#aaaacc';
}

function updateStatus(){
  const el=document.getElementById('status-txt');
  el.textContent=selectedPower==='ice'&&iceSpreading?'FREEZING':'READY';
}

// ─── LASER SLICE ─────────────────────────────────────────────────────────────
function sliceLaser(wx,wy){
  if(!laserLast){laserLast={x:wx,y:wy};return;}
  const dx=wx-laserLast.x, dy=wy-laserLast.y;
  const dist=Math.sqrt(dx*dx+dy*dy);
  const steps=Math.max(1,Math.ceil(dist/(CELL*.5)));
  for(let s=0;s<=steps;s++){
    const px=laserLast.x+dx*(s/steps), py=laserLast.y+dy*(s/steps);
    const hit=screenToGrid(px,py); if(!hit) continue;
    for(let di=-1;di<=1;di++) for(let dj=-1;dj<=1;dj++) destroyCell(hit.i+di,hit.j+dj);
  }
  laserSegs.push({x1:laserLast.x,y1:laserLast.y,x2:wx,y2:wy,life:.12});
  laserLast={x:wx,y:wy};
}

// ─── MAIN LOOP ────────────────────────────────────────────────────────────────
let lastT=0;
function loop(ts){
  const dt=Math.min((ts-lastT)/1000,.05); lastT=ts;
  update(dt);
  ctx.save(); ctx.translate(shakeX,shakeY);
  drawScene();
  ctx.restore();
  updateHUD();
  requestAnimationFrame(loop);
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
canvas.addEventListener('contextmenu',e=>e.preventDefault());

canvas.addEventListener('mousedown',e=>{
  if(e.button===2){ rotating=true; rotLastX=e.clientX; rotLastY=e.clientY; return; }
  isDown=true; laserLast=null;
  if(selectedPower==='laser') laserLast={x:e.clientX,y:e.clientY};
  else usePower(e.clientX,e.clientY);
});

canvas.addEventListener('mousemove',e=>{
  mousePos={x:e.clientX,y:e.clientY};
  if(rotating){
    rotY-=(e.clientX-rotLastX)*0.006;
    rotX+=Math.max(-0.05,Math.min(0.05,(e.clientY-rotLastY)*0.006));
    rotX=Math.max(-Math.PI/2,Math.min(Math.PI/2,rotX));
    rotLastX=e.clientX; rotLastY=e.clientY;
    planetDirty=true; return;
  }
  if(isDown&&selectedPower==='laser') sliceLaser(e.clientX,e.clientY);
});

canvas.addEventListener('mouseup',e=>{
  if(e.button===2){rotating=false;return;}
  isDown=false; laserLast=null;
});
canvas.addEventListener('mouseleave',()=>{isDown=false;laserLast=null;rotating=false;});

canvas.addEventListener('touchstart',e=>{
  e.preventDefault(); isDown=true; laserLast=null;
  const t=e.touches[0]; mousePos={x:t.clientX,y:t.clientY};
  if(selectedPower==='laser') laserLast={x:t.clientX,y:t.clientY};
  else usePower(t.clientX,t.clientY);
},{passive:false});

canvas.addEventListener('touchmove',e=>{
  e.preventDefault();
  const t=e.touches[0]; mousePos={x:t.clientX,y:t.clientY};
  if(isDown&&selectedPower==='laser') sliceLaser(t.clientX,t.clientY);
},{passive:false});

canvas.addEventListener('touchend',()=>{isDown=false;laserLast=null;});

document.querySelectorAll('.power').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.power').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedPower=btn.dataset.power;
    const lbl=document.getElementById('power-label');
    lbl.textContent=btn.dataset.label;
    lbl.style.color=POWER_COLORS[selectedPower]||'#fff';
    if(selectedPower!=='ice') iceSpreading=false;
    updateStatus();
  });
});

// ─── RESIZE ──────────────────────────────────────────────────────────────────
function resize(){
  W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight;
  CX=W/2; CY=H/2;
  stars=Array.from({length:220},()=>({
    x:Math.random()*W,y:Math.random()*H,r:.8+Math.random()*1.8,
    br:.3+Math.random()*.7,sp:.4+Math.random()*.9,ph:Math.random()*Math.PI*2,
  }));
}

// CSS color classes
const sty=document.createElement('style');
sty.textContent='.red{color:#ff4444;text-shadow:0 0 8px #ff4444}.orange{color:#ffaa44;text-shadow:0 0 8px #ffaa44}.green{color:#44ff88;text-shadow:0 0 8px #44ff88}';
document.head.appendChild(sty);

window.addEventListener('resize',()=>{resize();planetDirty=true;});

// ─── BOOT ────────────────────────────────────────────────────────────────────
resize();
initPlanet();
requestAnimationFrame(loop);
