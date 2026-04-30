import { useEffect, useState } from "react";
import { fanzineData } from "./components/FanzineArchive/data";
import FanzineArchive from "./components/FanzineArchive/FanzineArchive";


export default function App() {

    const [isFontLoaded, setIsFontLoaded] = useState(false);

    // APP LOADER: wait for font to load
    useEffect(() => {
        const loadFont = async () => {
            try {
                await document.fonts.load('1em "ronzino"');

                await document.fonts.ready;

                setIsFontLoaded(true);
            } catch (error) {
                console.error("Font loading failed:", error);
                setIsFontLoaded(true);
            }
        };

        loadFont();
    }, []);

    if (!isFontLoaded) {
        return (
            <div className="h-[100dvh] w-screen bg-black flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <FanzineArchive fanzineData={fanzineData}></FanzineArchive>
    )
}