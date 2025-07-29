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
