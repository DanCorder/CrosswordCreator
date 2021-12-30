import { ClueState } from "./ClueState";
import { GridState } from "./GridState";

export class CrosswordState {
    clues = new ClueState();
    grid = new GridState();

    serialize(): string {
        return JSON.stringify(this.toObject());
    }

    hydrate(jsonData: string): CrosswordState {
        const data: ReturnType<CrosswordState["toObject"]> = JSON.parse(jsonData);

        this.clues = new ClueState(data.clues);
        this.grid = new GridState(data.grid);

        return this;
    }

    private toObject() {
        return {
            clues: this.clues.toObject(),
            grid: this.grid.toObject()
        };
    }
}