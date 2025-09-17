export function formatDate(dateString: Date | string) {
  const date = new Date(dateString)

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })
}