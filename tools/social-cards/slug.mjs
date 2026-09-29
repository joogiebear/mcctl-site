// The one place that decides a page's card file name, shared by the generator and the site config.
// guide/faq.md -> guide-faq, guide/index.md -> guide, changelog.md -> changelog.
export function cardSlug(relativePath) {
  return relativePath.replace(/\.md$/, '').replace(/(^|\/)index$/, '').replace(/\/+$/, '').replace(/\//g, '-')
}
