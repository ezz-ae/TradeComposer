const act = (mode:string)=>fetch("/api/orders",{method:"POST", headers:{
  'Content-Type':'application/json','x-role':'pro','x-device-lease':'dev-lease-demo'
}, body: JSON.stringify({ mode, intent: opts.getIntent() })});