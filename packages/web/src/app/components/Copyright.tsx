export function Copyright() {
  return (
    <div className="text-xs text-gray-500 text-center">
      &copy; Tinybox 2022
      <br />
      Build: {process.env['NX_BUILD'] || 'unknown-build'}
    </div>
  );
}
