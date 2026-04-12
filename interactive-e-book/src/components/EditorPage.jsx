import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function EditorPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSave = () => {
    const newStory = {
      id: Date.now(),
      title,
      text,
    };

    // пока просто в localStorage
    const existing = JSON.parse(localStorage.getItem("stories") || "[]");
    localStorage.setItem("stories", JSON.stringify([...existing, newStory]));

    alert("Произведение сохранено!");
    setTitle("");
    setText("");
  };

  return (
    <div className="editor">
      <button className="btn" onClick={() => navigate("/")}>На главную</button>
      <h1>Добавить произведение</h1>

      <input
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Текст произведения..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className="btn" onClick={handleSave}>Сохранить</button>
    </div>
  );
}