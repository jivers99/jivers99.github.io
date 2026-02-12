export function getTier(bst) {
  if (bst >= 580) return "S";
  if (bst >= 525) return "A";
  if (bst >= 500) return "B";
  if (bst >= 480) return "C";
  if (bst >= 448) return "D";
  return "F";
}
