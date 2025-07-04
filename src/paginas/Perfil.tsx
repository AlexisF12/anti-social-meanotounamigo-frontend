import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/constants';
import { Post } from '../types/mongoSchemas';

type PostConContador = Post & { comentariosVisibles?: number };

export default function Perfil() {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState<PostConContador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/post`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener posts');
        return res.json();
      })
      .then((data: PostConContador[]) => {
        const propios = data.filter((post) => {
          const userIdPost = typeof post.user === 'string'
            ? post.user
            : post.user?._id;
          return userIdPost === user.id;
        });
        setPosts(propios);
      })
      .catch((err) => {
        console.error('Error al obtener posts:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const manejarLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="container mt-4">
      <h2>Perfil de {user.nickname}</h2>

      <button className="btn btn-danger mb-3" onClick={manejarLogout}>
        Cerrar sesión
      </button>

      {loading && <p>Cargando publicaciones...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && posts.length === 0 && (
        <p>No publicaste nada todavía.</p>
      )}

      {posts.map((post) => (
        <PostCard
          key={post.id || post._id}
          post={post}
          cantidadComentarios={post.comentariosVisibles ?? 0}
      />
  ))}
    </div>
  );
}