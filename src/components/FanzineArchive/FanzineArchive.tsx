import { useContext, useEffect } from 'react';
import Fanzine from '../Fanzine/Fanzine';
import { FanzineContext, useFanzine } from '../Fanzine/useFanzine';
import { useParams } from 'react-router-dom';
import { IFanzineData } from './data';
import BackgroundImageContainer from '../BackgroundImageContainer/BackgroundImageContainer';




export interface FanzineArchiveProps {
	fanzineData: IFanzineData[]
}

const FanzineArchive = ({ fanzineData }: Readonly<FanzineArchiveProps>) => {

	

	// get fanzine from route
	const { id } = useParams();
	const defaultFanzine = fanzineData.filter(x => x.id == id)[0] ?? undefined

	const fanzine = useFanzine(defaultFanzine);

	useEffect(() => {
		if (fanzine.data == undefined)
        	document.title = "my archive";
    }, [fanzine.data]);

	return (
		<FanzineContext.Provider value={fanzine}>

			{fanzine.isOpen ? (
				<Fanzine></Fanzine>
			) : (
				<FanzineArchive.List fanzineData={fanzineData} />
			)}

		</FanzineContext.Provider>
	)
}

export interface FanzineArchiveListProps extends FanzineArchiveProps { }

FanzineArchive.List = ({ fanzineData }: Readonly<FanzineArchiveListProps>) => {

	const context = useContext(FanzineContext);

	const openFanzine = (data: IFanzineData) => {
		context?.setData(data);
		context?.setIsOpen(true);
	}

	return (
		<div className={
			'h-[100dvh] w-screen bg-black ' +
			'overflow-y-scroll snap-y snap-mandatory scroll-smooth ' +
			'block align-top leading-[0] text-[0px] '
		}>
			{fanzineData.map((data, i) => {
				return (
					<BackgroundImageContainer
						image={data.pages[0].imageUrl}
						style={{ ...data.cardStyles, height: "12rem" }}
						className='relative'
						onClick={() => { openFanzine(data) }}
						key={data.id + "-" + i}>
						<div className={'absolute bottom-0 right-0 [font-size:var(--text-xl)] [line-height:1.2] px-[1px] ' +
							'text-white mix-blend-color-dodge z-10'}>
							<div>{data.title}</div>
						</div>
					</BackgroundImageContainer>
				)
			})}
		</div>
	)
}



export default FanzineArchive;