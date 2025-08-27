import { Popover } from "@chakra-ui/react";

export function PopoverComponent({ title, content, trigger, ...props }) {
    return (
        <Popover.Root {...props}>
            <Popover.Trigger asChild>
                {trigger}
            </Popover.Trigger>
            <Popover.Positioner>
                <Popover.Content>
                    <Popover.CloseTrigger />
                    <Popover.Arrow />
                    <Popover.Body>
                        <Popover.Title>{title}</Popover.Title>
                        {content}
                    </Popover.Body>
                </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    );
}
