import './App.css';

function App() {
    return (
        <div className={"app"}>
            <div className="controls">
                <div className="input">
                    <label htmlFor={"video"}>Video Url</label>
                    <input name={"video"} type="text" placeholder={"Video Url..."}/>
                </div>
                <div className="input">
                    <label htmlFor={"audio"}>Audio Url</label>
                    <input name={"audio"} type="text" placeholder={"Audio Url..."}/>
                </div>

            </div>
            <div className="video">
                <video></video>
            </div>
        </div>
    );
}

export default App;
