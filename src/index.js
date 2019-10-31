// © 2019, MIT license

const { isFunction } = require('./util')

// Secret string; normally you cannot call validators manually, so the React team built in
// a password that you must pass to every validator call, or else it fails to work.
const ReactPropTypesSecret = require('prop-types/lib/ReactPropTypesSecret')
/**
 * Runs the PropTypes checker for a given spec and value object and returns errors.
 * 
 * Unlike React's props check, this function is designed to be used on arbitrary objects.
 * Any errors that are found are returned in an array; if none are found, the result
 * is an empty array.
 * 
 * Only the spec object and values object are needed - other metadata such as the
 * component name is not included in the output, as this check is not specifically
 * designed for component props or any other particular use case.
 * 
 * NOTE: prop types checking is normally disabled in production. However, since this
 * is designed to be used for manually validating things, and then performing some action
 * based on whether or not the values are valid, the checks are always performed
 * regardless of environment.
 */
const checkPropTypes = (propTypes, props, location = 'prop', componentName = 'Object') => {
  const errors = _runTypeSpec(propTypes, props, location, componentName)
  return {
    success: Object.keys(errors).length === 0,
    props,
    propTypes,
    errors
  }
}

/**
 * Runs a PropTypes spec with a value object and returns any errors it finds.
 * 
 * Each error value is an object containing the following:
 * 
 *   - error               string containing an explanation of the validation error
 *   - isValidValidator    whether the validator was a function or not (as is required)
 *   - isException         whether an exception was thrown during validation
 * 
 * If no errors are found, an empty object is returned.
 */
const _runTypeSpec = (typeSpec, values, location = 'prop', componentName = 'Object') => (
  Object.entries(typeSpec).reduce((propTypeErrors, [propName, propValidator]) => {
    let result
    let message
    let isInvalidValidator = false
    let isException = false

    if (!isFunction(propValidator)) {
      // If the validator is not a function, return a report with type indicator.
      result = true
      message = `Prop \`${propName}\` is invalid; it must be a function, usually from the \`prop-types\` package, but received \`${typeof propValidator}\`.`
      isInvalidValidator = true
    }
    else {
      // Run the validator.
      try {
        result = propValidator(values, propName, componentName, location, null, ReactPropTypesSecret)
        message = result && result.message
        if (!(result instanceof Error)) {
          message = `Type specification of prop \`${propName}\` is invalid; the type checker function must return \`null\` or an \`Error\` but returned a ${typeof result}. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).`
        }
      }
      // It's possible for the validator to throw - in that case we save the exception.
      catch (exception) {
        result = exception
        message = exception.message
        isException = true
      }
    }

    // If an error was detected:
    if (result) {
      return {
        ...propTypeErrors,
        [propName]: {
          error: message,
          isInvalidValidator,
          isException
        }
      }
    }

    // Else, this prop is valid.
    return propTypeErrors
  }, {})
)

module.exports = checkPropTypes
