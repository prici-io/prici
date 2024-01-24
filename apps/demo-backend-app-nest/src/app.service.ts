import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private todos: Array<{id: string; [key:string]: any}>
  constructor() {
    this.todos = [];
  }

  getAllTodos (): Array<{id: string; [key:string]: any}> {
    return [...this.todos];
  }

  createTodo (payload: any): {id: string; [key:string]: any} {
    const todo = payload || {};
    todo.id = btoa(Math.random().toString());

    this.todos.push(todo);

    return todo;
  }
}
