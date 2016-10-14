'use strict'

class AuthController {

  * index(request, response) {
      yield response.sendView('auth.login')
  }

  * login(request, response) {

      const email = request.input('email')
      const password = request.input('password')

      const loginMessage = {
          success: 'Logged-in Successfully!',
          error: 'Invalid Credentials'
      }

      const authCheck = yield request.auth.attempt(email, password)

      if (authCheck) {
          return response.redirect('/')
      }

      yield response.sendView('auth.login', { error: loginMessage.error })
  }

  * logout(request, response) {
    yield request.auth.logout()

    return response.redirect('/login')
  }


}

module.exports = AuthController
