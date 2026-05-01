import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="bg-white border rounded p-4 text-sm space-y-2">
        <div><span className="text-gray-500">Name:</span> {user.name}</div>
        <div><span className="text-gray-500">Email:</span> {user.email}</div>
        <div><span className="text-gray-500">Role:</span> {user.role}</div>
        <div><span className="text-gray-500">Language:</span> {user.language}</div>
      </div>
    </div>
  );
}
