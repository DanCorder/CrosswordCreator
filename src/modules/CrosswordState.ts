import { ClueState } from "./ClueState";
import { GridState } from "./GridState";

export class CrosswordState {
    clues = new ClueState();
    grid = new GridState(11);
}