/*
 * Some types are replaced with specific types from this file. This is
 * to increase verbosity and to prevent mistaking variables for each
 * other.
 */

/**
 * A Color is a RGB color represented by a number. This number,
 * when converted to hexadecimal, is known as the "hex" of a color.
 *
 * To create a color using hexadecimal, type it as `0xRRGGBB` (e.g.
 * `0xFFFF00` will create a yellow color). In turn, this color value
 * is stored as a number: 16776960
 *
 * 16776960 represents #FF0000 since they are composed of the same bits:
 * ```
 * 1111 1111 1111 1111 0000 0000
 *  F    F    F    F    0    0
 *  R    R    G    G    B    B
 * ```
 */
export type Color = number;