import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {Store} from "./Store";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import {AppWrapper} from "./components/common/PageMeta.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
    <>
        <ThemeProvider>
            <AppWrapper>
                <Provider store={Store}>
                    <GoogleOAuthProvider clientId="156685535196-s7n5vdbie6gbpmj1ilmuo4bls07082r9.apps.googleusercontent.com">
                        <App/>
                    </GoogleOAuthProvider>
                </Provider>
            </AppWrapper>
        </ThemeProvider>
    </>,
)
