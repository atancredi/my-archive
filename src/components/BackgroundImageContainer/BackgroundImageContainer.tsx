import { CSSProperties, forwardRef, MouseEventHandler, PropsWithChildren, useEffect, useImperativeHandle, useRef, useState } from "react";
import { loadedImageCache } from "./loadedImageCache";


export interface BackgroundImageContainerProps extends PropsWithChildren {
    image: string
    visible?: boolean
    className?: string
    style?: CSSProperties
    onClick?: MouseEventHandler
}

const BackgroundImageContainer = forwardRef<HTMLDivElement, BackgroundImageContainerProps>(({
    image,
    visible,
    className,
    style,
    onClick,
    children
}, ref) => {

    const [isLoaded, setIsLoaded] = useState(() => loadedImageCache.has(image));
    const [isVisible, setIsVisible] = useState(visible);
    const [hasError, setHasError] = useState(false);


    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const fullStyle = {
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundImage: isLoaded ? `url(${image})` : 'none',
        transition: 'background-image 0.3s ease-in-out',
        ...style,
    } as CSSProperties


    useEffect(() => {
        // If already loaded from cache, do not attach the intersection observer
        if (isLoaded) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, {
            rootMargin: '300px'
        });

        if (internalRef.current) observer.observe(internalRef.current);
        return () => observer.disconnect();
    }, [isLoaded]);

    useEffect(() => {
        if (!isVisible || isLoaded) return;

        const img = new Image();
        img.src = image;
        img.onload = () => {
            setIsLoaded(true);
            loadedImageCache.add(image); // Add to global cache
        };
        img.onerror = () => setHasError(true);
    }, [isVisible, image, isLoaded]);

    return (
        <div
            ref={internalRef}
            className={`w-full relative bg-neutral-900 ${className ?? ""}`}
            style={fullStyle}
            onClick={onClick}
        >
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center z-0 text-white text-sm">
                    image not found
                </div>
            )}
            {!hasError && !isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div>
                </div>
            )}

            {children}

        </div>
    )
});



export default BackgroundImageContainer;