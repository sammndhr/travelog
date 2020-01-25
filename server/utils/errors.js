const ErrorHelper = {
	createError(code, { email }) {
		switch (code) {
			case '23505':
				return { message: `Email ${email} already exits!`, code: 400 }
			default:
				return { message: `Something went wrong.`, code: 500 }
		}
	},
	//To catch errors 'UnhandledPromiseRejectionWarning'. https://thecodebarbarian.com/80-20-guide-to-express-error-handling
	wrapAsync(fn) {
		return function(req, res, next) {
			// Make sure to `.catch()` any errors and pass them along to the `next()`
			// middleware in the chain, in this case the error handler.
			fn(req, res, next).catch(next)
		}
	}
}
module.exports = ErrorHelper
