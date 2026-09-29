type ExternalResourceData = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  resourceKind: string;
  sourceName: string;
};

export function ExternalResourceCard({
  resource,
}: {
  resource: ExternalResourceData;
}) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-black/10 p-4 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-black/60 dark:text-white/60">
        <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
          {resource.resourceKind === "VIDEO" ? "Video" : "Article"}
        </span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
          {resource.sourceName}
        </span>
      </div>
      <h3 className="mt-2 text-lg font-semibold hover:underline">
        {resource.title}
      </h3>
      {resource.description && (
        <p className="mt-1 line-clamp-2 text-sm text-black/70 dark:text-white/70">
          {resource.description}
        </p>
      )}
    </a>
  );
}
