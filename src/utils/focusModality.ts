/**
 * Tracks whether the most recent user interaction was keyboard navigation.
 *
 * Why not CSS :focus-visible? Text inputs match :focus-visible even when
 * focused by mouse click (the browser assumes you are about to type), so a
 * focus-visible ring cannot distinguish "clicked into the field" from
 * "tabbed into the field". Modality has to be detected in JS.
 *
 * On native there is no document, so this always reports false — native focus
 * comes from direct touch, which never needs a focus ring.
 */
type KeyboardLikeEvent = { key?: string };
type DocumentLike = {
  addEventListener: (
    type: string,
    listener: (event: KeyboardLikeEvent) => void,
    options?: { capture?: boolean }
  ) => void;
};

let keyboardModality = false;

const doc = (globalThis as { document?: DocumentLike }).document;

if (doc) {
  doc.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Tab') keyboardModality = true;
    },
    { capture: true }
  );
  const backToPointer = () => {
    keyboardModality = false;
  };
  doc.addEventListener('pointerdown', backToPointer, { capture: true });
  doc.addEventListener('mousedown', backToPointer, { capture: true });
  doc.addEventListener('touchstart', backToPointer, { capture: true });
}

export const isKeyboardModality = (): boolean => keyboardModality;
