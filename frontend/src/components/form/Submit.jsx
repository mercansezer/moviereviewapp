import { ImSpinner3 } from "react-icons/im";
function Submit({ value, busy, onClick, type }) {
  return (
    <button
      type={type || "submit"}
      onClick={onClick}
      className="w-full rounded dark:bg-white/100 bg-secondary dark:text-secondary text-white hover:bg-primary dark:hover:bg-white/90 transition font-semibold text-lg h-10 flex items-center justify-center cursor-pointer"
    >
      {busy ? <ImSpinner3 className="animate-spin" /> : value}
    </button>
  );
}

export default Submit;
