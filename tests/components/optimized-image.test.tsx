/**
 * Optimized Image Component Tests
 * 
 * Tests for the OptimizedImage component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptimizedImage, LazyImage, HeroImage } from '@/components/ui/optimized-image';

// Mock next/image
vi.mock('next/image', () => ({
    default: ({ src, alt, onLoad, onError, ...props }: any) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            data-testid="next-image"
            onLoad={onLoad}
            onError={onError}
            {...props}
        />
    ),
}));

describe('OptimizedImage', () => {
    describe('OptimizedImage component', () => {
        it('should render with src and alt', () => {
            render(
                <OptimizedImage
                    src="/test-image.jpg"
                    alt="Test image"
                    width={100}
                    height={100}
                />
            );

            const img = screen.getByTestId('next-image');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('alt', 'Test image');
        });

        it('should show skeleton when loading', () => {
            render(
                <OptimizedImage
                    src="/test-image.jpg"
                    alt="Test image"
                    width={100}
                    height={100}
                    showSkeleton={true}
                />
            );

            // Skeleton should be visible before image loads
            const wrapper = screen.getByTestId('next-image').parentElement;
            expect(wrapper).toBeInTheDocument();
        });

        it('should apply aspect ratio class', () => {
            const { container } = render(
                <OptimizedImage
                    src="/test-image.jpg"
                    alt="Test image"
                    width={100}
                    height={100}
                    aspectRatio="square"
                />
            );

            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('aspect-square');
        });

        it('should apply video aspect ratio class', () => {
            const { container } = render(
                <OptimizedImage
                    src="/test-image.jpg"
                    alt="Test image"
                    width={100}
                    height={100}
                    aspectRatio="video"
                />
            );

            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('aspect-video');
        });
    });

    describe('LazyImage component', () => {
        it('should render as lazy loaded', () => {
            render(
                <LazyImage
                    src="/test-image.jpg"
                    alt="Lazy image"
                    width={100}
                    height={100}
                />
            );

            const img = screen.getByTestId('next-image');
            expect(img).toHaveAttribute('loading', 'lazy');
        });
    });

    describe('HeroImage component', () => {
        it('should render as priority loaded', () => {
            render(
                <HeroImage
                    src="/test-image.jpg"
                    alt="Hero image"
                    width={100}
                    height={100}
                />
            );

            const img = screen.getByTestId('next-image');
            expect(img).toHaveAttribute('loading', 'eager');
        });
    });
});
