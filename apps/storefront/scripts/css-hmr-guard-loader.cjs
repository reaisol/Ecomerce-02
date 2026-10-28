/**
 * Next 15.5.24's bundled mini-css-extract-plugin removes the old stylesheet
 * from a load/error callback, although another refresh may have detached it.
 * Preserve the helper and only make those removals safe to repeat.
 */
module.exports = function cssHmrGuard(source) {
  return source.replaceAll(
    "e.parentNode.removeChild(e)",
    "e.parentNode&&e.parentNode.removeChild(e)",
  )
}
