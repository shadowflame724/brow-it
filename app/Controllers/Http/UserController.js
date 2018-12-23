'use strict'

const User = use('App/Models/User')
const {validate} = use('Validator')

class UserController {
  async signup({request, response, auth}) {

    // validate form input
    const validation = await validate(request.all(), {
      email: 'required|email:unique:users',
      username: 'required|unique:users',
      password: 'required'
    })

    // show error messages upon validation fail
    if (validation.fails()) {
      return response.send(validation.messages())
    }

    const user = new User()
    user.email = request.input('email')
    user.username = request.input('username')
    user.password = request.input('password')

    //saving the user data
    await user.save()

    // generate JWT token for user
    const token = await auth.generate(user)

    return response.json({
      message: 'Successfully',
      data: token
    })
  }

  async signin({request, response, auth}) {
    try {
      const parameter = request.only(['email', 'password'])

      if (!parameter) {
        return response.status(404).json({data: 'Resource not found'})
      }

      const token = await auth.attempt(parameter.email, parameter.password)
      return response.json({
        token: token
      })
    } catch (err) {
      return response.status(400).json({
        status: 'error',
        message: 'Problem occured while trying to sigin. Please try again.'
      })
    }
  }
}

module.exports = UserController
