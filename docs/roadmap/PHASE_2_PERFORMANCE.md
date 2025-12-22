# Phase 2: Performance Quick Wins

**Timeline:** Week 2, Days 1-3 (24h) | **Priority:** 🟡 HIGH

---

## Task 2.1: Image Optimization (4h)

### Install dependencies
```bash
npm install -D @squoosh/cli sharp
```

### Create optimization script
```bash
#!/bin/bash
find public/assets/images -name "*.png" -size +1M -exec \
    npx @squoosh/cli --webp 80 --resize '{"enabled": true, "width": 1920}' {} \;
```

### Create optimized image component
**File:** `/components/ui/optimized-image.tsx`

```typescript
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    alt: string;
}

export function OptimizedImage({ src, alt, ...props }: OptimizedImageProps) {
    const webpSrc = src.replace(/\.png$/, '.webp');
    
    return (
        <Image
            src={webpSrc}
            alt={alt}
            {...props}
            placeholder="blur"
            blurDataURL="data:image/png;base64,..."
        />
    );
}
```

---

## Task 2.2: Code Splitting (8h)

### Lazy load AI chat widget
**File:** `/app/[locale]/layout.tsx`

```typescript
import dynamic from 'next/dynamic';

const PublicAgentWrapper = dynamic(
    () => import('@/components/ai/public-agent-wrapper').then(m => ({ 
        default: m.PublicAgentWrapper 
    })),
    { ssr: false, loading: () => null }
);
```

### Create loading states
**File:** `/app/[locale]/admin/loading.tsx`

```typescript
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
    return (
        <div className="space-y-6 p-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
        </div>
    );
}
```

### Enable package optimization
**File:** `/next.config.ts`

```typescript
experimental: {
    optimizePackageImports: [
        'lucide-react',
        '@radix-ui/react-accordion',
        'framer-motion',
    ],
}
```

---

## Task 2.3: Replace Framer Motion with CSS (8h)

### Add CSS animations
**File:** `/app/globals.css`

```css
@keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-200 { animation-delay: 200ms; }
```

### Replace motion components
```typescript
// BEFORE
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

// AFTER
<div className="animate-fade-in-up">
```

---

## Task 2.4: Optimize Firebase (4h)

### Split Firebase modules
- `/lib/firebase-client.ts` - For public pages (auth only)
- `/lib/firebase-app.ts` - Full SDK for authenticated pages

### Lazy load in auth context
```typescript
useEffect(() => {
    async function initAuth() {
        const { auth } = await import('@/lib/firebase-app');
        // ...
    }
    initAuth();
}, []);
```

---

## Expected Results
- Images: -110MB total assets
- Bundle: -150KB initial
- LCP: -2s improvement
