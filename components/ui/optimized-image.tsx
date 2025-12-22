"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
    fallbackSrc?: string;
    aspectRatio?: "square" | "video" | "portrait" | "auto";
    showSkeleton?: boolean;
}

/**
 * OptimizedImage - Enhanced Next.js Image with loading states and fallbacks
 * 
 * Features:
 * - Loading skeleton while image loads
 * - Fallback image on error
 * - Aspect ratio presets
 * - Blur placeholder support
 * - WebP/AVIF format optimization (handled by Next.js)
 */
export function OptimizedImage({
    src,
    alt,
    className,
    fallbackSrc = "/assets/images/placeholder.webp",
    aspectRatio = "auto",
    showSkeleton = true,
    priority = false,
    ...props
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);

    const aspectRatioClasses = {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]",
        auto: "",
    };

    return (
        <div className={cn("relative overflow-hidden", aspectRatioClasses[aspectRatio], className)}>
            {/* Loading Skeleton */}
            {showSkeleton && isLoading && !error && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
            )}

            <Image
                src={error ? fallbackSrc : imageSrc}
                alt={alt}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setError(true);
                    setIsLoading(false);
                    setImageSrc(fallbackSrc);
                }}
                priority={priority}
                {...props}
            />
        </div>
    );
}

/**
 * LazyImage - Only loads when in viewport
 * Good for below-the-fold images
 */
export function LazyImage(props: OptimizedImageProps) {
    return (
        <OptimizedImage
            {...props}
            loading="lazy"
            priority={false}
        />
    );
}

/**
 * HeroImage - Priority loaded image for above-the-fold content
 */
export function HeroImage(props: OptimizedImageProps) {
    return (
        <OptimizedImage
            {...props}
            priority={true}
            loading="eager"
        />
    );
}
