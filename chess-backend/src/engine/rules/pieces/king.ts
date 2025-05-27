import { Position} from "chess-shared/types";
import { Board } from "../../Board";

export function isValidKingMove(from: Position, to: Position, board: Board): boolean {
    const piece = board.getPiece(from);
    if (!piece) return false;

    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    // Normal king move
    if (rowDiff <= 1 && colDiff <= 1) return true;

    // Basic castling check (king-side or queen-side)
    if (!piece.hasMoved && rowDiff === 0 && (colDiff === 2)) {
        // Additional castling validation is done elsewhere
        return true; // basic "may be valid", full validation must check rook, blocks, check
    }

    return false;
}
