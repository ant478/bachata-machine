export function throwIfHasDuplicates(values: any[]) {
    const set = new Set();

    for (const value in values) {
        if (set.has(value)) {
            throw new Error(`throwIfHasDuplicates: duplicates found: "${value}"`);
        }
        set.add(value);
    }
}

type StatesMap = Record<
    string,
    {
        on: Record<string, string | { target: string }>;
    }
>;

export function decorateWithActions<T extends StatesMap>(states: T, actions: string[]): StatesMap {
    const result: StatesMap = {};

    for (const [stateKey, stateConfig] of Object.entries(states)) {
        const decoratedOn: Record<string, { target: string; actions: string[] }> = {};

        for (const [event, def] of Object.entries(stateConfig.on)) {
            const target = typeof def === 'string' ? def : def.target;

            decoratedOn[event] = { target, actions };
        }

        result[stateKey] = { on: decoratedOn };
    }

    return result;
}
