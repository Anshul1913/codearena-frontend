export default function Controls({ current, total, setCurrent, onSubmit }) {
  return (
    <div className="flex justify-between mt-4">
      <button
        disabled={current === 0}
        onClick={() => setCurrent(current - 1)}
        className="px-4 py-2 bg-bg border border-border rounded-lg disabled:opacity-40"
      >
        Previous
      </button>

      {current === total - 1 ? (
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-primary text-white rounded-lg"
        >
          Submit
        </button>
      ) : (
        <button
          onClick={() => setCurrent(current + 1)}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Next
        </button>
      )}
    </div>
  );
}
