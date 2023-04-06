import { bgProps } from './bg.js';

// Props
import { borderProps } from './border.js';
import { colorProps } from './color.js';
import { dimensionProps } from './dimension.js';
import { filterProps } from './filter.js';
import { flexProps } from './flex.js';
import { fontProps } from './font.js';
import { gridProps } from './grid.js';
import { marginProps } from './margin.js';
import { otherProps } from './other.js';
import { outlineProps } from './outline.js';
import { overflowProps } from './overflow.js';
import { paddingProps } from './padding.js';
import { positionProps } from './position.js';
import { pseudoClasses } from './pseudoClasses.js';
import { pseudoElements } from './pseudoElements.js';
import { ringProps } from './ring.js';
import { shadowProps } from './shadow.js';
import { spacingProps } from './spacing.js';
import { textProps } from './text.js';
import { transformProps } from './transform.js';
import { transition, transitionDelay, transitionDuration, transitionProperty, transitionTimingFunction } from './transition.js';
import { visibilityProps } from './visibility.js';
import { groupProps } from './_group.js';
import { responsiveness } from './_responsiveness.js';

// All props
export const allProps = {
    'all': {
        key: 'all'
    },
    'appearance': {
        key: 'appearance'
    },
    ...bgProps,
    'block': {
        fn: () => ({
            key: 'display',
            value: 'block'
        })
    },
    ...borderProps,
    'boxSizing': {
        key: 'box-sizing'
    },
    ...colorProps,
    'content': {
        key: 'content'
    },
    'cursor': {
        key: 'cursor'
    },
    ...dimensionProps,
    'display': {
        key: 'display'
    },
    'd': { aliasFor: 'display' },

    ...filterProps,
    ...flexProps,
    ...fontProps,
    ...gridProps,
    ...groupProps,
    ...marginProps,
    'opacity': {
        key: 'opacity'
    },
    'op': { aliasFor: 'opacity' },
    ...otherProps,
    ...outlineProps,
    ...overflowProps,
    ...paddingProps,
    ...positionProps,
    'reset': {
        fn: () => ([
            {
                key: 'appearance',
                value: 'none'
            },
            {
                key: 'background',
                value: 'none'
            },
            {
                key: 'border',
                value: 'none'
            }])
    },
    'resize': {
        key: 'resize'
    },
    ...ringProps,
    ...shadowProps,
    // // ...sizeProps,
    ...spacingProps,
    ...textProps,
    ...transformProps,
    'transition': {
        fn: transition
    },
    'transition.delay': {
        fn: transitionDelay
    },
    'transition.duration': {
        fn: transitionDuration
    },
    'transition.property': {
        fn: transitionProperty
    },
    'transition.timingFunciton': {
        fn: transitionTimingFunction
    },
    ...visibilityProps
}

export const allStates = {
    '_checked': {
        key: ':checked'
    },
    '_disabled': {
        key: '[disabled]'
    },
    '_empty': {
        key: ':empty'
    },
    '_focus': {
        key: ':focus'
    },
    '_hover': {
        // props: , 
        key: ':hover',
    },
    '_link': {
        key: ':link'
    },
    '_optional': {
        key: ':optional'
    },
    '_readOnly': {
        key: ':read-only'
    },
    '_visited': {
        key: ':visited'
    },
    '_active': {
        key: ':active'
    },

    // Pseudo classes
    // Move this somewhere else later
    ...pseudoClasses,

    // Pseudo elements
    // Move this somewhere else later
    ...pseudoElements,
    ...responsiveness
}

let cachedProps;

// Methods
export const getCustomProps = ({
    props,
    theme
}) => {
    let allProps = [];
    let customProps = {};

    if (theme?.customProps) {
        allProps.push(...theme?.customProps)
    }

    if (props?.customProps) {
        if (typeof props.customProps === 'function') {
            allProps.push(...props?.customProps({ props }))
        } else {
            allProps.push(...props?.customProps)
        }
    }

    if (!allProps.length) { return {}; }

    for (let customProp of allProps) {
        const componentProp = props[customProp.name];

        if (componentProp != null && componentProp !== false) {
            if (customProp.values && Array.isArray(customProp.values)) {
                const index = customProp.values.map(value => value.name).indexOf(componentProp);

                if (index > -1) {
                    customProps = {
                        ...customProps,
                        ...customProp.values[index].props
                    }
                }
            } else {
                customProps = {
                    ...customProps,
                    ...customProp.props
                }
            }
        }
    }

    return customProps;
}

