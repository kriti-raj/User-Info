import { useState, useEffect } from "react";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    ipAddress: "",
    location: "",
    deviceInfo: "",
    browserInfo: "",
    screenResolution: "",
    language: "",
    timeZone: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Fetch IP address and location
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const locationResponse = await fetch(
          `https://ipapi.co/${ipData.ip}/json/`
        );
        const locationData = await locationResponse.json();

        // Get device and browser info
        const userAgent = navigator.userAgent;
        const browserInfo = getBrowserInfo(userAgent);
        const deviceInfo = getDeviceInfo(userAgent);

        setUserInfo({
          ipAddress: ipData.ip,
          location: `${locationData.city}, ${locationData.region}, ${locationData.country_name}`,
          deviceInfo,
          browserInfo,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language || navigator.userLanguage,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const getBrowserInfo = (userAgent) => {
    const browserRegexes = [
      /firefox/i,
      /chrome/i,
      /safari/i,
      /opera/i,
      /msie/i,
      /trident/i,
    ];
    const browserNames = [
      "Firefox",
      "Chrome",
      "Safari",
      "Opera",
      "Internet Explorer",
      "Internet Explorer",
    ];

    for (let i = 0; i < browserRegexes.length; i++) {
      if (browserRegexes[i].test(userAgent)) {
        return browserNames[i];
      }
    }
    return "Unknown";
  };

  const getDeviceInfo = (userAgent) => {
    if (/Android/i.test(userAgent)) {
      return "Android Device";
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS Device";
    } else if (/Win/.test(userAgent)) {
      return "Windows Device";
    } else if (/Mac/i.test(userAgent)) {
      return "Mac Device";
    } else if (/Linux/.test(userAgent)) {
      return "Linux Device";
    } else {
      return "Unknown Device";
    }
  };

  return (
    <div>
      <h2>User Information</h2>
      <p>IP Address: {userInfo.ipAddress}</p>
      <p>Location: {userInfo.location}</p>
      <p>Device: {userInfo.deviceInfo}</p>
      <p>Browser: {userInfo.browserInfo}</p>
      <p>Screen Resolution: {userInfo.screenResolution}</p>
      <p>Language: {userInfo.language}</p>
      <p>Time Zone: {userInfo.timeZone}</p>
    </div>
  );
};

export default UserInfo;
