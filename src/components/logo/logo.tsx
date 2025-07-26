import { memo } from 'react';
import { Logo as WebLogo } from '@ant478/web-components';

if (!customElements.get('ant478-logo')) {
    customElements.define('ant478-logo', WebLogo);
}

export type LogoProps = Record<string, string>;

export const Logo = memo(({ className, ...attributes }: LogoProps) => (
    /* @ts-ignore */
    <ant478-logo class={className} {...attributes}></ant478-logo>
));
