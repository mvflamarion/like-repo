import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner size={50} className="text-white animate-spin" />
    </div>
  );
}
