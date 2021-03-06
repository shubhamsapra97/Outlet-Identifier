import React, {useState} from "react";
import {get} from "lodash";
import "./LocationInput.css";

const LocationInput = ({text}) => {
    const [locationInput, setLocationInput] = useState("");
    const [error, setError] = useState(null);
    const [identifier, setIdentifier] = useState(null);
    const onLocationInputChange = (e) => {
        const val = e.target.value;
        setLocationInput(val);
    }
    const fetchOutletIdentifier = async (e) => {
        e.preventDefault();
        if (!locationInput) return;

        let url = `http://localhost:1111/getOutletIdentifier?address=${locationInput}`;
        const res = await fetch(url);
        const data = await res.json();

        const identifier = get(data[0], "identifier", "");
        const message = get(data[0], "message", "");
        if (identifier) {
            setError(null);
            setIdentifier(identifier);
        } else if (message) {
            setIdentifier(null);
            setError(message);
        }
        setLocationInput("");
    }

    return (
        <div className={"input-container"}>
            <form onSubmit={fetchOutletIdentifier}>
                <input
                    value={locationInput}
                    className="input"
                    onChange={onLocationInputChange}
                />
                <button
                    type="submit"
                    className={"submit-button"}
                >
                    Submit
                </button>
            </form>
            <div className={"result-container"}>
                <div>{identifier ? `Identifier: ${identifier}` : null}</div>
                <div>{error ? `Message: ${error}` : null}</div>
            </div>
        </div>
    );
};

export default LocationInput;