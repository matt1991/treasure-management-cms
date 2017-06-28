export function domain(value) {
  // http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
  return /^(http)?s?(:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value)
}
