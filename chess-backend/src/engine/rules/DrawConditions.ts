import { Board } from "../Board";
import { Move, Position } from "chess-shared/types";

export class DrawConditions {
    private moveHistory: Move[] = [];
    private moveCount: number = 0;
    private lastCaptureOrPawnMove: number = 0;

    constructor() {
        this.moveHistory = [];
        this.moveCount = 0;
        this.lastCaptureOrPawnMove = 0;
    }

    addMove(move: Move): void {
        this.moveHistory.push(move);
        this.moveCount++;
        
        if (move.captured || move.piece.type === "pawn") {
            this.lastCaptureOrPawnMove = this.moveCount;
        }
    }

    isThreefoldRepetition(board: Board): boolean {
        const currentPosition = this.getBoardHash(board);
        let repetitionCount = 1;

        // Check last 50 moves for repetitions
        for (let i = this.moveHistory.length - 2; i >= 0; i -= 2) {
            if (i < this.moveHistory.length - 50) break;
            
            const tempBoard = new Board();
            // Replay moves up to this point
            for (let j = 0; j <= i; j++) {
                const move = this.moveHistory[j];
                tempBoard.movePiece(
                    this.algebraicToPosition(move.from),
                    this.algebraicToPosition(move.to)
                );
            }
            
            if (this.getBoardHash(tempBoard) === currentPosition) {
                repetitionCount++;
                if (repetitionCount >= 3) return true;
            }
        }
        
        return false;
    }

    isFiftyMoveRule(): boolean {
        return this.moveCount - this.lastCaptureOrPawnMove >= 50;
    }

    isInsufficientMaterial(board: Board): boolean {
        const pieces = this.getPieceCount(board);
        
        // King vs King
        if (pieces.total === 2) return true;
        
        // King and Knight vs King
        if (pieces.total === 3 && (pieces.white.knight === 1 || pieces.black.knight === 1)) return true;
        
        // King and Bishop vs King
        if (pieces.total === 3 && (pieces.white.bishop === 1 || pieces.black.bishop === 1)) return true;
        
        // King and Bishop vs King and Bishop (same color squares)
        if (pieces.total === 4 && 
            pieces.white.bishop === 1 && 
            pieces.black.bishop === 1) {
            // Check if bishops are on same color squares
            const whiteBishopPos = this.findPiece(board, "bishop", "white");
            const blackBishopPos = this.findPiece(board, "bishop", "black");
            if (whiteBishopPos && blackBishopPos) {
                const whiteSquareColor = (whiteBishopPos.row + whiteBishopPos.col) % 2;
                const blackSquareColor = (blackBishopPos.row + blackBishopPos.col) % 2;
                if (whiteSquareColor === blackSquareColor) return true;
            }
        }
        
        return false;
    }

    private getBoardHash(board: Board): string {
        return board.board.map(row => 
            row.map(piece => piece ? `${piece.color}${piece.type}` : "null").join(",")
        ).join("|");
    }

    private getPieceCount(board: Board): {
        total: number;
        white: { [key: string]: number };
        black: { [key: string]: number };
    } {
        const counts = {
            total: 0,
            white: { pawn: 0, knight: 0, bishop: 0, rook: 0, queen: 0, king: 0 },
            black: { pawn: 0, knight: 0, bishop: 0, rook: 0, queen: 0, king: 0 }
        };

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPiece({ row, col });
                if (piece) {
                    counts.total++;
                    counts[piece.color][piece.type]++;
                }
            }
        }

        return counts;
    }

    private findPiece(board: Board, type: string, color: string): Position | null {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPiece({ row, col });
                if (piece?.type === type && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    private algebraicToPosition(algebraic: string): Position {
        const col = algebraic.charCodeAt(0) - 'a'.charCodeAt(0);
        const row = 8 - parseInt(algebraic[1]);
        return { row, col };
    }
} 