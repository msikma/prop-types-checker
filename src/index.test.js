// © 2019, MIT license

const PropTypes = require('prop-types')
const checkPropTypes = require('./index')

const testPropTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
  gender: PropTypes.any,
  inventory: PropTypes.shape({
    hat: PropTypes.bool,
    shoes: PropTypes.number
  }).isRequired
}

const testPropsValid = {
  name: 'hello',
  age: 25,
  gender: 5,
  inventory: {
    hat: false,
    shoes: 2
  }
}

const testPropsInvalid = {
  name: 'hello',
  age: 'asdf',
  gender: 5,
  inventory: {
    hat: false,
    shoes: 2
  }
}

describe('PropTypes Checker', () => {
  describe('checkPropTypes()', () => {
    describe('success status and an empty errors object is returned when', () => {
      it('is passed a valid props object', () => {
        expect(checkPropTypes(testPropTypes, testPropsValid)).toStrictEqual({
          success: true,
          props: testPropsValid,
          propTypes: testPropTypes,
          errors: {}
        })
      })
    })

    describe('object of validation errors is returned when', () => {
      it('is passed an invalid props object', () => {
        expect(checkPropTypes(testPropTypes, testPropsInvalid)).toStrictEqual({
          success: false,
          props: testPropsInvalid,
          propTypes: testPropTypes,
          errors: {
            age: {
              error: 'Invalid prop `age` of type `string` supplied to `Object`, expected `number`.',
              isException: false,
              isInvalidValidator: false
            }
          }
        })
      })
    })

    describe('the isInvalidValidator bool should be true when', () => {
      it('is passed a type spec with a non-function as validator', () => {
        expect(
          checkPropTypes({
            ...testPropTypes,
            somethingInvalid: 'invalid'
          }, testPropsValid)
        )
        .toStrictEqual({
          success: false,
          props: testPropsValid,
          propTypes: {
            ...testPropTypes,
            somethingInvalid: 'invalid'
          },
          errors: {
            somethingInvalid: {
              error: 'Prop `somethingInvalid` is invalid; it must be a function, usually from the `prop-types` package, but received `string`.',
              isException: false,
              isInvalidValidator: true
            }
          }
        })
      })
    })

    describe('the isException bool should be true when', () => {
      const validatorThatThrows = () => {
        throw new Error('test error')
      }
      it('is passed a type spec with a function that throws as validator', () => {
        expect(checkPropTypes({ ...testPropTypes, validatorThatThrows }, testPropsValid)).toStrictEqual({
          success: false,
          props: testPropsValid,
          propTypes: { ...testPropTypes, validatorThatThrows },
          errors: {
            validatorThatThrows: {
              error: 'test error',
              isException: true,
              isInvalidValidator: false
            }
          }
        })
      })
    })
  })
})
