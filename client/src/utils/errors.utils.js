const createErrorMessage = error => {
	const errorMessage =
		error.response.data.message === undefined
			? 'Something went wrong.'
			: `${error.response.data.message}`
	return errorMessage
}

export { createErrorMessage }