export const handleProp = ({
    addToCache,
    bypass,
    cache,
    context,
    depth,
    prop,
    props,
    theme
}) => {
    if (!allProps[prop] || props[prop] == null || props[prop] === false) {
        const handledProps = {};

        handledProps[prop] = {
            cssProps: [],
            initialValue: props[prop],
            prop
        }

        return handledProps;
    }

    const alias = allProps[prop]?.aliasFor;
    const initialValue = typeof props[prop] === 'function' ? props[prop]({
        props,
        theme
    }) : props[prop];
    const {
        deps,
        fn,
        key,
        transform,
        value: unhandledValue
    } = allProps[alias || prop]
    const propName = alias || prop;
    let cachePropName = propName;
    let cssProps = [];
    let handledProps = {};

    if (deps) {
        cachePropName = `${propName}:${deps({ props }).join(':')}`;
    }

    if (cache?.[propName]?.[initialValue]) {
        const { cssProps, prop } = cache[propName][initialValue];

        handledProps[propName] = {
            cssProps,
            initialValue,
            prop
        };

        return handledProps;
    }

    if (transform) {
        const { props: transformProps, value: transformValue } = typeof transform === 'function' ? transform({
            cache,
            context,
            depth,
            props,
            theme,
            value: props[propName]
        }) : transform;
        const stringifiedProps = transformValue ? JSON.stringify(transformProps).replace(/value/g, transformValue({
            cache,
            context,
            depth,
            props,
            theme,
            value: props[propName]
        })) : '';
        const parsedProps = transformValue ? JSON.parse(stringifiedProps) : transformProps;

        if (typeof parsedProps === 'object') {
            for (let parsedProp of Object.keys(parsedProps)) {
                const parsedPropName = allProps[parsedProp]?.aliasFor || parsedProp;

                if (allProps[parsedProp]) {
                    const {
                        cssProps: childCSSProps,
                        initialValue: childInitialValue,
                    } = handleProp({
                        addToCache,
                        bypass,
                        cache,
                        context,
                        depth,
                        prop: parsedPropName,
                        props: parsedProps,
                        theme
                    });

                    handledProps[parsedPropName] = {
                        cssProps: childCSSProps,
                        initialValue: childInitialValue,
                        prop: parsedPropName
                    }
                }

                if (allStates[parsedPropName]) {
                    const handledState = handleState({
                        addToCache,
                        cache,
                        context,
                        depth,
                        prop: parsedPropName,
                        props: parsedProps,
                        theme
                    })

                    handledProps[parsedProp] = handledState;
                }
            }
        }
    } else if (fn && typeof fn === 'function') {
        const fnOutput = fn({
            addToCache,
            cache,
            context,
            depth,
            key,
            props,
            theme,
            value: initialValue
        });

        if (Array.isArray(fnOutput)) {
            handledProps[propName] = {
                cssProps: fnOutput,
                initialValue,
                prop: propName
            }
        } else if (typeof fnOutput === 'object') {
            if (fnOutput.key != null && fnOutput.value != null && fnOutput.value !== false) {
                if (Array.isArray(fnOutput.key)) {
                    cssProps = fnOutput.key.map((key, i) => ({
                        key,
                        parent: Array.isArray(fnOutput.parent) ? fnOutput.parent[i] : fnOutput.parent,
                        value: Array.isArray(fnOutput.value) ? fnOutput.value[i] : fnOutput.value
                    }));

                    handledProps[propName] = {
                        cssProps,
                        initialValue,
                        prop: propName
                    }
                } else {
                    cssProps = [{
                        key: fnOutput.key,
                        parent: fnOutput.parent,
                        value: fnOutput.value
                    }];

                    handledProps[propName] = {
                        cssProps,
                        initialValue,
                        prop: propName
                    }
                }
            } else {
                handledProps = {
                    ...handledProps,
                    ...fnOutput
                }
            }
        }
    } else if (unhandledValue != null && unhandledValue !== false) {
        const unhandledOutput = typeof unhandledValue === 'function' ? unhandledValue({ context, props, theme }) : unhandledValue;

        if (typeof unhandledOutput === 'object' && unhandledOutput.key != null && unhandledOutput.value != null) {
            if (Array.isArray(unhandledOutput.key)) {
                cssProps = unhandledOutput.key.map((key, i) => ({
                    key,
                    parent: Array.isArray(unhandledOutput.parent) ? unhandledOutput.parent[i] : unhandledOutput.parent,
                    value: Array.isArray(unhandledOutput.value) ? unhandledOutput.value[i] : unhandledOutput.value
                }));
            } else {
                cssProps = [{
                    key: unhandledOutput.key,
                    parent: unhandledOutput.parent,
                    value: unhandledOutput.value
                }];
            }
        }

        handledProps[propName] = {
            cssProps,
            initialValue,
            prop: propName
        }
    } else {
        cssProps = [{
            key,
            value: props[prop]
        }];

        handledProps[propName] = {
            cssProps,
            initialValue,
            prop: propName
        }
    }

    if (!cache?.[propName]?.[initialValue] && typeof initialValue !== 'function') {
        let cacheDeps;
        let handledInitialValue = initialValue;

        if (!Array.isArray(initialValue) && typeof initialValue === 'object' && allProps[propName]?.chainable) {
            handledInitialValue = null;
        }

        if (Array.isArray(initialValue) || (typeof initialValue === 'object' && !allProps[propName]?.chainable)) {
            handledInitialValue = JSON.stringify(initialValue);
        }

        if (deps) {
            cacheDeps = typeof deps === 'function' ? deps({ props }) : deps;
        }

        if (handledInitialValue) {
            addToCache?.({
                cacheDeps,
                cachedProps: handledProps[propName],
                initialValue: handledInitialValue,
                propName,
            })
        }
    }

    return {
        ...handledProps
    }
}

