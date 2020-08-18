export const humanize = (value) => {
  const result = value.replace(/([A-Z])/g, " $1").trim()
  return result.charAt(0).toUpperCase() + result.slice(1)
}
