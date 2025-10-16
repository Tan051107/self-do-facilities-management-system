import "../css/ToggleSwitch.css";

function ToggleSwitch({isOn,onToggle}) {

  return (
    <div
      className={`toggle-switch ${isOn ? "on" : "off"}`}
      onClick={onToggle}
    >
      <div className="switch-handle"></div>
    </div>
  );
}

export default ToggleSwitch;