export const handleState = ({
    addToCache,
    cache,
    context,
    customSelector,
    depth,
    parentSelector,
    prop,
    props,
    selectorFn,
    theme
}) => {
    const {
        fn,
        key,
    } = allStates[prop];
    const customSelectorFn = selectorFn || allStates[prop].selectorFn;

    let stateProps = typeof props[prop] === 'function' ? props[prop]({ props }) : props[prop];
    let handledState = {};
    let totalProps = 0;
    let selector = customSelector || key;

    if (fn) {
        const stateFnOutput = fn({
            addToCache,
            cache,
            context,
            depth,
            parentSelector,
            prop,
            props,
            theme
        });

        handledState = {
            ...handledState,
            ...stateFnOutput
        }
    }

    for (let stateProp in stateProps) {
        let propType = 'unknown'

        if (allProps[stateProp]) {
            propType = 'prop';
            totalProps++;
        } else if (allStates[stateProp]) {
            propType = 'state';
        }

        if (propType === 'prop') {
            const handledProp = handleProp({
                addToCache,
                cache,
                context,
                depth,
                prop: stateProp,
                props: stateProps,
                theme,
            })

            if (Object.keys(handledProp)[0] === stateProp) {
                handledState = { ...handledState };
                handledState[stateProp] = { 
                    ...handledProp[stateProp],
                    selector
                }
            } else {
                for (const propName in handledProp) {
                    const prop = handledProp[propName];

                    if (prop.cssProps) {
                        prop.selector = selector;
                    }
                }

                handledState[stateProp] = {
                    ...handledProp,
                    state: true
                }
            }
        }

        if (propType === 'state') {
            const {
                fn: childFn,
                key: childSelector
            } = allStates[stateProp];
            let parentSelector = null;

            if (childSelector && typeof customSelectorFn === 'function') {
                parentSelector = selector ? `${selector}${customSelectorFn(childSelector)}` : customSelectorFn(childSelector)
            }

            if (childFn) {
                const fnOutput = childFn({
                    addToCache,
                    cache,
                    context,
                    depth,
                    props: stateProps,
                    theme
                });

                if (fnOutput) {
                    if (!handledState[stateProp]) {
                        handledState[stateProp] = {}
                    }

                    for (let childPropName in fnOutput) {
                        const childProp = fnOutput[childPropName];
                        const childSelector = childProp.selector;
                        let parentSelector;

                        if (childSelector && typeof customSelectorFn === 'function') {
                            parentSelector = selector ? `${selector}${customSelectorFn(childSelector)}` : customSelectorFn(childSelector)
                        }

                        childProp.selector = parentSelector || (childSelector ? `${selector}${childSelector}` : selector)
                    }

                    handledState[stateProp] = {
                        ...fnOutput,
                        state: true
                    }
                }
            } else {
                const childState = handleState({
                    addToCache,
                    cache,
                    context,
                    customSelector: parentSelector || (childSelector ? `${selector}${childSelector}` : selector),
                    depth,
                    prop: stateProp,
                    props: stateProps,
                    theme,
                });

                handledState[stateProp] = {
                    ...childState,
                    state: true
                }
            }
        }
    }

    return {
        ...handledState,
        state: true
    }
}

export const handleProps = ({
    addToCache,
    bypass,
    cache,
    context,
    depth,
    props,
    theme
}) => {
    const customProps = cachedProps || getCustomProps({ props, theme });
    const propsWithCustomProps = {
        depth,
        ...props,
        ...customProps
    }
    let handledProps = {};

    for (let propName of Object.keys(propsWithCustomProps)) {
        const prop = allProps[propName];
        const parentProp = prop?.parent;
        let propType = 'unknown'

        if (allProps[propName]) {
            propType = 'prop'

        } else if (allStates[propName]) {
            propType = 'state'
        }

        if (propType === 'prop') {
            const handledProp = handleProp({
                addToCache,
                bypass,
                cache,
                context,
                depth,
                prop: propName,
                props: propsWithCustomProps,
                theme
            })

            if (parentProp) {
                if (!handledProps[parentProp]) {
                    handledProps[parentProp] = { parent: true }
                }

                handledProps[parentProp] = {
                    ...handledProps[parentProp],
                    ...handledProp
                }
            } else {
                handledProps = {
                    ...handledProps,
                    ...handledProp
                }
            }
        } else if (propType === 'state') {
            const handledState = handleState({
                addToCache,
                cache,
                context,
                depth,
                prop: propName,
                props: propsWithCustomProps,
                theme
            })

            handledProps[propName] = { ...handledState };
        }
    }

    return handledProps
}