import { Position} from "chess-shared/types";
import { Board } from "../../Board";

export function isValidBishopMove(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    if (rowDiff !== colDiff) return false;

    const rowStep = to.row > from.row ? 1 : -1;
    const colStep = to.col > from.col ? 1 : -1;

    let r = from.row + rowStep;
    let c = from.col + colStep;
    while (r !== to.row && c !== to.col) {
        if (board.getPiece({row: r, col: c})) return false;
        r += rowStep;
        c += colStep;
    }

    return true;
}
