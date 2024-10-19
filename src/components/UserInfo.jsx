import { useState, useEffect } from "react";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    ipAddress: "Loading...",
    ispLocation: "Loading...",
    preciseLocation: "Loading...",
    latLong: "Loading...",
    deviceInfo: "Loading...",
    browserInfo: "Loading...",
    screenResolution: "Loading...",
    language: "Loading...",
    timeZone: "Loading...",
    connection: "Loading...",
    batteryLevel: "Loading...",
    orientation: "Loading...",
    location: "Loading...",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Get precise location using GPS or nearest cell network
        let preciseLocation = "Not available";
        let latLong = "Not available";
        if ("geolocation" in navigator) {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
              });
            });

            // Use reverse geocoding to get a human-readable address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            const address = data.display_name || "Address not found";
            preciseLocation = `${address}`;
            latLong = `${position.coords.latitude}, ${position.coords.longitude}`;
          } catch (error) {
            console.log("Error getting precise location:", error);
            preciseLocation = "Error: Unable to retrieve location";
          }
        }

        // Fetch IP address and approximate location
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

        // Get connection info
        let connection = "Not available";
        if ("connection" in navigator && navigator.connection) {
          const { effectiveType, downlink, rtt } = navigator.connection;
          connection = `Type: ${effectiveType}, Downlink: ${downlink} Mbps, RTT: ${rtt} ms`;
        }

        // Get battery info
        let batteryLevel = "Not available";
        if ("getBattery" in navigator) {
          try {
            const battery = await navigator.getBattery();
            batteryLevel = `${battery.level * 100}%`;
          } catch (error) {
            console.log("Error getting battery info:", error);
          }
        } else if ("battery" in navigator) {
          try {
            const battery = await navigator.battery;
            batteryLevel = `${battery.level * 100}%`;
          } catch (error) {
            console.log("Error getting battery info:", error);
          }
        }

        // Get screen orientation
        const orientation = screen.orientation
          ? screen.orientation.type
          : "Not available";

        const newUserInfo = {
          ipAddress: ipData.ip,
          ispL: `${locationData.city}, ${locationData.region}, ${locationData.country_name}`,
          preciseLocation,
          latLong,
          deviceInfo,
          browserInfo,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language || navigator.userLanguage,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          connection,
          batteryLevel,
          orientation,
        };

        console.log("Fetched user info:", newUserInfo);
        setUserInfo(newUserInfo);
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
      <p>ISP Location: {userInfo.ispL}</p>
      <p>Precise Location: {userInfo.preciseLocation}</p>
      <p>Lat-Long: {userInfo.latLong}</p>
      <p>Device: {userInfo.deviceInfo}</p>
      <p>Browser: {userInfo.browserInfo}</p>
      <p>Screen Resolution: {userInfo.screenResolution}</p>
      <p>Language: {userInfo.language}</p>
      <p>Time Zone: {userInfo.timeZone}</p>
      <p>Connection Info: {userInfo.connection}</p>
      <p>Battery Level: {userInfo.batteryLevel}</p>
      <p>Screen Orientation: {userInfo.orientation}</p>
    </div>
  );
};

export default UserInfo;
