export default function Header() {
  return (
    <header className="bg-white px-10 py-5 shadow-sm flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Admin Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Manage your galleries professionally
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
      </div>
    </header>
  );
}
