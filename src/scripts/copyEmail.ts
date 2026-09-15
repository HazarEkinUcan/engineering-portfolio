/**
 * Copy-to-clipboard beside the email address. The mailto link works with or
 * without this. Success is announced through a polite live region.
 *
 * The four visible strings are rendered by the server into data attributes
 * rather than written here, so the announcement is in the page's own language.
 * There are no English defaults: a missing attribute would otherwise put an
 * English sentence inside a Turkish page, which is the one thing this
 * localisation is not allowed to do.
 */
export function initCopyEmail(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-copy-email]');
  const status = document.querySelector<HTMLElement>('[data-copy-status]');
  if (!button) return;

  const email = button.dataset.copyEmail;
  if (!email || !navigator.clipboard) return;

  button.hidden = false;

  const labelIdle = button.dataset.copyLabel ?? button.textContent ?? '';
  const labelDone = button.dataset.copiedLabel ?? labelIdle;
  const announceDone = button.dataset.copiedStatus ?? '';
  const announceFail = button.dataset.copyFailed ?? '';

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      if (status) status.textContent = announceDone;
      button.dataset.copied = 'true';
      button.textContent = labelDone;
      window.setTimeout(() => {
        delete button.dataset.copied;
        button.textContent = labelIdle;
        if (status) status.textContent = '';
      }, 2600);
    } catch {
      if (status) status.textContent = announceFail;
    }
  });
}
