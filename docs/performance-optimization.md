# 성능 최적화

## 코드 스플리팅

```tsx
import { lazy, Suspense } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## 메모리 최적화

```tsx
import { memo, useMemo, useCallback } from "react";

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map((item) => ({ ...item, processed: true }));
  }, [data]);

  const handleUpdate = useCallback(
    (id) => {
      onUpdate(id);
    },
    [onUpdate],
  );

  return (
    <div>
      {processedData.map((item) => (
        <div key={item.id} onClick={() => handleUpdate(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```
