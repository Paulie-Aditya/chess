import { Board } from "./Board";
import { MoveValidator } from "./rules/MoveValidator";
import { Position, Color, Move, Piece } from "chess-shared/types";
import { isInCheck, isCheckmate, isStalemate } from "./rules/CheckDetection";
import { DrawConditions } from "./rules/DrawConditions";
import { isPromotionMove, getPromotionOptions } from "./rules/pieces/pawn";

export class Game {
    private board: Board;
    private turn: Color;
    private moveHistory: Move[] = [];
    private drawConditions: DrawConditions;
    private enPassantTarget: Position | null = null;
    private gameStatus: 'waiting' | 'active' | 'checkmate' | 'stalemate' | 'draw' | 'resigned' = 'active';

    constructor() {
        this.board = new Board();
        this.turn = "white";
        this.drawConditions = new DrawConditions();
    }

    getBoard() {
        return this.board;
    }

    getTurn(): Color {
        return this.turn;
    }

    getGameStatus() {
        return this.gameStatus;
    }

    getMoveHistory(): Move[] {
        return this.moveHistory;
    }

    getEnPassantTarget(): Position | null {
        return this.enPassantTarget;
    }

    move(from: Position, to: Position, promotionType?: 'queen' | 'rook' | 'bishop' | 'knight'): boolean {
        const piece = this.board.getPiece(from);
        if (!piece || piece.color !== this.turn || this.gameStatus !== 'active') return false;

        // Handle pawn promotion
        if (piece.type === "pawn" && isPromotionMove(to, piece.color)) {
            if (!promotionType || !getPromotionOptions().includes(promotionType)) {
                return false;
            }
        }

        if (MoveValidator.isMoveLegal(from, to, this.board)) {
            // Record the move
            const move: Move = {
                from: this.positionToAlgebraic(from),
                to: this.positionToAlgebraic(to),
                piece,
                captured: this.board.getPiece(to) || undefined,
                special: this.getSpecialMoveType(from, to, piece)
            };

            // Handle promotion
            if (move.special === 'promotion' && promotionType) {
                move.promoteTo = promotionType;
                piece.type = promotionType;
            }

            // Make the move
            this.board.movePiece(from, to);
            piece.hasMoved = true;

            // Update en passant target
            this.updateEnPassantTarget(from, to, piece);

            // Update move history and draw conditions
            this.moveHistory.push(move);
            this.drawConditions.addMove(move);

            // Check game state
            this.updateGameState();

            // Switch turns
            this.turn = this.turn === "white" ? "black" : "white";
            return true;
        }

        return false;
    }

    private updateGameState(): void {
        if (isCheckmate(this.board, this.turn)) {
            this.gameStatus = 'checkmate';
        } else if (isStalemate(this.board, this.turn)) {
            this.gameStatus = 'stalemate';
        } else if (
            this.drawConditions.isThreefoldRepetition(this.board) ||
            this.drawConditions.isFiftyMoveRule() ||
            this.drawConditions.isInsufficientMaterial(this.board)
        ) {
            this.gameStatus = 'draw';
        }
    }

    private updateEnPassantTarget(from: Position, to: Position, piece: Piece): void {
        if (piece.type === "pawn" && Math.abs(to.row - from.row) === 2) {
            this.enPassantTarget = {
                row: (from.row + to.row) / 2,
                col: from.col
            };
        } else {
            this.enPassantTarget = null;
        }
    }

    private getSpecialMoveType(from: Position, to: Position, piece: Piece): Move["special"] | undefined {
        if (piece.type === "pawn") {
            if (isPromotionMove(to, piece.color)) {
                return "promotion";
            }
            if (this.enPassantTarget && 
                to.row === this.enPassantTarget.row && 
                to.col === this.enPassantTarget.col) {
                return "enPassant";
            }
        }
        if (piece.type === "king" && Math.abs(to.col - from.col) === 2) {
            return "castle";
        }
        return undefined;
    }

    private positionToAlgebraic(pos: Position): string {
        const file = String.fromCharCode('a'.charCodeAt(0) + pos.col);
        const rank = 8 - pos.row;
        return `${file}${rank}`;
    }

    printState() {
        console.log(`Turn: ${this.turn}`);
        console.log(`Game Status: ${this.gameStatus}`);
        this.board.printBoard();
    }
}
