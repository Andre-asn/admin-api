import LoginForm from "./(auth)/login/page";

const Home = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <LoginForm />
    </main>
  );
};

export default Home;
