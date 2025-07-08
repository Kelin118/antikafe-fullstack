export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-secondary mb-4">
        Добро пожаловать в систему учёта гостей
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl">
        Это приложение позволяет вести учёт гостей антикафе в режиме реального времени. Добавляйте гостей, отслеживайте время и управляйте ими легко и удобно.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/login"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-all"
        >
          Войти
        </a>
        <a
          href="/register"
          className="bg-accent text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-all"
        >
          Зарегистрироваться
        </a>
      </div>
    </div>
  );
}
