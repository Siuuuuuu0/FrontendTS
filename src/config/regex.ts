const USER_REGEX = /^[A-Za-z0-9!#$%^&*_\-.]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const FIRSTNAME_REGEX =/^[A-z]{3,40}$/
const LASTNAME_REGEX =/^[A-z]{3,40}$/
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export {USER_REGEX, PWD_REGEX, FIRSTNAME_REGEX, LASTNAME_REGEX, EMAIL_REGEX}