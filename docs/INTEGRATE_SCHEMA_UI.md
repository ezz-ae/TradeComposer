
# Integrate PlanCards into the main page

```tsx
import PlanCards from "@/app/components/PlanCards";

// inside the page component, where `plan`, `scopeData`, and `risk.knobs` are available:
{plan && (
  <div style={{ marginTop: 16 }}>
    <PlanCards
      plan={plan}
      scope={scopeData}
      riskKnobs={risk.knobs}
      onAction={(mode, task)=>{
        // re-use your existing handlers; example:
        if(mode==='review'){ setReviewIntent(task.order || task); return; }
        // otherwise call your onAct or onSend:
        if(mode==='force'){ onAct('force'); return; }
        if(mode==='test'){ onAct('test'); return; }
        if(mode==='prioritize'){ onAct('prioritize'); return; }
      }}
    />
  </div>
)}
```
