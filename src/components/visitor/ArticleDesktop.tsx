export function ArticleItemDesktop() {
  return (
    <article>
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-2">
          <h2 className="min-w-0 flex-1 text-sm font-medium leading-snug">
            <a href="..." className="hover:underline">
              Long title that wraps… Long title that wraps… Long title that
              wraps… Long title that wraps…
            </a>
          </h2>

          <span className="shrink-0 whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5 text-xs">
            CC BY-SA
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-0.5 text-xs text-gray-500">
          <time className="2026-01-25">2h ago</time>

          <span className="rounded-full bg-gray-100 px-2 py-0.5">
            Example Feed
          </span>

          <img src="/feed-icon.png" alt="" className="h-4 w-4" />
        </div>
      </header>
      <p>Description</p>
    </article>
  );
}
