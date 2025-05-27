import { Position } from "chess-shared/types";
import { Board } from "../../Board";
export function isValidRookMove(from: Position, to: Position, board: Board): boolean {
    const piece = board.getPiece(from);
    if (!piece) return false;

    if (from.row !== to.row && from.col !== to.col) return false;

    const rowStep = from.row === to.row ? 0 : (to.row > from.row ? 1 : -1);
    const colStep = from.col === to.col ? 0 : (to.col > from.col ? 1 : -1);

    let r = from.row + rowStep;
    let c = from.col + colStep;
    while (r !== to.row || c !== to.col) {
        if (board.getPiece({row: r, col: c})) return false;
        r += rowStep;
        c += colStep;
    }

    return true;
}
