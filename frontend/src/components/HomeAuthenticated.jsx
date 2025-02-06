export default function HomeAuthenticated({ user }) {
  return (
    <div>
      <h2>Bienvenido, {user ? user.username : "Usuario"}</h2>
      <p>Esta es tu página de inicio personalizada.</p>
      {/* Aquí puedes agregar más contenido específico para usuarios autenticados */}
    </div>
  );
}
