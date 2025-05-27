import {ChessBoard, Piece, Position, Color, PieceType} from "chess-shared/types"

export class Board{
    board: ChessBoard;

    constructor() {
        this.board = this.init();
    }

    private init(): ChessBoard {
        const emptyRow = (): (Piece | null)[] => Array(8).fill(null);
        const backRow = (color: Color): Piece[] => [
            { type: "rook", color, hasMoved: false},
            { type: "knight", color, hasMoved: false },
            { type: "bishop", color, hasMoved: false },
            { type: "queen", color, hasMoved: false },
            { type: "king", color, hasMoved: false },
            { type: "bishop", color, hasMoved: false },
            { type: "knight", color, hasMoved: false },
            { type: "rook", color, hasMoved: false },
        ];
        const pawnRow = (color: Color): Piece[] =>
            Array(8).fill(null).map(() => ({ type: "pawn", color, hasMoved: false }));

        return [
            backRow("black"),
            pawnRow("black"),
            emptyRow(),
            emptyRow(),
            emptyRow(),
            emptyRow(),
            pawnRow("white"),
            backRow("white"),
        ];
    }

    getPiece(pos: Position): Piece | null {
        return this.board[pos.row][pos.col];
    }
    movePiece(from: Position, to: Position): void {
        const piece = this.getPiece(from);
        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = null;
    }

    printBoard(): void {
        console.log(this.board.map(row =>
        row.map(p => (p ? p.type[0].toUpperCase() : ".")).join(" ")
        ).join("\n"));
    }

    clone(): Board {
        const newBoard = new Board();
        newBoard.board = this.board.map(row =>
            row.map(piece => piece ? { ...piece } : null)
        );
        return newBoard;
    }

}