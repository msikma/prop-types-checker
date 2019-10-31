# prop-types-checker

**Runs React's PropTypes checks on an arbitrary object and returns validation results**

The React PropTypes library is great for quickly and easily validating that the data passed to a component conforms to a desired structure. This helper library allows you to run those same checks on arbitrary objects—no React or component structure necessary.

For example, this can be used to quickly validate config files, or data fetched from an API endpoint. It only returns rudimentary error information if anything is wrong.

## Example

```js
const PropTypes = require('prop-types')
const checkPropTypes = require('prop-types-checker')

const testPropTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
  gender: PropTypes.any,
  inventory: PropTypes.shape({
    hat: PropTypes.bool,
    shoes: PropTypes.number
  }).isRequired
}

const testProps = {
  name: 'hello',
  age: 'world', // invalid
  gender: 5,
  inventory: {
    hat: false,
    shoes: 2
  }
}

console.log(checkPropTypes(testPropTypes, testProps))
```

This will log the following result (input props and proptypes omitted):

```
{ success: false,
  props: { ... },
  propTypes: { ... },
  errors:
   { age:
      { error:
         'Invalid prop `age` of type `string` supplied to `Object`, expected `number`.',
        isInvalidValidator: false,
        isException: false } } }
```

If `age` is changed into a number as required by the proptypes model, the result will have `success: true` and `errors: {}` instead.

Further, the following information is returned for each error:

* `isInvalidValidator` - *true* if a passed validator is not a function, as required
* `isException` - *true* if an exception was thrown while the validator function ran

## Links

* [React documentation - Typechecking With PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html)
* [Facebook PropTypes library](https://github.com/facebook/prop-types)

## Copyright

© 2019, MIT license.
