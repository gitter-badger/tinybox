export const AuthLayout = ({ children }: any) => {
  return (
    <div className="container mx-auto pt-10">
      <div className="max-w-lg mx-auto px-4">{children}</div>
    </div>
  );
};
