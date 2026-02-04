import "./LoadingScreen.css";
import { COLOR } from "@/utils/consts";
import { Helix, DotWave } from "ldrs/react";
import "ldrs/react/Helix.css";
import "ldrs/react/DotWave.css";

export function LoadingScreenHelix() {
    return (
        <div className="loading-content">
            <Helix
                size="150"
                speed="2.5"
                color={COLOR.SECONDARYCOLOR}
            />
        </div>
    );
}

export function LoadingScreenDotWave() {
    return (
        <div className="loading-content">
            <DotWave
                size="75"
                speed="1"
                color={COLOR.SECONDARYCOLOR}
            />
        </div>
    );
}
