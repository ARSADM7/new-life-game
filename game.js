(() => {
  "use strict";
  const canvas=document.getElementById("renderCanvas"), loading=document.getElementById("loading");
  const cashEl=document.getElementById("cash"), clockEl=document.getElementById("clock"), hintEl=document.getElementById("hint");
  const interactButton=document.getElementById("interact-button"), cameraButton=document.getElementById("camera-button");
  const missionTitle=document.getElementById("mission-title"), missionDescription=document.getElementById("mission-description");
  const stickEl=document.getElementById("stick"), joystick=document.getElementById("joystick");
  if(!window.BABYLON){loading.innerHTML="<p>Não foi possível carregar o motor 3D. Verifica a ligação à internet e atualiza a página.</p>";return;}
  const engine=new BABYLON.Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true,powerPreference:"low-power"});
  engine.setHardwareScalingLevel(Math.min(1.5,Math.max(1,window.devicePixelRatio||1)));
  const scene=new BABYLON.Scene(engine); scene.clearColor=new BABYLON.Color4(.58,.76,.88,1); scene.collisionsEnabled=true;
  const camera=new BABYLON.FollowCamera("followCamera",new BABYLON.Vector3(0,5,-9),scene);
  camera.radius=8;camera.heightOffset=3.2;camera.rotationOffset=180;camera.cameraAcceleration=.08;camera.maxCameraSpeed=10;
  camera.lowerRadiusLimit=4;camera.upperRadiusLimit=13;camera.attachControl(canvas,true);scene.activeCamera=camera;
  const hemi=new BABYLON.HemisphericLight("skyLight",new BABYLON.Vector3(0,1,0),scene);hemi.intensity=.85;
  const sun=new BABYLON.DirectionalLight("sun",new BABYLON.Vector3(-.4,-1,.3),scene);sun.position=new BABYLON.Vector3(20,30,-20);sun.intensity=.75;
  const mat=(name,color)=>{const m=new BABYLON.StandardMaterial(name,scene);m.diffuseColor=BABYLON.Color3.FromHexString(color);return m;};
  const grass=mat("grass","#75a96a"),road=mat("road","#454b55"),sidewalk=mat("sidewalk","#b8b7ad");
  const wallA=mat("wallA","#e7d4b5"),wallB=mat("wallB","#c9d8df"),roof=mat("roof","#a95d4d");
  const dark=mat("dark","#273342"),windowMat=mat("windows","#8bc7d5"),skin=mat("skin","#d99b72");
  const shirt=mat("shirt","#4b82c3"),pants=mat("pants","#303b55"),treeMat=mat("tree","#397b50");
  const white=mat("white","#f4f1e8"),gold=mat("gold","#e6b84e");
  const ground=BABYLON.MeshBuilder.CreateGround("ground",{width:100,height:100},scene);ground.material=grass;ground.checkCollisions=true;
  function box(name,x,y,z,w,h,d,material){const b=BABYLON.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);b.position.set(x,y,z);b.material=material;b.checkCollisions=true;return b;}
  box("roadMain",0,.03,0,13,.08,65,road);box("roadCross",0,.04,0,65,.08,11,road);
  box("sidewalkA",-7.2,.08,0,1.2,.18,65,sidewalk);box("sidewalkB",7.2,.08,0,1.2,.18,65,sidewalk);
  for(let z=-27;z<=27;z+=6)box("roadMark",0,.09,z,.18,.02,2.5,white);
  function house(x,z,wall,label){box(label+"Body",x,1.6,z,7,3.2,6,wall);const r=BABYLON.MeshBuilder.CreateCylinder(label+"Roof",{diameter:8.2,height:2,tessellation:4},scene);r.position.set(x,4.1,z);r.rotation.y=Math.PI/4;r.scaling.z=.8;r.material=roof;box(label+"Door",x,1,z-3.04,.9,2,.08,dark);box(label+"Window",x-2,2,z-3.06,1.35,1.05,.08,windowMat);box(label+"Window2",x+2,2,z-3.06,1.35,1.05,.08,windowMat);}
  house(-13,-9,wallA,"home1");house(14,10,wallB,"home2");house(-16,17,wallB,"home3");
  box("shop",14,1.8,-10,8,3.6,7,wallA);box("shopSign",14,3.65,-13.58,5,.65,.12,gold);box("shopDoor",14,1,-13.56,1.2,2,.08,dark);
  for(const [x,z] of [[-23,-22],[-24,0],[-22,24],[23,-22],[24,0],[23,24],[-9,27],[10,-27]]){const trunk=BABYLON.MeshBuilder.CreateCylinder("trunk",{height:2,diameter:.45},scene);trunk.position.set(x,1,z);trunk.material=roof;const crown=BABYLON.MeshBuilder.CreateSphere("crown",{diameter:3,segments:6},scene);crown.position.set(x,3,z);crown.material=treeMat;}
  const player=new BABYLON.TransformNode("player",scene);
  const body=BABYLON.MeshBuilder.CreateCapsule("playerBody",{height:1.65,radius:.38},scene);body.parent=player;body.position.y=1.05;body.material=shirt;
  const head=BABYLON.MeshBuilder.CreateSphere("playerHead",{diameter:.65,segments:8},scene);head.parent=player;head.position.y=2.12;head.material=skin;
  const legs=BABYLON.MeshBuilder.CreateBox("playerLegs",{width:.55,height:.65,depth:.35},scene);legs.parent=player;legs.position.y=.38;legs.material=pants;
  player.position.set(0,0,18);camera.lockedTarget=player;
  const npcs=[];
  function makeNpc(name,x,z,color,phase){const n=new BABYLON.TransformNode(name,scene);const torso=BABYLON.MeshBuilder.CreateCapsule(name+"Body",{height:1.5,radius:.34},scene);torso.parent=n;torso.position.y=.95;torso.material=mat(name+"Mat",color);const h=BABYLON.MeshBuilder.CreateSphere(name+"Head",{diameter:.58,segments:8},scene);h.parent=n;h.position.y=1.95;h.material=skin;n.position.set(x,0,z);npcs.push({node:n,origin:new BABYLON.Vector3(x,0,z),phase});}
  makeNpc("Mira",-4,2,"#bd78b7",0);makeNpc("Tomas",4,-5,"#d18a45",2);
  const workPoint=BABYLON.MeshBuilder.CreateCylinder("workPoint",{diameter:1.5,height:.12,tessellation:24},scene);workPoint.position.set(10,.18,-5);workPoint.material=gold;
  const marker=BABYLON.MeshBuilder.CreateSphere("marker",{diameter:.5,segments:8},scene);marker.position.set(10,1.5,-5);marker.material=gold;
  let money=Number(localStorage.getItem("newlife-money")||0),hasWorked=localStorage.getItem("newlife-worked")==="yes";
  let elapsed=8*60,cameraMode=0,nearby=false,moveX=0,moveZ=0,jumpVelocity=0,onGround=true;const keys={};
  cashEl.textContent=money+" MT";if(hasWorked){missionTitle.textContent="Primeiro salário recebido";missionDescription.textContent="Explora o bairro e prepara a tua próxima etapa.";}
  function updateClock(){elapsed+=.015;const hours=Math.floor(elapsed/60)%24,mins=Math.floor(elapsed%60);clockEl.textContent=String(hours).padStart(2,"0")+":"+String(mins).padStart(2,"0");}
  function showMessage(msg){const el=document.getElementById("center-message");el.textContent=msg;el.style.display="block";setTimeout(()=>el.style.display="none",2400);}
  function interact(){if(!nearby)return;if(!hasWorked){money+=150;hasWorked=true;localStorage.setItem("newlife-money",String(money));localStorage.setItem("newlife-worked","yes");cashEl.textContent=money+" MT";missionTitle.textContent="Primeiro salário recebido!";missionDescription.textContent="Ganhaste 150 MT. Continua a explorar Aurelia.";hintEl.textContent="Missão concluída: recebeste 150 MT.";showMessage("Recebeste 150 MT pelo teu primeiro trabalho!");}else showMessage("Já terminaste o trabalho de hoje. Novas atividades chegarão nas próximas versões.");}
  interactButton.addEventListener("click",interact);
  cameraButton.addEventListener("click",()=>{cameraMode=(cameraMode+1)%2;camera.radius=cameraMode===0?8:4.5;camera.heightOffset=cameraMode===0?3.2:2.5;cameraButton.textContent=cameraMode===0?"Câmara: 3ª pessoa":"Câmara: próxima";});
  document.getElementById("jump-button").addEventListener("pointerdown",()=>{if(onGround){jumpVelocity=.13;onGround=false;}});
  window.addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;if(e.key===" "&&onGround){jumpVelocity=.13;onGround=false;}});
  window.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
  let joyPointer=null;
  joystick.addEventListener("pointerdown",e=>{joyPointer=e.pointerId;joystick.setPointerCapture(joyPointer);moveJoy(e);});
  joystick.addEventListener("pointermove",e=>{if(e.pointerId===joyPointer)moveJoy(e);});
  function moveJoy(e){const r=joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=30,len=Math.hypot(dx,dy)||1;if(len>max){dx=dx/len*max;dy=dy/len*max;}stickEl.style.transform="translate("+dx+"px,"+dy+"px)";moveX=dx/max;moveZ=dy/max;}
  function resetJoy(){joyPointer=null;moveX=0;moveZ=0;stickEl.style.transform="translate(0,0)";}
  joystick.addEventListener("pointerup",resetJoy);joystick.addEventListener("pointercancel",resetJoy);joystick.addEventListener("lostpointercapture",resetJoy);
  scene.onBeforeRenderObservable.add(()=>{updateClock();let x=moveX,z=moveZ;if(keys.w||keys.arrowup)z-=1;if(keys.s||keys.arrowdown)z+=1;if(keys.a||keys.arrowleft)x-=1;if(keys.d||keys.arrowright)x+=1;const len=Math.hypot(x,z);if(len>1){x/=len;z/=len;}const speed=.105;if(Math.abs(x)+Math.abs(z)>.02){player.position.addInPlace(new BABYLON.Vector3(x,0,z).scale(speed));player.rotation.y=Math.atan2(x,z);}if(!onGround){player.position.y+=jumpVelocity;jumpVelocity-=.008;if(player.position.y<=0){player.position.y=0;onGround=true;jumpVelocity=0;}}player.position.x=BABYLON.Scalar.Clamp(player.position.x,-29,29);player.position.z=BABYLON.Scalar.Clamp(player.position.z,-29,29);npcs.forEach(npc=>{const t=performance.now()*.00025+npc.phase;npc.node.position.x=npc.origin.x+Math.sin(t)*2;npc.node.position.z=npc.origin.z+Math.cos(t)*1.5;npc.node.rotation.y=Math.atan2(Math.cos(t),-Math.sin(t));});marker.position.y=1.35+Math.sin(performance.now()*.003)*.18;nearby=BABYLON.Vector3.Distance(player.position,workPoint.position)<3.2;interactButton.disabled=!nearby;if(nearby){hintEl.textContent="Estás no ponto de trabalho. Toca em Interagir.";interactButton.textContent=hasWorked?"Ver atividade":"Trabalhar";}else{hintEl.textContent="Explora o bairro e procura o marcador dourado.";interactButton.textContent="Interagir";}});
  engine.runRenderLoop(()=>{if(scene.activeCamera)scene.render();});window.addEventListener("resize",()=>engine.resize());
  scene.executeWhenReady(()=>{loading.style.display="none";showMessage("Bem-vindo a Aurelia. Explora o bairro!");});
  if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();