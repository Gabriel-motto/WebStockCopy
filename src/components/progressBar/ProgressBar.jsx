import "./ProgressBar.css";

export function LinearProgressBar({ current = 0, max, title }) {
    const progress = (current / max * 100);

    return (
        <div>
            <div className="progress-bar-title title">{title}</div>
            <div className="progress-bar-container">
                <div className="linear-progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-bar-sidetext">{progress.toFixed(2)}% ({current}/{max})</div>
            </div>
        </div>
    )
}