// src/components/common/SkipLink.tsx
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only bg-white text-black focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:px-3 focus:py-2 focus:outline-none focus:ring"
    >
      Aller au contenu
    </a>
  );
}
