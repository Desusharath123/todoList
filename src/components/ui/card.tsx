import { JSX } from "react";
import { TodoItem } from "../../store/todosSlice";
import deletIcon from '../../assets/Trash.png';
import editIcon from "../../assets/Pencil.png"
import { ITEM_STATUS } from "./TodoAppList";

type props = {
    item: TodoItem,
    onEdit: () => void,
    onDelete: () => void;
}

export const  Card = ({ item, onEdit, onDelete }: props): JSX.Element => {

    const getItemStatusColor = () => {
      if (item.status === ITEM_STATUS.pending) {
          return "grey"
      } else if (item.status === ITEM_STATUS.progress) {
        return "yellow"
      } else {
        return "green"
      }
    }
    const StatusBadge = () => {
      const styles = {
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: getItemStatusColor(),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
        return (
          <div className="statusbadge">
           <div style={styles}> </div>
            <span>{item.status}</span>
          </div>
        )
      }
      
    const title = item.title.charAt(0).toUpperCase();
    const description = item.description;
    return (
      <div className="card">
        <div className="avatar">{title}</div>
        <div className="card-body">
          <div className="card-top">
            <div className="card-title">{item.title}</div>
                {StatusBadge()}
          </div>
          <div className="card-desc">{description}</div>
          <div className="card-meta">{new Date(item.createdAt).toDateString()}</div>
        </div>
        <div className="card-actions">
          <button onClick={onEdit} title="Edit">
            <img src={editIcon} alt=""></img>
          </button>
          <button onClick={onDelete}>
            <img src={deletIcon} alt=""></img>
          </button>
        </div>
      </div>
    );
  }

  
  
 