export function PrimaryButton({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-black rounded-md text-white px-4 py-2 drop-shadow-md outline-none active:scale-95 transition-all"
    >
      {children}
    </button>
  );
}

export function LinkButton({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 outline-none active:scale-95 transition-all"
    >
      {children}
    </button>
  );
}
