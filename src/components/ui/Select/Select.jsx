import "./Select.css";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import {
    Stack,
    HStack,
    Separator,
    Input,
    InputGroup,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { useAssemblyLines } from "@/hooks/useALine";

export function SelectAssemblyLine({ dataFromChild, ...props }) {
    const [selectedValues, setSelectedValues] = useState([]);
    const [search, setSearch] = useState("");
    const assemblyLines = useAssemblyLines(search);

    const addSelectedValues = (newValue) => {
        setSelectedValues((prevValues) => [...prevValues, newValue]);
    };

    const removeSelectedValues = (valueToRemove) => {
        setSelectedValues((prevValues) =>
            prevValues.filter((value) => value !== valueToRemove)
        );
    };

    // Opens select menu
    const handleOpenSelect = () => {
        const options = document.querySelector(".options");
        options.classList.toggle("options--active");
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
        dataFromChild(selectedValues);
    }, [selectedValues]);

    const ref = useClickAway(() => {
        const options = document.querySelector(".options");
        options.classList.remove("options--active");
    });

    const SelectList = () => {
        return (
            <>
                {assemblyLines.map((value, index) => (
                    <div
                        className="item"
                        onClick={() => handleSelectClick(value.name)}
                        key={index}>
                        {value.name}
                        {selectedValues.includes(value.name) ? (
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
                {...props}>
                <HStack
                    className="selector"
                    onClick={handleOpenSelect}>
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
                <div className="options">
                    <InputGroup
                        startElement={<IoSearch className="search-icon" />}
                        className="search-input-group">
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
                              key={value}
                              className="item-filter"
                              onClick={() => handleFilterClose(value)}>
                              <Text truncate>{value}</Text>
                              <IoIosClose className="item-filter-icon" />
                          </div>
                      ))
                    : null}
            </div>
        </div>
    );
}
