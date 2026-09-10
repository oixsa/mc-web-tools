/**
 * Shared voxel and 2D/3D grid rasterization utilities.
 */

/**
 * Converts a 2D boolean grid into an ASCII text block map.
 */
export function gridToAscii(
  grid: boolean[][],
  fillChar: string = '██',
  emptyChar: string = '  '
): string {
  return grid
    .map((row) => row.map((filled) => (filled ? fillChar : emptyChar)).join(''))
    .join('\n');
}
