import { CrosswordState } from "./CrosswordState";
import { CrosswordStateStore } from "./CrosswordStateStore";
import { get } from "svelte/store";

type SaveData = {
    filename: string,
    fileData: Blob
};

export function getSaveData(): SaveData {
    const filename = "crossword.json";
    const data = toObject();
    const dataString = JSON.stringify(data);
    const blob = new Blob([dataString], {type: 'application/json;charset=utf-8;'});

    return { 
        filename: filename,
        fileData: blob
    };
}

export function parseSaveData(file: File) {
    file.text().then(fileContent => {
        const data: ReturnType<typeof toObject> = JSON.parse(fileContent);
        CrosswordStateStore.set(new CrosswordState(data.crosswordState));
    })
    .catch(reason => alert("Couldn't understand save file: " + reason));
}

function toObject() {
    return {
        version: 1,
        crosswordState: get(CrosswordStateStore).toObject()
    };
}
