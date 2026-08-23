export function resolveRetryableMediaSource(source: string | undefined, attempt: number): string | undefined {
  if (!source || attempt <= 0) return source;

  const separator = source.includes("?") ? "&" : "?";
  return `${source}${separator}agriguardMediaRetry=${attempt}`;
}

export function shouldUseMediaFallback(source: string | undefined, hasExhaustedRetry: boolean): boolean {
  return !source || hasExhaustedRetry;
}
