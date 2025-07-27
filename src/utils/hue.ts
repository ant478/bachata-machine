import { HUE_RANGE, DEFAULT_HUE } from 'src/constants/hue';
import { LS_KEY_BASE } from 'src/constants/local_storage';

const LOCAL_STORAGE_KEY = `${LS_KEY_BASE}:hue-value`;

export function validateHueValue(value: number | string) {
    return ~~((HUE_RANGE + (Number(value) || 0)) % HUE_RANGE);
}

export function saveHueValueToLocalStorage(value: number | string) {
    localStorage.setItem(LOCAL_STORAGE_KEY, `${validateHueValue(value)}`);
}

export function getHueValueFromLocalStorage() {
    return validateHueValue(localStorage.getItem(LOCAL_STORAGE_KEY) ?? DEFAULT_HUE);
}
