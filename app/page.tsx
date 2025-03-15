import JournalEditor from "@/components/journal-editor"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-slate-800 dark:text-slate-100">My Journal</h1>
        <JournalEditor />
      </div>
    </main>
  )
}

