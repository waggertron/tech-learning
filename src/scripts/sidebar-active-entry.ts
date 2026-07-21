const ACTIVE_ENTRY_SELECTOR = 'a[aria-current="page"]';
const SIDEBAR_ID = 'starlight__sidebar';
const EDGE_PADDING = 24;

function openActiveEntryPath(activeEntry: HTMLAnchorElement): void {
  let group = activeEntry.parentElement?.closest('details');

  while (group) {
    group.open = true;
    group = group.parentElement?.closest('details');
  }
}

export function revealActiveSidebarEntry(): void {
  const sidebar = document.getElementById(SIDEBAR_ID);
  const activeEntry = sidebar?.querySelector<HTMLAnchorElement>(ACTIVE_ENTRY_SELECTOR);
  if (!sidebar || !activeEntry) return;

  openActiveEntryPath(activeEntry);

  const sidebarRect = sidebar.getBoundingClientRect();
  const activeRect = activeEntry.getBoundingClientRect();
  const visibleTop = sidebarRect.top + EDGE_PADDING;
  const visibleBottom = sidebarRect.bottom - EDGE_PADDING;
  const isOutsideViewport = activeRect.top < visibleTop || activeRect.bottom > visibleBottom;

  if (isOutsideViewport) {
    const centeredTop =
      sidebar.scrollTop +
      activeRect.top -
      sidebarRect.top -
      (sidebar.clientHeight - activeRect.height) / 2;

    sidebar.scrollTo({
      top: Math.max(0, centeredTop),
      behavior: 'auto',
    });
  }

  sidebar.dataset.activeEntryReady = 'true';
}

function scheduleActiveEntryReveal(): void {
  requestAnimationFrame(() => requestAnimationFrame(revealActiveSidebarEntry));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleActiveEntryReveal, { once: true });
} else {
  scheduleActiveEntryReveal();
}

document.addEventListener('astro:page-load', scheduleActiveEntryReveal);
