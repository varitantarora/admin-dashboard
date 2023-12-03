// import logo from './logo.svg';
import "./App.css";
import UserList from "./components/UserList";

function App() {
  return (
    <div className="bg-slate-50 min-h-screen p-20 pt-10">
      <h1 className="text-gray-600 text-4xl font-bold text-center m-4">ADMIN DASHBOARD</h1>
      <UserList/>
    </div>
  );
}

export default App;
