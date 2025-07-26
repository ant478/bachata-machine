import { COUNT, Count } from 'src/machine';

export function getMoveGlyphSymbols(currentCount: Count, nextCount: Count): string {
    const number = currentCount === COUNT.RIGHT ? 1 : 5;
    const arrow =
        currentCount === COUNT.RIGHT
            ? currentCount !== nextCount
                ? '⭠'
                : '⮀'
            : currentCount !== nextCount
              ? '⭢'
              : '⮂';

    return currentCount === COUNT.RIGHT ? `${arrow}${number}` : `${number}${arrow}`;
}

export function getPositionGlyphSymbols(currentCount: Count): string {
    return currentCount === COUNT.RIGHT ? '⭲8' : '4⭰';
}
