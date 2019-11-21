import { observable, action } from "mobx";
import { TodoStore } from "../store";

class TodoModel {
    @observable
    public title: string;

    @observable
    public completed: boolean = false;

    @observable
    public id: number;

    private store: TodoStore;

    constructor(store: TodoModel["store"], title: TodoModel["title"]) {
        this.id = store.todos.length + 1;
        this.store = store;
        this.title = title;
    }

    @action
    public toggle() {
        this.completed = !this.completed;
    }

    @action
    public destroy() {
        this.store.todos.splice(this.store.todos.indexOf(this), 1);
    }

    @action
    public setTitle(title: TodoModel["title"]) {
        this.title = title;
    }
}

export { TodoModel };
