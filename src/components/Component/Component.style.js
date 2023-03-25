import { css } from '@emotion/css';
import { allProps, allStates, handleProps } from '../../props';
import { acceptableGroupStates } from '../../props/_group';

export const ComponentStyle = ({ addToCache, cache, context, darkMode, depth, props, theme }) => {
    const { __self, __source, ...componentProps } = props

    const allProps = handleProps({
        addToCache,
        cache,
        context,
        darkMode,
        depth,
        props: {
            ...componentProps,
            boxSizing: 'border-box'
        },
        theme
    });

    let allCSS = ''

    for (const propName in allProps) {
        const alias = allProps[propName]?.aliasFor;
        const prop = allProps[alias || propName] || {};
        const { breakpoint, breakpointSelector, cssProps, group, initialValue, parent, selector, state } = prop;

        if (!Array.isArray(selector) && !cssProps && !group && !parent && !state) { continue; }

        if (breakpointSelector) {
            allCSS += `${breakpointSelector} {`;
        }

        if (parent) {
            const { parent, selector, ...parentProps } = prop;
            const cssPropsAsObj = {};

            if (selector) {
                allCSS += `&${selector} {`;
            } 

            for (const childPropName in parentProps) {
                const childProp = parentProps[childPropName];

                for (const { key, value } of childProp.cssProps) {
                    if (!cssPropsAsObj[key]) {
                        cssPropsAsObj[key] = [];
                    }

                    cssPropsAsObj[key].push(value);
                }

                for (const cssPropName in cssPropsAsObj) {
                    const cssProp = cssPropsAsObj[cssPropName];

                    allCSS += `${cssPropName}: ${cssProp.join(' ')};`;
                }
            }

            if (selector) {
                allCSS += '}';
            }
        } else if (group) {
            const { group, ...childrenProps } = prop;
            const childId = propName;

            for (const childPropName in childrenProps) {
                const childProp = childrenProps[childPropName];
                const groupState = acceptableGroupStates[childPropName];

                if (groupState) {
                    allCSS += `${groupState} {`;
                    allCSS += `[data-group-child-id="${childId}"] {`;

                    for (const propName in childProp) {
                        const prop = childProp[propName];

                        if (prop.state) {
                            allCSS += getState({
                                stateProp: prop
                            })
                        } else {
                            allCSS += getStyle({
                                breakpoint,
                                breakpointSelector,
                                cssProps: prop.cssProps,
                                initialValue: prop.initialValue,
                                propName: prop.prop,
                            })
                        }
                    }

                    allCSS += '}';
                    allCSS += '}';
                }

                // const childProp = childrenProps[childPropName];

                // console.log('childProp', propName, childPropName, childProp);
            }
            // const groupState = acceptableGroupStates[propName];



        } else if (state) {
            allCSS += getState({
                stateProp: prop
            })
        } else if (Array.isArray(selector)) {
            for (let s of selector) {
                allCSS += `&${s.selector} {`;

                allCSS += getStyle({
                    breakpoint,
                    breakpointSelector,
                    cssProps: s.cssProps,
                    initialValue,
                    propName,
                })

                allCSS += '}';
            }
        } else {
            if (selector) {
                allCSS += `&${selector} {`;
            } else {
                allCSS += `& {`;
            }

            allCSS += getStyle({
                cssProps,
            })

            allCSS += '}';

            if (breakpointSelector) {
                allCSS += '}';
            }
        }
    }

    return css(allCSS)
    // return css(asString);
}

const getParentStyle = ({ parentProp }) => {
    const { parent, selector, ...parentProps } = parentProp;
    const cssPropsAsObj = {};
    let allCSS = '';

    if (selector) {
        allCSS += `${selector} {`;
    } 

    for (const childPropName in parentProps) {
        const childProp = parentProps[childPropName];

        for (const { key, value } of childProp.cssProps) {
            if (!cssPropsAsObj[key]) {
                cssPropsAsObj[key] = [];
            }

            cssPropsAsObj[key].push(value);
        }

        for (const cssPropName in cssPropsAsObj) {
            const cssProp = cssPropsAsObj[cssPropName];

            allCSS += `${cssPropName}: ${cssProp.join(' ')};`;
        }
    }

    if (selector) {
        allCSS += '}';
    }

    return allCSS;
}

const getState = ({
    stateProp
}) => {
    const { state, ...stateProps } = stateProp;
    let allCSS = '';

    for (const prop in stateProps) {
        const stateProp = stateProps[prop];

        if (stateProp?.parent) {
            allCSS += getParentStyle({
                parentProp: stateProp
            })
        } else if (stateProp?.state) {
            allCSS += getState({
                stateProp
            })
        } else {
            if (stateProp.selector) {
                allCSS += `${stateProp.selector} {`;
            }

            if (Array.isArray(stateProps[prop])) {
                for (let s of stateProps[prop]) {
                    allCSS += `${s.key}: ${s.value};`
                }
            } else if (typeof stateProps[prop] === 'object' && stateProps[prop].cssProps) {
                allCSS += getStyle({
                    cssProps: stateProps[prop].cssProps
                })
            }

            if (stateProp.selector) {
                allCSS += '}';
            }
        }
    }

    return allCSS;
}

const getStyle = ({
    cssProps
}) => {
    let allCSS = '';

    if (!cssProps) { return allCSS; }

    for (let { key, value } of cssProps) {
        let cssLine = '';

        if (!key || value == null || value === false) { continue; }

        if (Array.isArray(key)) {
            for (let k of key) {
                cssLine += `${k}: ${value};`;
            }
        } else {
            cssLine = `${key}: ${value};`;
        }

        allCSS += cssLine;
    }

    return allCSS;
}