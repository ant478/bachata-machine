import 'reset-css';
import './main.scss';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { App } from 'src/components/app/app';
import { getHueValueFromLocalStorage } from 'src/utils/hue';
import store from 'src/store';

document.documentElement.style.setProperty('--hue', `${getHueValueFromLocalStorage()}`);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
