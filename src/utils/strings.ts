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

export function filterUserInput(text: string): string {
    if (typeof text !== 'string') return '';

    return text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[\r\n]+/g, '')
        .replace(/[^\x20-\x7Eа-яА-ЯёЁ0-9.,:;!?()\[\]{}"'\-+=_@#%^&*/\\<>|~`$€£₽]+/g, '')
        .slice(0, 100)
        .replace(/["'&<>]/g, ch => {
            const map: Record<string, string> = {
                '"': '&quot;',
                "'": '&#39;',
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
            };
            return map[ch] || ch;
        });
}
