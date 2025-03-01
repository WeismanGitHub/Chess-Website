import { Square, Board } from './'

abstract class PathUtils {
    static isDiagonal(start: Square, end: Square): boolean {
        return Math.abs(start.col - end.col) === Math.abs(start.row - end.row)
    }

    static isVertical(start: Square, end: Square): boolean {
        return start.col === end.col
    }

    static isHorizontal(start: Square, end: Square): boolean {
        return start.row === end.row
    }

    static isClear(board: Board, start: Square, end: Square): boolean {
        const helper = (distance: number, coordCalculator: (i: number) => [number, number]): boolean => {
            for (let i = 0; i < distance; i++) {
                const [row, col] = coordCalculator(i)

                const square = board.getSquare(row, col)

                if (!square) {
                    throw new Error(`No square at row ${row}, col ${col}`)
                }

                if (square.piece) {
                    return false
                }
            }

            return true
        }

        if (PathUtils.isVertical(start, end)) {
            return helper(Math.abs(start.row - end.row) - 1, (i) => {
                const row = start.row < end.row ? start.row + i + 1 : start.row - i - 1

                return [row, start.col]
            })
        } else if (PathUtils.isHorizontal(start, end)) {
            return helper(Math.abs(start.col - end.col) - 1, (i) => {
                const col = start.col < end.col ? start.col + i + 1 : end.col - i + 1

                return [start.row, col]
            })
        } else if (PathUtils.isDiagonal(start, end)) {
            return helper(Math.abs(start.col - end.col) - 1, (i) => {
                const col = start.col < end.col ? start.col + i + 1 : start.col - i - 1
                const row = start.row < end.row ? start.row + i + 1 : start.row - i - 1

                return [row, col]
            })
        } else {
            throw new Error("Method cannot process paths that aren't diagonal, horizontal, or vertical.")
        }
    }
}

export default PathUtils
