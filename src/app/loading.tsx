export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f2eb] px-5 text-[#123529]">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#d8dfd2] border-t-[#1b4d3e]" />

        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
          ORINOCA NATURAL
        </p>

        <p className="mt-2 text-neutral-600">Preparing your ritual...</p>
      </div>
    </main>
  );
}