export default function flow(hocs, component) {
  return hocs.reduce((prev, current) => current(prev), component);
}
