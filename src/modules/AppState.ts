import { CrosswordState } from "./CrosswordState";
import { CrosswordStateStore } from "./CrosswordStateStore";
import { get } from "svelte/store";

export function getSaveData(): Blob {
    const data = toObject();
    const dataString = JSON.stringify(data);
    const blob = new Blob([dataString], {type: 'application/json;charset=utf-8;'});

    return blob;
}

export function parseSaveData(file: File) {
    file.text().then(fileContent => {
        const data: ReturnType<typeof toObject> = JSON.parse(fileContent);
        CrosswordStateStore.set(new CrosswordState(data.crosswordState));
    })
    .catch(reason => alert("Couldn't understand save file: " + reason));
}

// File format version history
// v2 - Add top level settings section containng author and title
function toObject() {
    return {
        version: 2,
        crosswordState: get(CrosswordStateStore).toObject()
    };
}
