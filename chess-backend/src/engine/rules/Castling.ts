import { Board } from "../Board";
import { Position, Color } from "chess-shared/types";
import { isSquareAttacked } from "./CheckDetection";

export function canCastle(
    board: Board,
    color: Color,
    side: 'kingside' | 'queenside',
    castlingRights: { [key: string]: boolean }
): boolean {
    const row = color === 'white' ? 7 : 0;
    const kingCol = 4;
    const rookCol = side === 'kingside' ? 7 : 0;
    const kingPos = { row, col: kingCol };
    const rookPos = { row, col: rookCol };

    // Check if castling rights exist
    const rightKey = `${color}${side === 'kingside' ? 'Kingside' : 'Queenside'}`;
    if (!castlingRights[rightKey]) return false;

    // Check if king and rook are in their original positions
    const king = board.getPiece(kingPos);
    const rook = board.getPiece(rookPos);
    if (!king || !rook || king.type !== 'king' || rook.type !== 'rook' || 
        king.color !== color || rook.color !== color || 
        king.hasMoved || rook.hasMoved) {
        return false;
    }

    // Check if squares between king and rook are empty
    const startCol = Math.min(kingCol, rookCol) + 1;
    const endCol = Math.max(kingCol, rookCol);
    for (let col = startCol; col < endCol; col++) {
        if (board.getPiece({ row, col })) {
            return false;
        }
    }

    // Check if king is in check
    if (isSquareAttacked(board, kingPos, color === 'white' ? 'black' : 'white')) {
        return false;
    }

    // Check if squares king moves through are under attack
    const direction = side === 'kingside' ? 1 : -1;
    for (let col = kingCol + direction; col !== kingCol + 2 * direction; col += direction) {
        if (isSquareAttacked(board, { row, col }, color === 'white' ? 'black' : 'white')) {
            return false;
        }
    }

    return true;
}

export function getCastlingMove(color: Color, side: 'kingside' | 'queenside'): {
    kingFrom: Position;
    kingTo: Position;
    rookFrom: Position;
    rookTo: Position;
} {
    const row = color === 'white' ? 7 : 0;
    const kingCol = 4;
    const rookCol = side === 'kingside' ? 7 : 0;
    const newKingCol = side === 'kingside' ? 6 : 2;
    const newRookCol = side === 'kingside' ? 5 : 3;

    return {
        kingFrom: { row, col: kingCol },
        kingTo: { row, col: newKingCol },
        rookFrom: { row, col: rookCol },
        rookTo: { row, col: newRookCol }
    };
}
