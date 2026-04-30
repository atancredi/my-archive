import { CSSProperties, JSX, ComponentProps, forwardRef, RefObject, useEffect, useRef, useContext } from 'react';
import { FanzineContext } from './useFanzine';
import BackgroundImageContainer from '../BackgroundImageContainer/BackgroundImageContainer';


export interface IPage {
	id?: number
	imageUrl: string
	style?: CSSProperties
	children?: JSX.Element
}

export interface FanzinePageProps extends ComponentProps<'div'> {
	page: IPage
	isVisible: boolean
}


const Fanzine = () => {


	const context = useContext(FanzineContext);

	const containerRef = useRef<HTMLDivElement>(null);
	const pageRefs = useRef<(HTMLElement | null)[]>([]);

	useEffect(() => {
		if (context.data != undefined)
			document.title = "my archive - " + context.data.id;
    }, []);


	useEffect(() => {
		// console.log("updated fanzine data", context.data)
		const observerOptions = {
			root: containerRef.current,
			rootMargin: '0px',
			threshold: 0.26,
		};

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const index = pageRefs.current.indexOf(entry.target as HTMLElement);
					if (index !== -1) {
						context.setCurrentPage(index);
					}
				}
			});
		};

		const observer = new IntersectionObserver(observerCallback, observerOptions);

		pageRefs.current.forEach((section) => {
			if (section) observer.observe(section);
		});

		return () => observer.disconnect();
	}, [context.data]);


	// useEffect(() => {
	// 	console.log("current page", context.currentPage)
	// }, [context.currentPage])

	const scrollToPage = (index: number) => {
		const container = containerRef?.current;
		const section = pageRefs?.current[index];

		if (container && section) {
			section.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};


	const closeFanzine = () => {
		context.setIsOpen(!context.isOpen)
		context.setData(undefined)
	}


	return (
		<div ref={containerRef} className={
			"overflow-y-scroll snap-mandatory snap-y scroll-smooth [overflow-anchor:none] " +
			"h-[100dvh] w-screen bg-black "
		}>
			<div className={'fixed z-[9997] top-0 left-0 w-screen flex flex-row justify-between px-[5px] ' +
				'[font-size:var(--text-2xl)] text-white mix-blend-color-dodge items-baseline align-baseline'}>
				<div className=''>
					{context.data?.title ?? ""}
				</div>
				<div className='[font-size:var(--text)]'>
					{context.data?.subtitle ?? ""}
				</div>
			</div>
			{context.data && context.data.pages.map((page, index) => (
				<Fanzine.Page
					key={page.id + "-" + index}
					page={page}
					style={{ backgroundImage: "url(" + page.imageUrl + ")", ...page.style }}
					ref={(el) => { pageRefs.current[index] = el }}
					// isVisible={Math.abs(context.currentPage - index) <= 1}
					isVisible={Math.abs(context.currentPage - index) <= 2}
				>
					{/* {index == 0 && (
						<img className='icons-stars' src='icons/stars-10.svg' />
					)} */}
				</Fanzine.Page>
			))}
			<div className='flex flex-col gap-[2dvh] fixed bottom-[calc(1rem+var(--text-4xl))] right-[10px]'>
				<div className={
					"translate-y-[2px] flex flex-col gap-[10px] items-right"
				}>
					{context.data && context.data.pages.map((_, idx) => (
						<div
							key={idx}
							onClick={() => scrollToPage(idx)}
							aria-label={`Go to page ${idx + 1}`}
							className={'w-[10px] h-[10px] rounded-[50%] bg-white opacity-50 self-end ' +
								'transition duration-200 ease-in ' +
								(context.currentPage === idx ? 'scale-[1.2] opacity-100' : '')}
						/>
					))}
				</div>
				
			</div>
			<div
				onClick={closeFanzine}
				className={
					'fixed bottom-0 right-[10px] ' +
					'[font-size:var(--text-3xl)] text-white mix-blend-color-dodge'
				}
			>close</div>

		</div>
	);
}


Fanzine.Page = forwardRef<HTMLElement, FanzinePageProps>(({
	children,
	page,
	style,
	className = "",
	isVisible = false
}, ref) => {

	return (
		<BackgroundImageContainer
			ref={ref as RefObject<HTMLDivElement>}
			image={page.imageUrl}
			className={
				"relative block align-top leading-[0] text-[0px] " + // removes the margin at the bottom of the container reserved for the 'descenders'
				"relative h-[100dvh] w-screen items-center " +
				"flex flex-col justify-center " +
				"bg-cover bg-center bg-no-repeat " +
				"transition-opacity duration-100 ease-in " +
				"snap-start snap-always " +
				className
			}
			visible={isVisible}
			style={style}
		>
			{children}
		</BackgroundImageContainer>

	);
});

export default Fanzine
