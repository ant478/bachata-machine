export function isElementEditable(el: Element | null): boolean {
    if (!el || !(el instanceof HTMLElement)) return false;

    const tag = el.tagName.toLowerCase();
    const editableTags = ['input', 'textarea'];

    if (editableTags.includes(tag)) {
        const input = el as HTMLInputElement | HTMLTextAreaElement;
        return !input.disabled && !input.readOnly;
    }

    return el.isContentEditable;
}
