import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../style/todoStyle.css';
import { RootState } from '../../store/store';
import { addTodo, deleteTodo, setSearchQuery, TaskStatus, TodoItem, updateTodo } from '../../store/todosSlice';
import { Card } from './card';
import { Section } from './sectionWrapper';
import plusIcon from "../../assets/plus.png"
import searchIcon from "../../assets/Search.png"
import backButton from "../../assets/backbutton.png"

type pageMode = 'add' | 'edit' | null;

type formDetails = {
  title: string,
  description: string, 
  status: TaskStatus
}

export enum ITEM_STATUS  {
  progress = "In Progress",
  pending = "Pending",
  Completed = "Completed"
}

export default function TodoApp() {
  const [pageMode, setPageMode] = useState<pageMode>(null);
  const [editItem, setEditedItem] = useState<TodoItem | null>(null);
  const [form, setForm] = useState<formDetails>(
    {  title: '',
       description: '', 
       status: 'Pending' 
      }
    );

  const dispatch = useDispatch();
  const { items, searchQuery } = useSelector((s: RootState) => s.todo);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(t => t.title.toLowerCase().includes(q));
  }, [items, searchQuery]);

  const groups: Record<TaskStatus, TodoItem[]> = useMemo(() => ({
    'In Progress': filtered.filter(t => t.status === ITEM_STATUS.progress),
    'Pending': filtered.filter(t => t.status === ITEM_STATUS.pending),
    'Completed': filtered.filter(t => t.status ===  ITEM_STATUS.Completed)
  }), [filtered]);

  const openAdd = () => {
    setForm({ title: '', description: '', status: 'Pending' });
    setEditedItem(null);
    setPageMode('add');
  }

  const openEdit = (item: TodoItem) => {
    setEditedItem(item);
    setForm({ title: item.title, description: item.description, status: item.status });
    setPageMode('edit');
  }

  const onSubmit = () => {
    if (!form.title) return;
    if (pageMode === 'add') {
      dispatch(addTodo({ title: form.title.trim(), description: form.description.trim() }));
    } else if (pageMode === 'edit' && editItem) {
      dispatch(updateTodo({ id: editItem.id, title: form.title.trim(), description: form.description.trim(), status: form.status }));
    }
    setPageMode(null);
  }

  const deleteTodoItem = (item: any) => {
    dispatch(deleteTodo(item.id))
  }


  const renderListSection = () => {
    const progressItemLength = groups[ITEM_STATUS.progress].length;
    const pendingItemLength = groups[ITEM_STATUS.pending].length;
    const completedItemLength = groups[ITEM_STATUS.Completed].length;
    return (
       <div className="content">
        <Section title={`${ITEM_STATUS.progress}(${progressItemLength})`}>
          {groups[ITEM_STATUS.progress].map(item => (
            <Card key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => deleteTodoItem(item)} />
          ))}
        </Section>

        <Section title={`${ITEM_STATUS.pending}(${pendingItemLength})`}>
          {groups[ITEM_STATUS.pending].map(item => (
            <Card key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => deleteTodoItem(item)} />
          ))}
        </Section>

        <Section title={`${ITEM_STATUS.Completed}(${completedItemLength})`}>
          {groups[ITEM_STATUS.Completed].map(item => (
            <Card key={item.id} item={item} onEdit={() => openEdit(item)} onDelete={() => deleteTodoItem(item)} />
          ))}
        </Section>
      </div>
    )
  }
  
  const renderheader = () => {
    return (
      <div>
         <div className="topbar">
          <span className="brand">TO-DO APP</span>
         </div>
         <div className='inputBox'>
          <img className='searchIcon' src={searchIcon} alt=''/>
          <input
              className="search"
              placeholder="Search To-do"
              value={searchQuery}
              onChange={e => dispatch(setSearchQuery(e.target.value))}
            />
         </div>
      </div>
      
    )
  }

  const renderEditSection = () => {
    return (
      (
        <div className="status-select">
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as TaskStatus })}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      )
    )
  }
  
  const renderBody = () => {
    return (
      <div className="modal-backdrop" onClick={() => setPageMode(null)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back" onClick={() => setPageMode(null)}>
            <img src={backButton} alt=''></img>
          </button>
          <div>{pageMode === 'add' ? 'Add Task' : 'Edit Task'}</div>
        </div>
        <div className="modal-body">
          <input className="input" placeholder="Enter the title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="textarea" placeholder="Enter the description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          {pageMode === 'edit' && renderEditSection() }
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={() => setPageMode(null)}>Cancel</button>
          <button className="btn primary" onClick={onSubmit}>{pageMode === 'add' ? 'Add' : 'Update'}</button>
        </div>
      </div>
    </div>
    )
  }


  return (
    <div className="todo-app">
      {renderheader()}
      {renderListSection()}
      <button className="fab" onClick={openAdd}>
        <img src={plusIcon} alt=''></img>
      </button>
      {pageMode && renderBody()}
    </div>
  );


}


