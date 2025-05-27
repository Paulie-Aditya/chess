export type Color = 'white' | 'black';
export type PieceType = 'pawn' | 'rook' | 'bishop' | 'knight' | 'queen' | 'king';
export interface Position {
    row: number;
    col: number;
}
export interface Piece {
    type: PieceType;
    color: Color;
    hasMoved: boolean;
}
export type ChessBoard = (Piece | null)[][];
export interface Move {
    from: string;
    to: string;
    piece: Piece;
    captured?: Piece;
    special?: 'castle' | 'enPassant' | 'promotion';
    promoteTo?: 'queen' | 'rook' | 'bishop' | 'knight';
}
export interface Player {
    id: string;
    socketId: string;
    color: Color;
    username?: string;
}
export interface GameState {
    id: string;
    participant1: Player;
    participant2: Player;
    board: ChessBoard;
    moves: Move[];
    currentPlayer: Color;
    gameStatus: 'waiting' | 'active' | 'checkmate' | 'stalemate' | 'draw' | 'resigned';
    enPassantTarget?: string;
    castlingRights: {
        whiteKingside: boolean;
        whiteQueenside: boolean;
        blackKingside: boolean;
        blackQueenside: boolean;
    };
}
