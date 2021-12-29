import { ClueState } from "./ClueState";
import { GridState } from "./GridState";

export class CrosswordState {
    Clues = new ClueState();
    Grid = new GridState(11);
}