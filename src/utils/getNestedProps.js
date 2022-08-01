import { handleProps } from '#props/index';

export const getNestedProps = ({
    childProps,
    propName,
    theme
}) => {
    const handled = {};
    let handledProps;

    for (let prop in childProps) {
        handled[`${propName}.${prop}`] = childProps[prop];
    }

    handledProps = handleProps({ props: handled, theme });

    return Object.keys(handledProps.elementProps).map(propName => ({
        key: propName,
        value: handledProps.elementProps[propName]
    }));
}