import React from 'react';
import _ from 'lodash';

const mkFirstFunc = method => str => str.slice(0, 1)[method]() + str.slice(1);
const lowerFirst = mkFirstFunc('toLowerCase');
const capFirst = mkFirstFunc('toUpperCase');
const toCallbackName = prop => `on${prop === 'value' ? '' : capFirst(prop)}Change`;
const fromDefaultName = prop => lowerFirst(prop.slice(7));
const mapKeys = (obj, mapper) => {
    const newObj = {};
    for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            newObj[mapper(k)] = obj[k];
        }
    }
    return newObj;
};
const merge = (...sources) => {
    const target = {};
    sources.forEach(source => {
        for (const k in source) {
            if (!Object.prototype.hasOwnProperty.call(source, k)) continue;
            const val = source[k];

            // Treat `undefined` the same as a missing key. React also does this for
            // `null`, but that only works because their controlled components can use
            // an empty string to represent "no value." In the general case, we need
            // some way to control a component but give it "no value." We use `null`
            // for that. See GH-1
            // if (val === undefined) continue;

            target[k] = val;
        }
    });
    return target;
};

const isDefault = (value, key) => /^default/.test(key);
const omitDefaults = props => _.omit(props, isDefault);
const pickDefaults = props => _.pick(props, isDefault);
const noOpInitialize = () => {
};

function createStateManager(propsOrStateManager) {
    // We've already got them!
    if (!Array.isArray(propsOrStateManager)) return propsOrStateManager;

    // Build them from an array of controllable props.
    return {
        reducers: propsOrStateManager.reduce((reducers, prop) => {
            const callbackName = toCallbackName(prop);
            reducers[callbackName] = (currentState, value) => ({ [prop]: value });
            return reducers;
        }, {}),
    };
}

export default function controllable(...args) {
    // Support [Python-style decorators](https://github.com/wycats/javascript-decorators)
    if (args.length === 1) return Component => controllable(Component, ...args);

    const [Component, propsOrStateManager] = args;
    const { reducers, initialize = noOpInitialize } = createStateManager(propsOrStateManager);

    // Create action creators from the reducers.
    const actionCreators = _.mapValues(reducers, reducer => (...args1) => {
        // Calculate the new state.
        const currentProps = merge(this.state, omitDefaults(this.props), this.boundActionCreators);
        const newState = reducer(currentProps, ...args1);

        // Update the state.
        this.setState(newState);

        // If there are callbacks for the changed values, invoke them.
        Object.keys(newState).forEach(prop => {
            const newValue = newState[prop];
            const callbackName = toCallbackName(prop);
            const cb = this.props[callbackName];
            const _args = [...args1];
            _args.shift();
            if (cb) cb(newValue, ..._args);
        });
    });

    return class ControllableWrapper extends React.Component {
        constructor(...args1) {
            super(...args1);

            // Get the initial state from the `default*` props.
            const instanceInitialState = mapKeys(pickDefaults(this.props), fromDefaultName);
            const childProps = merge(instanceInitialState, omitDefaults(this.props));
            this.state = merge(instanceInitialState, initialize(childProps));

            // Create bound versions of the action creators.
            this.boundActionCreators = _.mapValues(actionCreators, fn => fn.bind(this));
        }

        render() {
            const props = merge(this.state, omitDefaults(this.props), this.boundActionCreators);
            return <Component {...props} />;
        }
    };
}
