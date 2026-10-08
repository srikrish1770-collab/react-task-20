import { useEffect } from 'react'
export function useLoad(load: () => Promise<void>, hasData: boolean) { useEffect(() => { if (!hasData) void load() }, [load, hasData]) }
