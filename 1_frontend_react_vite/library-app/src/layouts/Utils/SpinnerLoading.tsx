export const SpinnerLoading = () => {
  return (
    <div
      data-testid="loading-spinner"
      className="mt-[5rem] flex items-center justify-center p-8"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-cyan-700"></div>
    </div>
  );
};
