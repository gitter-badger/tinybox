export function TextInput({ ...props }: any) {
  return (
    <input
      className="border block px-4 py-2 drop-shadow-md rounded-md outline-none focus:border-gray-500 w-full"
      {...props}
    />
  );
}
