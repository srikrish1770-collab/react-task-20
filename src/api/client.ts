/** Swap this for fetch/axios when a real backend exists. */
export const respond = <T,>(value: T, ms = 700): Promise<T> => new Promise((res) => setTimeout(() => res(structuredClone(value)), ms))
