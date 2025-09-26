import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export interface TodosState {
  items: TodoItem[];
  searchQuery: string;
}

const initialState: TodosState = {
  items: [],
  searchQuery: ''
};

interface AddTodoPayload {
  title: string;
  description: string;
}

interface UpdateTodoPayload {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}


const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<TodoItem>) {
        state.items.push(action.payload);
      },
      prepare({ title, description }: AddTodoPayload) {
        return {
          payload: {
            id: crypto.randomUUID(),
            title,
            description,
            status: 'Pending' as TaskStatus,
            createdAt: new Date().toISOString()
          }
        };
      }
    },
    updateTodo(state, action: PayloadAction<UpdateTodoPayload>) {
      const { id, title, description, status } = action.payload;
      const existing = state.items.find(t => t.id === id);
      if (existing) {
        existing.title = title;
        existing.description = description;
        existing.status = status;
      }
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    }
  }
});

export const { addTodo, updateTodo, deleteTodo, setSearchQuery } = todosSlice.actions;
export default todosSlice.reducer;


