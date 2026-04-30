import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { IFanzineData } from "../FanzineArchive/data";
import { useNavigate } from "react-router-dom";

export interface IFanzine {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    data?: IFanzineData
    setData: Dispatch<SetStateAction<IFanzineData | undefined>>
    currentPage: number
    setCurrentPage: Dispatch<SetStateAction<number>>
}
export const FanzineContext = createContext<IFanzine>({} as IFanzine);


export function useFanzine(defaultFanzine?: IFanzineData) {

    const [isOpen, setIsOpen] = useState(defaultFanzine != undefined);
    const [data, setData] = useState<IFanzineData | undefined>(defaultFanzine);
    const [currentPage, setCurrentPage] = useState(0);


    const navigate = useNavigate();
    useEffect(()=>{
        // console.log("set fanz data", data)

        setIsOpen(data != undefined);
        navigate(data != undefined ? '/' + data.id : "/");

    }, [data])

    return {
        isOpen,
        setIsOpen,
        data,
        setData,
        currentPage,
        setCurrentPage
    } as IFanzine

}