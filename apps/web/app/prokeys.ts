
import { useHotkeys } from "react-hotkeys-hook";
export function useProKeys(opts:{ getIntent: ()=>any }){
  const act = (mode:string)=>fetch("/api/orders",{method:"POST", headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ mode, intent: opts.getIntent() })});
  useHotkeys('shift+enter', ()=>act('force'));
  useHotkeys('shift+p',     ()=>act('prioritize'));
  useHotkeys('shift+t',     ()=>act('test'));
  useHotkeys('shift+r',     ()=>act('review'));
}
