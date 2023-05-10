import './App.css';
import {useEffect} from "react";
import {useTelegram} from "./hooks/useTelegram";
import {Route, Routes} from 'react-router-dom'
import ProductList from "./components/ProductList/ProductList";

function App() {
    const {tg} = useTelegram();

    useEffect(() => {
        tg.ready();
    }, [])

    return (
        <div className="App">
            <Routes>
                <Route path="*" element={<ProductList />}/>
            </Routes>
        </div>
    );
}

export default App;
