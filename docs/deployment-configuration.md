# 배포 설정

## 프로덕션 빌드

```bash
npm run build
```

## Vite 설정 최적화

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["tanstack/react-router"],
        },
      },
    },
  },
});
```
