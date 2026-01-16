import "./Select.css";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { HStack, Separator, Input, InputGroup, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { useAssemblyLines } from "@/hooks/useALine";
import { navigateTo } from "@/utils/Link";

export function SelectAssemblyLine({ dataFromChild, ...props }) {
    const [selectedValues, setSelectedValues] = useState([]);
    const [search, setSearch] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const assemblyLines = useAssemblyLines({ search: search });

    const addSelectedValues = (newValue) => {
        setSelectedValues((prevValues) => [...prevValues, newValue]);
    };

    const removeSelectedValues = (valueToRemove) => {
        setSelectedValues((prevValues) =>
            prevValues.filter((value) => value !== valueToRemove)
        );
    };

    // Set selected item to filter data
    const handleSelectClick = (value) => {
        selectedValues.includes(value)
            ? removeSelectedValues(value)
            : addSelectedValues(value);
    };

    const handleFilterClose = (value) => {
        removeSelectedValues(value);
    };

    useEffect(() => {
        dataFromChild(selectedValues.map((line) => line.id));
    }, [selectedValues]);

    const ref = useClickAway(() => {
        setShowOptions(false);
    });

    const SelectList = () => {
        return (
            <>
                {assemblyLines.map((value, index) => (
                    <div
                        className="item"
                        onClick={() => handleSelectClick(value)}
                        key={index}
                    >
                        {value.name}
                        {selectedValues.includes(value) ? (
                            <FaCheck className="selected-icon" />
                        ) : null}
                    </div>
                ))}
            </>
        );
    };

    return (
        <div className="select-assembly-line">
            <div
                ref={ref}
                className="custom-select"
                {...props}
            >
                <HStack
                    className="selector"
                    onClick={() => setShowOptions(!showOptions)}
                >
                    <Text className="text-selected">Selecciona una línea</Text>
                    <HStack className="separator-icon">
                        <Separator
                            orientation="vertical"
                            height="5"
                            size="md"
                        />
                        <IoIosArrowDown />
                    </HStack>
                </HStack>
                <div className={`options ${showOptions ? "show" : ""}`}>
                    <InputGroup
                        startElement={<IoSearch className="search-icon" />}
                        className="search-input-group"
                    >
                        <Input
                            className="search-input"
                            placeholder="Buscar..."
                            variant="flushed"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>
                    <SelectList />
                </div>
            </div>
            <div className="grid-item-filter">
                {selectedValues.length > 0
                    ? selectedValues.map((value) => (
                          <div
                              key={value.name}
                              className="item-filter"
                              onClick={() => handleFilterClose(value)}
                          >
                              <Text truncate>{value.name}</Text>
                              <IoIosClose className="item-filter-icon" />
                          </div>
                      ))
                    : null}
            </div>
        </div>
    );
}

export function CustomSelect({
    dataFromChild,
    content,
    label = "Selecciona una opción",
    showSelected = false,
    ...props
}) {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    // useEffect(() => {
    //     dataFromChild(selectedValue);
    // }, [selectedValue]);

    const handleClick = (value) => {
        dataFromChild(value);
        value === selectedValue
            ? setSelectedValue(null)
            : setSelectedValue(value);
        setShowOptions(false);
    };

    const ref = useClickAway(() => {
        setShowOptions(false);
    });

    return (
        <div
            ref={ref}
            className="custom-select-container"
            {...props}
            onClick={() => setShowOptions(!showOptions)}
        >
            <div className="custom-selector">
                <p className="selector-label">{label}</p>
                <Separator
                    orientation="vertical"
                    height="5"
                    size="md"
                />
                <IoIosArrowDown />
            </div>
            <div
                className={`${
                    showOptions ? "custom-options show" : "custom-options"
                }`}
            >
                {content?.map((item, index) => (
                    <div
                        className={`${
                            item.value === "delete"
                                ? "custom-item delete"
                                : "custom-item"
                        }`}
                        key={index}
                        onClick={() => {
                            handleClick(item.value);
                        }}
                    >
                        {item.label}
                        {showSelected && selectedValue?.includes(item.value) ? (
                            <FaCheck className="selected-icon" />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
