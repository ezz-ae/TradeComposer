
export default function DashboardPage(){
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontWeight:800, fontSize:22 }}>TradeComposer · Dashboard</h1>
      <div style={{ display:'grid', gap:12, gridTemplateColumns:'1fr', marginTop:12 }}>
        <section style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <h2>Profile</h2>
          <p>Shows UID, role, plan, usage. (wire to Firestore /users/{uid})</p>
        </section>
        <section style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <h2>Connections</h2>
          <ul>
            <li>Exchanges (CCXT keys)</li>
            <li>Wallets (EVM address)</li>
            <li>Webhooks</li>
          </ul>
        </section>
        <section style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <h2>Integrations</h2>
          <ul>
            <li>Telegram bot</li>
            <li>Discord bot</li>
            <li>Zapier / n8n</li>
          </ul>
        </section>
        <section style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <h2>Billing</h2>
          <p>Crypto payments via Coinbase Commerce-compatible endpoint. Status from Firestore /payments</p>
          <button>Pay with Crypto</button>
        </section>
      </div>
    </div>
  );
}
