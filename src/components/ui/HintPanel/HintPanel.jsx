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
                        key={item.name}
                        className="hint-item"
                        onMouseDown={(e) => handleClick(item, e)}
                    >
                        <p>{item.name}</p>
                    </div>
                ))
            ) : (
                <p style={{color: "#aaa"}}>Sin resultados</p>
            )}
        </div>
    );
}
