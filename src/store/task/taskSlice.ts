import {
  createSlice,
  createAsyncThunk,
  AnyAction,
} from '@reduxjs/toolkit';
import {
  TaskAddProps,
  TaskDelProps,
  TaskShowProps,
  TaskGetByIdProps,
  TaskUpdateProps,
} from '../../components/interfaces';
import { getCookie } from '../../helpers/cookie';
import { API_URL } from '../auth/authService';
import { addColumn, deleteColumn, updateColumn } from '../columns/colSlice';
import { IError } from '../config';
import taskService from './taskService';

export const getAllAboutBoard = createAsyncThunk<
  BoardColTask,
  string,
  { rejectValue: string }
>('tasks/gettasks', async function (id, { rejectWithValue }) {
  try {
    const token = getCookie('user') || null;
    const response = await fetch(`${API_URL}/boards/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMassage = (error as IError).message;
    return rejectWithValue(errorMassage);
  }
});

export const getTaskById = createAsyncThunk(
  'tasks/getTaskById',
  async (task: TaskGetByIdProps, { rejectWithValue }) => {
    try {
      return await taskService.getTaskById(task);
    } catch (error) {
      const errorMessage = (error as IError).message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const createTask = createAsyncThunk<
  TaskShowProps,
  TaskAddProps,
  { rejectValue: string }
>(
  'tasks/createtask',
  async function (task, { rejectWithValue, dispatch }) {
    try {
      const token = getCookie('user') || null;

      const response = await fetch(
        `${API_URL}/boards/${task.boardId}/columns/${task.colId}/tasks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task.task),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      const errorMassage = (error as IError).message;
      return rejectWithValue(errorMassage);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTasks',
  async function (id: TaskDelProps, { rejectWithValue, dispatch }) {
    try {
      const token = getCookie('user') || null;

      await fetch(
        `${API_URL}/boards/${id.boardId}/columns/${id.colId}/tasks/${id.taskId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return id;
    } catch (error) {
      const errorMassage = (error as IError).message;
      return rejectWithValue(errorMassage);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task: TaskUpdateProps, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(task);
    } catch (error) {
      const errorMessage = (error as IError).message;
      return rejectWithValue(errorMessage);
    }
  }
);

export interface TaskState {
  tasks: Array<TaskShowProps>;
  loading: boolean;
  error: boolean;
  boardId: string;
  colId: string;
  newTask: TaskShowProps | null;
  newColumn: ColumnTaskProps;
  message: string | undefined;
  colTasks: BoardColTask;
  currentTask: TaskShowProps;
  taskById: TaskShowProps;
}

interface BoardColTask {
  id: string;
  title: string;
  description: string;
  columns: Array<ColumnTaskProps>;
}

export interface ColumnTaskProps {
  id: string;
  title: string;
  order: number;
  tasks: Array<TaskShowProps>;
  taskClick?: () => void;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: false,
  boardId: '',
  colId: '',
  newTask: {
    title: '',
    description: '',
    done: false,
    order: 0,
    userId: '',
    boardId: '',
    columnId: '',
    files: [],
    id: '',
  },
  message: undefined,
  colTasks: {
    id: '',
    title: '',
    description: '',
    columns: [],
  },
  currentTask: {
    title: '',
    description: '',
    done: false,
    order: 0,
    userId: '',
    boardId: '',
    columnId: '',
    files: [],
    id: '',
  },
  newColumn: {
    id: '',
    title: '',
    order: 1,
    tasks: [],
  },
  taskById: {
    id: '',
    title: '',
    order: 1,
    description: '',
    userId: '',
    boardId: '',
    columnId: '',
    files: [],
    done: false
  }
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    chooseTaskId(state, action) {
      state.currentTask = action.payload;
      // state.isOpen = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAboutBoard.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllAboutBoard.fulfilled, (state, action) => {
        state.colTasks = action.payload;
        state.colTasks.columns.sort((a, b) => a.order - b.order)
        state.loading = false;
      })
      .addCase(getAllAboutBoard.rejected, (state, action) => {
        state.error = true;
        state.message = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        // state.tasks = state.tasks.filter(
        //   (task) => task.id !== action.payload
        // );
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.newTask = action.payload;
        state.loading = false;
        state.colTasks.columns.forEach((col) => {
          if (
            state.newTask != null &&
            col.id === state.newTask.columnId
          ) {
            if (!col.tasks) {
              col.tasks = [];
            }
            col.tasks.push(state.newTask);
          }
        });
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = true;
        state.message = action.payload;
      })
      .addCase(addColumn.pending, (state) => {
        state.loading = true;
      })
      .addCase(addColumn.fulfilled, (state, action: AnyAction) => {
        state.newColumn = action.payload;
        state.loading = false;
        // state.isSuccess = true;
        state.colTasks.columns.push(state.newColumn);
      })
      .addCase(addColumn.rejected, (state, action: AnyAction) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
        // state.user = null;
      })
      .addCase(deleteColumn.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.colTasks.columns = state.colTasks.columns.filter(
          (column) => column.id !== id
        );
      })
      .addCase(updateColumn.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateColumn.fulfilled, (state, action: AnyAction) => {
        state.loading = false;
      })
      .addCase(updateColumn.rejected, (state, action: AnyAction) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.taskById = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action: AnyAction) => {
        state.error = true;
        state.message = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, action: AnyAction) => {
        state.error = true;
        state.message = action.payload;
      })
  },
});

export const { chooseTaskId } = taskSlice.actions;
export default taskSlice.reducer;
