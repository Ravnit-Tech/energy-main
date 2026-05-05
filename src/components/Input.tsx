interface InputProps {
  label: string;
  placeholder: string;
}

export default function Input({ label, placeholder }: InputProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="font-medium text-gray-700">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="border border-gray-400 p-3 rounded-md focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
