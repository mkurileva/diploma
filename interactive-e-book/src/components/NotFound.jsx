import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      fontFamily: 'inherit'
    }}>
      <h1 style={{ fontSize: '120px', margin: '0', color: '#a0a9b9' }}>404</h1>
      <p style={{ fontSize: '20px', marginBottom: '30px' }}>
        Такой страницы не существует
      </p>
      <button className="btn-editor" onClick={() => navigate("/")}>
        Вернуться на главную
      </button>
    </div>
  );
}