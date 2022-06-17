
import { HashRouter as Router } from "react-router-dom"
import Platform from "components/Platform/Platform";

function Root() {
    return (
        <Router>
            <Platform />
        </Router>

    );
}

export default Root;
