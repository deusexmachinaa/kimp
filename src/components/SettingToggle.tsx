// SettingToggle 컴포넌트

type SettingToggleProps = {
  icon: string;
  text: string;
  value: boolean;
  onToggle: () => void;
};

export const SettingToggle: React.FC<SettingToggleProps> = ({
  icon,
  text,
  value,
  onToggle,
}) => (
  <li className="space-x-1 pl-2 pr-3 flex items-center">
    <span className="w-8 h-8 inline-flex items-center justify-center">
      <i aria-hidden="true" className={icon}></i>
    </span>
    <div className="flex justify-between items-center flex-1">
      {text}
      <span
        onClick={onToggle}
        className={`relative w-11 h-7 cursor-pointer rounded-full ml-2 lg:ml-4 ${
          value ? "bg-green-200" : "bg-gray-200 dark:bg-gray-600"
        }`}
      >
        <span
          className="bg-white dark:bg-gray-100 w-7 h-7 absolute top-0 bottom-0 rounded-full transition-all duration-200 transform scale-90"
          style={{ left: value ? "calc(100% - 1.75rem)" : "0px" }}
        >
          <i aria-hidden="true" className="fas far"></i>
        </span>
      </span>
    </div>
  </li>
);
