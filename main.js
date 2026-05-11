(function() {
  "use strict";

  // Get element top relative to viewport (works with any positioned parent)
  function getTop(el) {
    var rect = el.getBoundingClientRect();
    return rect.top + window.pageYOffset;
  }

  // Count-up animation
  function countUp(el) {
    if (el._done) return;
    el._done = true;
    var target = +el.dataset.target;
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var start = 0, duration = 1200, step = target / (duration / 16);
    var timer = setInterval(function() {
      start = Math.min(start + step, target);
      el.textContent = prefix + Math.floor(start) + suffix;
      if (start >= target) { clearInterval(timer); }
    }, 16);
  }

  function resetCount(el) {
    el._done = false;
    el.textContent = (el.dataset.prefix||'') + '0' + (el.dataset.suffix||'');
  }

  // Main scroll handler
  function tick() {
    var scrollY = window.pageYOffset;
    var winH = window.innerHeight;
    var bottom = scrollY + winH;

    // Reveal elements
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
      var el = reveals[i];
      var rect = el.getBoundingClientRect();
      var inView = rect.top < winH - 40 && rect.bottom > 40;
      if (inView) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    }

    // Section header draw-line
    var headers = document.querySelectorAll('.section-header');
    for (var j = 0; j < headers.length; j++) {
      var h = headers[j];
      var hr = h.getBoundingClientRect();
      var hInView = hr.top < winH - 20 && hr.bottom > -50;
      if (hInView) {
        h.classList.add('draw-line', 'visible');
      } else {
        h.classList.remove('visible');
      }
    }

    // Count-up on cs-count elements
    var counts = document.querySelectorAll('.cs-count');
    for (var k = 0; k < counts.length; k++) {
      var c = counts[k];
      var cr = c.getBoundingClientRect();
      if (cr.top < winH - 20 && cr.bottom > 20) {
        countUp(c);
      } else {
        resetCount(c);
      }
    }
  }

  // Throttled scroll
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() { tick(); ticking = false; });
      ticking = true;
    }
  }, {passive: true});

  window.addEventListener('resize', tick, {passive: true});

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tick);
  } else {
    tick();
  }

  // ── CANVAS
  document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('pipeline-bg');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var nodes = [], edges = [], mouse = {x:-9999,y:-9999};

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (!canvas.width || !canvas.height) return;
      nodes = []; edges = [];
      var cols=9, rows=5, w=canvas.width, h=canvas.height;
      for (var r=0;r<rows;r++) for (var c=0;c<cols;c++) {
        var x=(c/(cols-1))*w*0.9+w*0.05+(Math.random()-0.5)*50;
        var y=(r/(rows-1))*h*0.85+h*0.075+(Math.random()-0.5)*35;
        nodes.push({x:x,y:y,ox:x,oy:y,r:Math.random()*2+1.5,p:Math.random()*Math.PI*2,s:0.018+Math.random()*0.018});
      }
      for (var i=0;i<nodes.length;i++) for (var j=i+1;j<nodes.length;j++) {
        var n=nodes[i],m=nodes[j];
        if (m.x>n.x&&m.x-n.x<200&&Math.abs(m.y-n.y)<110&&Math.random()>0.62)
          edges.push([i,j,Math.random(),Math.random()>0.65]);
      }
    }

    function draw() {
      requestAnimationFrame(draw);
      if (!canvas.width||!canvas.height) return;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (var i=0;i<nodes.length;i++) {
        var n=nodes[i];
        var dx=n.x-mouse.x, dy=n.y-mouse.y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<130&&d>0){var f=(130-d)/130*2;n.x+=dx/d*f;n.y+=dy/d*f;}
        n.x+=(n.ox-n.x)*0.05; n.y+=(n.oy-n.y)*0.05;
      }
      for (var j=0;j<edges.length;j++) {
        var e=edges[j],a=nodes[e[0]],b=nodes[e[1]];
        e[2]=(e[2]+0.005)%1;
        var g=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
        g.addColorStop(0,'rgba(15,14,13,0.03)');
        g.addColorStop(Math.max(0,e[2]-0.05),'rgba(200,68,26,0)');
        g.addColorStop(e[2],'rgba(200,68,26,0.55)');
        g.addColorStop(Math.min(1,e[2]+0.12),'rgba(200,68,26,0)');
        g.addColorStop(1,'rgba(15,14,13,0.02)');
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=g;ctx.lineWidth=e[3]?1.5:0.5;ctx.stroke();
      }
      for (var k=0;k<nodes.length;k++) {
        var n=nodes[k];n.p+=n.s;
        ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
        ctx.fillStyle='rgba(200,68,26,'+(0.15+Math.sin(n.p)*0.08)+')';ctx.fill();
      }
    }

    setTimeout(function(){resize();draw();},200);
    window.addEventListener('resize',resize,{passive:true});
    var hero=document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mousemove',function(e){
        var r=canvas.getBoundingClientRect();
        mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;
      });
      hero.addEventListener('mouseleave',function(){mouse.x=-9999;mouse.y=-9999;});
    }

    // Password input
    var pi=document.getElementById('csPasswordInput');
    if (pi) pi.addEventListener('keydown',function(e){if(e.key==='Enter')checkPassword();});
  });

  // ── CASE STUDY
  var CS_PW='insights2024',CS_DAYS=7,CS_KEY='cs_v1';
  window.closeCsGate = function closeCsGate(){
    var g=document.getElementById('csGate');
    if(g) g.classList.remove('visible');
  };

  window.showCsGate = function showCsGate(){
    try{var s=localStorage.getItem(CS_KEY);if(s){var d=JSON.parse(s);if(d.ok&&(Date.now()-d.t)/86400000<CS_DAYS){openCaseStudy();return;}localStorage.removeItem(CS_KEY);}}catch(e){}
    var g=document.getElementById('csGate');
    if(g){g.classList.add('visible');setTimeout(function(){g.scrollIntoView({behavior:'smooth',block:'center'});},100);}
  }
  window.checkPassword = function checkPassword(){
    var i=document.getElementById('csPasswordInput'),e=document.getElementById('csError');
    if(!i)return;
    if(i.value===CS_PW){
      try{localStorage.setItem(CS_KEY,JSON.stringify({ok:true,t:Date.now()}));}catch(x){}
      var g=document.getElementById('csGate');if(g)g.classList.remove('visible');
      openCaseStudy();
    }else{if(e)e.textContent='Incorrect password.';i.value='';i.focus();}
  }
  window.openCaseStudy = function openCaseStudy(){
    var f=document.getElementById('csFull'),l=document.getElementById('cs-expand-label'),a=document.getElementById('cs-expand-arrow');
    if(!f)return;f.classList.add('open');
    if(l)l.textContent='Collapse case study';if(a)a.textContent='↑';
    setTimeout(function(){f.scrollIntoView({behavior:'smooth',block:'start'});},100);
  }
  window.toggleCaseStudy = function(){ window.showCsGate(); };

  // ── DARK MODE
  var _dk=false;
  window.toggleDark = function toggleDark(){
    _dk=!_dk;document.body.classList.toggle('dark',_dk);
    var t=document.getElementById('toggleTrack'),i=document.getElementById('toggleIcon');
    if(t)t.classList.toggle('active',_dk);
    if(i)i.textContent=_dk?'☾':'☀︎';
  }

})();