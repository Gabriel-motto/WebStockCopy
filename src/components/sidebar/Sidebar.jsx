import "./Sidebar.css";
import { Button, Popover, Portal } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { IconContext } from "react-icons";
import { FaBars } from "react-icons/fa";
import { PiFactory } from "react-icons/pi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { IoHomeOutline } from "react-icons/io5";
import { COLOR } from "@/utils/consts";
import { CustomLink } from "@/utils/Link.jsx";

export default function Sidebar({}) {
    return (
        <div className="nav">
            <IconContext.Provider value={{ color: COLOR.CORPYELLOW }}>
                <Tooltip
                    openDelay="500"
                    closeDelay="250"
                    content="Inicio"
                    positioning={{ placement: "right" }}
                >
                    <Button
                        className="item"
                        variant="ghost"
                        colorPalette="blue"
                        asChild
                    >
                        <CustomLink to="/">
                            <IoHomeOutline className="button-icon" />
                            <span className="button-text">Inicio</span>
                        </CustomLink>
                    </Button>
                </Tooltip>
                <Tooltip
                    openDelay="500"
                    closeDelay="250"
                    content="Máquinas"
                    positioning={{ placement: "right" }}
                >
                    <Button
                        className="item"
                        variant="ghost"
                        colorPalette="blue"
                        asChild
                    >
                        <CustomLink to="/machines">
                            <PiFactory className="button-icon" />
                            <span className="button-text">Máquinas</span>
                        </CustomLink>
                    </Button>
                </Tooltip>
                <Tooltip
                    openDelay="500"
                    closeDelay="250"
                    content="Piezas"
                    positioning={{ placement: "right" }}
                >
                    <Button
                        className="item"
                        variant="ghost"
                        colorPalette="blue"
                        asChild
                    >
                        <CustomLink to="/pieces">
                            <HiOutlineWrenchScrewdriver className="button-icon" />
                            <span className="button-text">Piezas</span>
                        </CustomLink>
                    </Button>
                </Tooltip>
            </IconContext.Provider>
        </div>
    );
}

export function CollapsedSidebar() {
    return (
        <Popover.Root size="xs" modal positioning={{ offset: { crossAxis: 0, mainAxis: 0 } }}>
            <IconContext.Provider value={{ color: COLOR.CORPBLUE }}>
                <Popover.Trigger asChild>
                    <Button variant="plain">
                        <FaBars />
                    </Button>
                </Popover.Trigger>
            </IconContext.Provider>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content css={{ "--popover-bg": COLOR.CORPBLUE }}>
                        <Popover.Body><Sidebar/></Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
}
