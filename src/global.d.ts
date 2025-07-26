declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}
declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

type ValueOf<T> = T[keyof T];

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}
