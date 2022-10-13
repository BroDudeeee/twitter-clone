export default function MyComponent({ Text, Icon, active }) {
  return (
    <div
      className={`flex space-x-2 cursor-pointer  py-3 rounded-full hover:bg-gray-100 items-center w-fit text-center hover:px-4 transition-all ease-in-out hover:text-blue-400
      ${active && "text-blue-400 font-bold text-lg bg-gray-100 px-4"}
      `}
    >
      <Icon className="h-6" />
      <span className="hidden xl:inline-flex">{Text}</span>
    </div>
  );
}
