/**
 * Maps an array of values to an array containing objects with a "value" and "label" key.
 * Useful for mapping enums to a set of human-readable options for comboboxes and pickers.
 *
 * @param values The values to be mapped
 * @param labels A Record containing a label for each value
 * @returns Array of objects containing the value and its corresponding label
 */
export function mapToOptions<T extends string | number | symbol>(
  values: T[],
  labels: Record<T, string>,
) {
  return values.map((value) => ({
    value,
    label: labels[value],
  }));
}
