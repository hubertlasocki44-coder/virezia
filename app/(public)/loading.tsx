export default function PublicLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-gold/20 border-t-accent-gold" />
      </div>
    </div>
  );
}
