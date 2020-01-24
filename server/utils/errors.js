const ErrorHelper = {
	createError(code, { email }) {
		switch (code) {
			case '23505':
				return { message: `Email ${email} already exits!`, code: 400 }
			default:
				return { message: `Something went wrong.`, code: 500 }
		}
	}
}
module.exports = ErrorHelper
