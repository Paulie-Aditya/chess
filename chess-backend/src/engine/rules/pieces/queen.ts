import { Position } from "chess-shared/types";
import { isValidBishopMove } from "./bishop";
import { isValidRookMove } from "./rook";
import { Board } from "../../Board";

export function isValidQueenMove(from: Position, to: Position, board: Board): boolean {
    return isValidBishopMove(from, to, board) || isValidRookMove(from, to, board);
}
