export default function LoginPage() {
  return (
    <div className="mx-auto mt-24 max-w-md rounded border bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">Internal Login</h2>
      <form className="space-y-3">
        <input className="w-full rounded border p-2" placeholder="Email" />
        <input className="w-full rounded border p-2" placeholder="Password" type="password" />
        <button className="w-full rounded bg-slate-900 p-2 text-white">Sign in</button>
      </form>
    </div>
  );
}
