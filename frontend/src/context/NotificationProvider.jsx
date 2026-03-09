import { createContext, useState } from "react";

export const NotificationContext = createContext();

let timeOutId;

function NotificationProvider({ children }) {
  const [notification, setNotification] = useState("");
  const [classes, setClasses] = useState("");

  function updateNotification(type, value) {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    switch (type) {
      case "error":
        setClasses("bg-red-500");
        break;
      case "success":
        setClasses("bg-green-500");
        break;
      case "warning":
        setClasses("bg-orange-500");
        break;
      default:
        setClasses("bg-red-500");
    }
    setNotification(value);

    timeOutId = setTimeout(function () {
      setNotification("");
    }, 3000);
  }

  return (
    <NotificationContext.Provider value={{ updateNotification, notification }}>
      {children}
      {notification && (
        <div
          className={`${classes} z-50 p-1 mx-auto mt-4 w-[200px] rounded shadow-md shadow-gray-400 gelatine`}
        >
          <p className="text-center font-semibold text-white">{notification}</p>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
