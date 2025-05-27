import { Board } from "../Board";
import { Position, Color } from "chess-shared/types";
import { isInCheck } from "./CheckDetection";
import { MoveValidator } from "./MoveValidator";

export function isMoveLegal(from: Position, to: Position, board: Board, currentTurn: Color): boolean {
    const piece = board.getPiece(from);
    if (!piece || piece.color !== currentTurn) return false;
    if (!MoveValidator.isMoveLegal(from, to, board)) return false;

    const boardCopy = board.clone();
    boardCopy.movePiece(from, to);

    return !isInCheck(boardCopy, currentTurn);
}
