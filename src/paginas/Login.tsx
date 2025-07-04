import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../api/userApi'; 

export default function Login() {
  const [nickname, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const usuarios = await getUsers();
      const usuario = usuarios.find((u: any) => u.nickname === nickname && u.password === password);

      if (!usuario) {
        alert('Usuario o contraseña incorrecta');
        return;
      }

      setUser(usuario);
      localStorage.setItem('user', JSON.stringify(usuario));
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleLogin} className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      <input
        placeholder="nickname"
        value={nickname}
        onChange={(e) => setNickName(e.target.value)}
        className="form-control mb-2"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-control mb-2"
      />
      <button type="submit" className="btn btn-success">
        Ingresar
      </button>
    </form>
  );
}
