const createErrorMessage = error => {
	const errorMessage =
		error.response && error.response.data && error.response.data.message
			? `${error.response.data.message}`
			: 'Something went wrong.'

	return errorMessage
}

export { createErrorMessage }
