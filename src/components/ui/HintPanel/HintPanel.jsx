import "./HintPanel.css";

export function HintPanel({ hintData, onSelect }) {
    const handleClick = (item, e) => {
        onSelect(item);
    };

    return (
        <div className="hint-containter">
            {hintData.length !== 0 ? (
                hintData.map((item) => (
                    <div
                        key={item}
                        className="hint-item"
                        onMouseDown={(e) => handleClick(item, e)}
                    >
                        <p>{item}</p>
                    </div>
                ))
            ) : (
                <p style={{color: "#aaa"}}>Sin resultados</p>
            )}
        </div>
    );
}
