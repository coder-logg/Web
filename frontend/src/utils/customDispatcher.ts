export function customDispatcher<E, V, T>(
    extractor: (event: E) => V | undefined,
    dispatch: (value: T) => void,
    caster: (value: V) => T
) {
    return (event: E) => {
        const value = extractor(event);

        if (value !== undefined) {
            setTimeout(() => dispatch(caster(value)), 1);
        }
    }
}
