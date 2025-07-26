import { PositionId, Count } from './types';

export function packState<P extends PositionId, C extends Count>(positionId: P, count: C) {
    return `${positionId}:${count}` as const;
}

export const unpackState = (state: string) => {
    const unpacked = state.split(':');

    return [unpacked[0], Number(unpacked[1])] as [positionId: PositionId, count: Count];
};
