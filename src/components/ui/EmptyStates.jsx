import { EmptyState, VStack } from "@chakra-ui/react";
import { BsGearWideConnected } from "react-icons/bs";
import { CiImageOff } from "react-icons/ci";
import { TbError404Off } from "react-icons/tb";

export function EmptyError({ indicator = <TbError404Off />, title = "ERROR", description = "Error inesperado" }) {
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    {indicator}
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>{title}</EmptyState.Title>
                    <EmptyState.Description>
                        {description}
                    </EmptyState.Description>
                </VStack>
            </EmptyState.Content>
        </EmptyState.Root>
    );
}