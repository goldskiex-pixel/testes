export default function UploadPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Upload setup file</h2>
      <div className="rounded border bg-white p-4">
        <p className="mb-3 text-sm text-slate-600">Select client and upload standardized .xlsx setup spreadsheet.</p>
        <form className="space-y-3">
          <input className="w-full rounded border p-2" placeholder="Client ID" />
          <input className="w-full rounded border p-2" type="file" accept=".xlsx" />
          <button className="rounded bg-slate-900 px-4 py-2 text-white">Upload</button>
        </form>
      </div>
    </div>
  );
}
