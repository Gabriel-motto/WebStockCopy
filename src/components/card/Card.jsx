import { Card, Button, Image, Text } from "@chakra-ui/react";
import "./Card.css";
import { IoWarningOutline } from "react-icons/io5";

export function CardText({ title, description, footer, ...props }) {
    return (
        <Card.Root
            className="content-card"
            {...props}
        >
            <Card.Body
                gap="2"
                className="body"
            >
                <Card.Title className="title">{title}</Card.Title>
                <Card.Description
                    className="description"
                    lineClamp="3"
                >
                    {description}
                </Card.Description>
            </Card.Body>
            <Card.Footer>
                <Text
                    className="footer"
                    textStyle="2xl"
                    letterSpacing="tight"
                    mt="2"
                    truncate
                >
                    {footer}
                </Text>
            </Card.Footer>
        </Card.Root>
    );
}

export function CardImage({
    title,
    image,
    description,
    footer,
    isCritical,
    ...props
}) {
    return (
        <Card.Root
            className="content-card"
            {...props}
        >
            <Image
                src={image}
                alt={`Producto con referencia: ${title}`}
                padding="10px"
            />
            <Card.Body
                gap="2"
                className="body"
            >
                <Card.Title
                    className="card-title title"
                    fontWeight="medium"
                >
                    {title}
                </Card.Title>
                <Card.Description
                    className="description"
                    lineClamp="3"
                >
                    {description}
                </Card.Description>
            </Card.Body>
            <Card.Footer className="footer card-footer">
                <Text
                    textStyle="2xl"
                    letterSpacing="tight"
                    mt="2"
                    truncate
                >
                    {footer}
                </Text>
                {isCritical && (
                    <div className="critical-badge-card">
                        <IoWarningOutline />
                    </div>
                )}
            </Card.Footer>
        </Card.Root>
    );
}

export default function CardComponent({
    haveImage,
    image,
    title,
    description,
    footer,
    ...props
}) {
    return haveImage ? (
        <CardImage
            title={title}
            image={image}
            description={description}
            footer={footer}
            {...props}
        />
    ) : (
        <CardText
            title={title}
            description={description}
            footer={footer}
            {...props}
        />
    );
}
