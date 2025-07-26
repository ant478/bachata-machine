import { LS_KEY_BASE } from 'src/constants/local_storage';
import { AnyActor } from 'xstate';

export type Combination = {
    id: number;
    name: string;
    snapshot: ReturnType<AnyActor['getPersistedSnapshot']>;
};

export function fetchCombinationsApi(): Combination[] {
    const raw = localStorage.getItem(`${LS_KEY_BASE}:combinations`);
    const combinations = JSON.parse(raw) as Combination[];
    const ids = new Set<number>();

    for (const combination of combinations) {
        let id = combination.id;
        while (ids.has(id)) id++;
        ids.add(id);
        combination.id = id;
    }

    return combinations;
}

export function pushCombinationsApi(combinations: Combination[]) {
    localStorage.setItem(`${LS_KEY_BASE}:combinations`, JSON.stringify(combinations));
}
