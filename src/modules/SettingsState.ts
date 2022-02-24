export class SettingsState {
    author = "";
    title = "";

    constructor(data: ReturnType<SettingsState["toObject"]> = null) {
        if (!!data) {
            this.author = data.author;
            this.title = data.title;
        }
    }

    toObject() {
        return {
            author: this.author,
            title: this.title,
        };
    }
}