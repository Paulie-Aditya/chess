import { Position, Color } from "chess-shared/types";
import { Board } from "../../Board";
import { canCastle } from "../Castling";

export function isValidKingMove(
    from: Position, 
    to: Position, 
    board: Board,
    castlingRights: { [key: string]: boolean }
): boolean {
    const piece = board.getPiece(from);
    if (!piece) return false;

    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    // Normal king move
    if (rowDiff <= 1 && colDiff <= 1) {
        const target = board.getPiece(to);
        return !target || target.color !== piece.color;
    }

    // Castling
    if (!piece.hasMoved && rowDiff === 0 && colDiff === 2) {
        const side = to.col > from.col ? 'kingside' : 'queenside';
        return canCastle(board, piece.color, side, castlingRights);
    }

    return false;
}
