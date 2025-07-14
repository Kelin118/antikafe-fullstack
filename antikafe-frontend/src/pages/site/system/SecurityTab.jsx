export default function SecurityTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Безопасность</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="password" placeholder="Новый пароль" className="border px-3 py-2 rounded" />
        <input type="password" placeholder="Подтвердите пароль" className="border px-3 py-2 rounded" />
      </div>

      <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">🔒 Сбросить пароль</button>
    </div>
  );
}
