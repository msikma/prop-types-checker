// © 2019, MIT license

const PropTypes = require('prop-types')

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
  age: 'asdf',
  gender: 5,
  inventory: {
    hat: false,
    shoes: 2
  }
}

describe('PropTypes Checker', () => {
  describe('checkPropTypes()', () => {
    describe('object of validation errors is returned when', () => {
      it('is passed an invalid props object', () => {
        expect(checkPropTypes(testPropTypes, testProps)).toBe({
          success: true,
          props: testProps,
          propTypes: testPropTypes,
          errors: {}
        })
      })
    })
  })
})
