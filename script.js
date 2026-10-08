const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],h=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;e.innerHTML=x;return e};
$('#menu').onclick=e=>{e.target.setAttribute('aria-expanded',$('#nv').classList.toggle('open'))};$$('#nv a').forEach(a=>a.onclick=()=>$('#nv').classList.remove('open'));
$$('[data-mode]').forEach(b=>b.onclick=()=>{document.body.dataset.mode=b.dataset.mode;$$('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
// Tiến độ
const chs=$$('[data-ch]');addEventListener('scroll',()=>{const p=scrollY/(document.body.scrollHeight-innerHeight);$('#bar').style.width=p*100+'%';let c=0;chs.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight/2)c=i+1});$('#prog').textContent=`Chương ${c||1} / ${chs.length} · ${Math.round(p*100)}%`},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add('seen')),{threshold:.25});$$('.fi,#pv').forEach(e=>io.observe(e));
// Timeline + modal
const nm={THEORY:'Lý thuyết',DATA:'Dữ liệu',STATISTICS:'Thống kê',GRAPH:'Graph',VISUALIZATION:'Trực quan hóa',PROGRAMMING:'Lập trình',SYSTEM:'Hệ thống',FEEDBACK:'Phản biện',PIVOT:'Pivot'};
timeline.forEach(([d,l,k,t])=>{const b=h('button','tn '+k,`<b>${d}</b><br>${l}`);b.onclick=()=>{$('#md').innerHTML=`<h3>${d}/2026 · ${l}</h3><p class="tag">${nm[k]}</p><p>${t||PH}</p><button onclick="this.closest('dialog').close()">Đóng</button>`;$('#md').showModal()};$('#tl').append(b)});
// Nhật ký
const tags=['ALL',...Object.keys(nm)];tags.forEach(t=>{const b=h('button','',t);b.onclick=()=>{$$('#chips button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#entries').innerHTML='';timeline.filter(e=>t==='ALL'||e[2]===t).forEach(([d,l,k,x])=>$('#entries').append(h('article','entry',`<span class="tag">${d} · ${k}</span><h3>${l}</h3><p><b>Đã làm / quan sát:</b> ${x||PH}</p>`)))};$('#chips').append(b)});$('#chips button').click();
decisions.forEach(r=>$('#dl').insertAdjacentHTML('beforeend','<tr>'+r.map(c=>`<td>${c}</td>`).join('')+'</tr>'));
evidence.forEach(e=>$('#ev').append(h('div','card slot',`<span class="tag">${e.type}</span><h3>${e.title}</h3><p class="ph">Awaiting verified data</p><small>STATUS · ${e.status}</small>`)));
docs.forEach(d=>$('#docs').append(h('div','card slot',`<h3>${d}</h3><p class="ph">Chưa có tệp</p>`)));
Object.entries(code).forEach(([k,v])=>$('#code').append(h('details','card',`<summary>${k}</summary><pre>${v}</pre>`)));
// Graph minh họa
const NS='http://www.w3.org/2000/svg',g=$('#g'),N=demo.nodes.map(([id,x,y])=>({id,x,y})),ix=id=>N.findIndex(n=>n.id===id);let cur='degree',sel=null;
function metrics(E){const n=N.length,A=N.map(()=>[]);E.forEach(([a,b])=>{A[ix(a)].push(ix(b));A[ix(b)].push(ix(a))});
const deg=A.map(a=>a.length),clo=[],bet=Array(n).fill(0);
for(let s=0;s<n;s++){const d=Array(n).fill(-1),sg=Array(n).fill(0),P=N.map(()=>[]),st=[],q=[s];d[s]=0;sg[s]=1;while(q.length){const v=q.shift();st.push(v);A[v].forEach(w=>{if(d[w]<0){d[w]=d[v]+1;q.push(w)}if(d[w]===d[v]+1){sg[w]+=sg[v];P[w].push(v)}})}
const dl=Array(n).fill(0);while(st.length){const w=st.pop();P[w].forEach(v=>dl[v]+=sg[v]/sg[w]*(1+dl[w]));if(w!==s)bet[w]+=dl[w]}
const r=d.filter(x=>x>0);clo[s]=r.length?r.length/r.reduce((a,b)=>a+b):0}
let x=Array(n).fill(1);for(let i=0;i<60;i++){const y=x.map((_,v)=>A[v].reduce((a,w)=>a+x[w],0)),m=Math.max(...y)||1;x=y.map(z=>z/m)}
return{degree:deg,betweenness:bet.map(b=>b/2),closeness:clo,eigenvector:x}}
function draw(){const tau=+$('#tau').value;$('#tauv').textContent=tau.toFixed(2);const E=demo.edges.filter(e=>e[2]>=tau),M=metrics(E),mx=Math.max(...M[cur])||1;g.innerHTML='';
E.forEach(([a,b,w])=>{const l=document.createElementNS(NS,'line');[['x1',N[ix(a)].x],['y1',N[ix(a)].y],['x2',N[ix(b)].x],['y2',N[ix(b)].y],['stroke','#6b5b95'],['stroke-width',w*7],['opacity',.7]].forEach(([k,v])=>l.setAttribute(k,v));g.append(l)});
N.forEach((n,i)=>{const c=document.createElementNS(NS,'circle');[['cx',n.x],['cy',n.y],['r',14+22*M[cur][i]/mx],['tabindex',0],['role','button'],['aria-label','Nút '+n.id]].forEach(([k,v])=>c.setAttribute(k,v));if(sel===n.id)c.classList.add('on');
const pick=()=>{sel=n.id;draw()};c.onclick=pick;c.onkeydown=e=>(e.key==='Enter'||e.key===' ')&&(e.preventDefault(),pick());g.append(c);const t=document.createElementNS(NS,'text');t.setAttribute('x',n.x);t.setAttribute('y',n.y+5);t.setAttribute('text-anchor','middle');t.textContent=n.id;g.append(t)});
const dens=(2*E.length/(N.length*(N.length-1))).toFixed(2);$('#st').textContent=`Cạnh: ${E.length} · Mật độ: ${dens} · Degree TB: ${(2*E.length/N.length).toFixed(1)} (dữ liệu tổng hợp)`;
$('#panel').innerHTML=sel?`<strong>Nút ${sel}</strong> (tổng hợp): Degree ${M.degree[ix(sel)]} · Betweenness ${M.betweenness[ix(sel)].toFixed(1)} · Closeness ${M.closeness[ix(sel)].toFixed(2)} · Eigenvector ${M.eigenvector[ix(sel)].toFixed(2)}`:'Chọn một nút. Kích thước nút theo chỉ số đang chọn.';
$('#rb').innerHTML=[.2,.3,.4,.5].map(t=>`<tr><td>τ=${t}</td><td colspan="5" class="ph">[DATA] chờ dữ liệu thực</td></tr>`).join('')}
$$('#tabs button').forEach(b=>b.onclick=()=>{cur=b.dataset.m;$$('#tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#cd').textContent=b.dataset.d;draw()});$('#tau').oninput=draw;draw();
// Nền hero
(function(){const s=$('#bg'),P=[...Array(14)].map(()=>({x:Math.random()*600,y:Math.random()*400,a:Math.random()*6}));if(matchMedia('(prefers-reduced-motion:reduce)').matches){s.innerHTML=P.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="4"/>`).join('');return}
(function f(){P.forEach(p=>{p.a+=.002;p.x+=Math.cos(p.a)*.25;p.y+=Math.sin(p.a)*.25});let o='';P.forEach((p,i)=>P.slice(i+1).forEach(q=>{const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<150)o+=`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke-opacity="${1-d/150}"/>`}));s.innerHTML=o+P.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="4"/>`).join('');requestAnimationFrame(f)})()})();
