import { useState } from 'react';
import { PostPopulated, Comentario } from '../types/mongoSchemas';
import ComentarioItem from './ComentarioItem';
import FormularioComentario from './FormularioComentario';
import { useAuth } from '../context/AuthContext';

interface Props {
  post: PostPopulated;
}

export default function PostDetalleFlexible({ post }: Props) {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState(post.comentarios ?? []);
  const etiquetas = post.etiquetas.map((e) => e.nombre);

  const agregarComentario = (nuevoComentario: Comentario) => {
  setComentarios([...comentarios, nuevoComentario]);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Detalle de Publicación</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">{post.descripcion}</h5>
          <p><strong>Fecha:</strong> {post.fecha}</p>
          <p>
            <strong>Etiquetas:</strong>{' '}
            {etiquetas.length > 0
              ? etiquetas.join(', ')
              : <span className="text-muted">(sin etiquetas)</span>}
          </p>
        </div>
      </div>

      <h5 className="mb-3">Comentarios</h5>

      {comentarios.length > 0 ? (
        <ul className="list-group mb-4">
          {comentarios.map((comentario) => (
            <ComentarioItem key={comentario._id || Math.random()} comentario={comentario} />
          ))}
        </ul>
      ) : (
        <p className="text-muted mb-4">Este post aún no tiene comentarios visibles.</p>
      )}

      {user && (
        <FormularioComentario postId={post._id} onComentarioAgregado={agregarComentario} />
      )}
    </div>
  );
}