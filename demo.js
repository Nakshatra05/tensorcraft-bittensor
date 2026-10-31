export function demoBuild(prompt = '') {
  const theme = /bridge/i.test(prompt) ? 'bridge' : /garden|park/i.test(prompt) ? 'garden' : /house|home|cabin/i.test(prompt) ? 'cabin' : 'tower';
  const blocks = [];
  const put = (x,y,z,block) => blocks.push({ op:'set', at:[x,y,z], block });
  if (theme === 'bridge') {
    for(let x=-3;x<=3;x++) for(let z=0;z<=18;z++) { put(x,2,z,'planks'); if(Math.abs(x)===3) put(x,3,z,'stone_bricks'); }
    for(const z of [0,6,12,18]) for(const x of [-3,3]) { put(x,4,z,'log'); put(x,5,z,'glowstone'); }
  } else if(theme === 'garden') {
    for(let x=-7;x<=7;x++) for(let z=-7;z<=7;z++) { put(x,0,z,'grass'); if(x===0 || z===0) put(x,1,z,'stone_bricks'); }
    for(const x of [-5,5]) for(const z of [-5,5]) { for(let y=1;y<5;y++) put(x,y,z,'log'); for(let a=-2;a<=2;a++) for(let b=-2;b<=2;b++) put(x+a,5,z+b,'leaves'); }
    put(0,2,0,'glowstone');
  } else {
    const h = theme === 'cabin' ? 5 : 12;
    for(let y=0;y<=h;y++) for(let x=-3;x<=3;x++) for(let z=-3;z<=3;z++) {
      if(y===0 || y===h || Math.abs(x)===3 || Math.abs(z)===3) {
        if(z===-3 && x===0 && y>0 && y<4) continue;
        put(x,y,z, y===h ? 'planks' : y%4===2 && (x===0 || z===0) ? 'glass' : theme==='cabin' ? 'log' : 'stone_bricks');
      }
    }
    for(const x of [-3,3]) for(const z of [-3,3]) put(x,h+1,z,'glowstone');
  }
  return { message:`Demo blueprint: ${theme}. This is a local preset, not a Bittensor inference result. Try tower, bridge, cabin or garden.`, actions:[{ do:'build', at:'look', ops:blocks }], cost:0, inference:{ provider:'demo', verifiedResponse:false, network:null } };
}

