import { IoImagesOutline } from "react-icons/io5";
import "./Home.css";
import { Image } from "@chakra-ui/react";
import { EmptyError } from "@/components/ui/EmptyStates";

export default function HomePage() {
    return (
        <div className="main-container">
            <div className="titles main-title">Web Stock Demo</div>
            <div className="main-body">
                <div className="factory-image">
                    <EmptyError
                        indicator={<IoImagesOutline />}
                        title="IMAGEN DE FABRICA"
                        description="Aquí iría una imagen representativa de la fábrica."
                    />
                </div>
            </div>
        </div>
    );
}
